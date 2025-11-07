from flask import Flask, request, jsonify, make_response
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta
from flask_cors import CORS
import os
from functools import wraps

# Initialize Flask app
app = Flask(__name__)

# Configure CORS with more specific settings
cors = CORS(
    app,
    resources={
        r"/*": {
            "origins": ["http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:5173", "http://127.0.0.1:5173"],
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"],
            "supports_credentials": True,
            "expose_headers": ["Content-Type", "Authorization"],
            "vary_header": False
        }
    }
)

app.config['SECRET_KEY'] = 'your-secret-key-here'  # Change this in production
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///talentlink.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = 'jwt-secret-key'  # Change this in production
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=1)

# Request logging middleware
@app.before_request
def log_request():
    print(f"{request.method} {request.path} - Headers: {dict(request.headers)}")
    if request.method == 'OPTIONS':
        # Handle preflight requests
        return '', 200

# Initialize extensions
db = SQLAlchemy(app)
jwt = JWTManager(app)

# Database Models
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(20), nullable=False)  # 'client' or 'freelancer'
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    projects = db.relationship('Project', backref='owner', lazy=True)
    proposals = db.relationship('Proposal', backref='freelancer', lazy=True)

class Project(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=False)
    category = db.Column(db.String(100))
    budget = db.Column(db.Float, nullable=False)
    status = db.Column(db.String(20), default='open')  # open, in_progress, completed
    deadline = db.Column(db.DateTime)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    client_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    proposals = db.relationship('Proposal', backref='project', lazy=True)

class Proposal(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    cover_letter = db.Column(db.Text, nullable=False)
    bid_amount = db.Column(db.Float, nullable=False)
    status = db.Column(db.String(20), default='pending')  # pending, accepted, rejected
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    freelancer_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    project_id = db.Column(db.Integer, db.ForeignKey('project.id'), nullable=False)

class Message(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    sender_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    receiver_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    project_id = db.Column(db.Integer, db.ForeignKey('project.id'), nullable=True)

# CORS Helper Functions
def _build_cors_preflight_response():
    response = make_response()
    response.headers.add('Access-Control-Allow-Headers', "Content-Type,Authorization")
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    response.headers.add('Access-Control-Allow-Credentials', 'true')
    return response

def _corsify_actual_response(response):
    # Let Flask-CORS handle the CORS headers
    return response

# Helper Functions
def role_required(role):
    def decorator(f):
        @wraps(f)
        @jwt_required()
        def decorated_function(*args, **kwargs):
            current_user = get_jwt_identity()
            user = User.query.get(current_user['id'])
            if user.role != role:
                return jsonify({'message': 'Unauthorized'}), 403
            return f(*args, **kwargs)
        return decorated_function
    return decorator

# Authentication Routes
@app.route('/api/auth/register', methods=['POST', 'OPTIONS'])
def register():
    print("\n=== Registration Request ===")
    print(f"Method: {request.method}")
    print(f"Headers: {dict(request.headers)}")
    
    if request.method == 'OPTIONS':
        print("Handling OPTIONS request")
        response = make_response()
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
        response.headers.add('Access-Control-Allow-Methods', 'POST')
        return response

    try:
        data = request.get_json()
        print(f"Received data: {data}")
        
        if not data:
            print("Error: No data provided")
            return jsonify({'message': 'No data provided'}), 400
            
        if not data.get('email') or not data.get('password'):
            print("Error: Email and password are required")
            return jsonify({'message': 'Email and password are required'}), 400
        
        existing_user = User.query.filter_by(email=data['email']).first()
        if existing_user:
            print(f"Error: Email {data['email']} already registered")
            return jsonify({'message': 'Email already registered'}), 400
        
        print(f"Creating user with email: {data['email']}")
        hashed_password = generate_password_hash(data['password'], method='pbkdf2:sha256')
        
        user = User(
            name=data.get('name', ''),
            email=data['email'],
            password=hashed_password,
            role=data.get('role', 'freelancer')  # Default to freelancer if not specified
        )
        
        db.session.add(user)
        db.session.commit()
        print(f"User created successfully with ID: {user.id}")
        
        try:
            access_token = create_access_token(identity={
                'id': user.id,
                'email': user.email,
                'role': user.role
            })
            print("Access token created successfully")
            
            response_data = {
                'message': 'User registered successfully',
                'access_token': access_token,
                'user': {
                    'id': user.id,
                    'name': user.name,
                    'email': user.email,
                    'role': user.role
                }
            }
            print(f"Sending response: {response_data}")
            return jsonify(response_data), 201
            
        except Exception as token_error:
            print(f"Error creating access token: {str(token_error)}")
            db.session.rollback()
            return jsonify({'message': 'Error creating access token'}), 500
            
    except Exception as e:
        print(f"Registration error: {str(e)}")
        db.session.rollback()
        return jsonify({
            'message': 'Registration failed',
            'error': str(e),
            'error_type': type(e).__name__
        }), 500

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(email=data['email']).first()
    
    if not user or not check_password_hash(user.password, data['password']):
        return jsonify({'message': 'Invalid credentials'}), 401
    
    access_token = create_access_token(identity={
        'id': user.id,
        'email': user.email,
        'role': user.role
    })
    
    return jsonify({
        'access_token': access_token,
        'user': {
            'id': user.id,
            'name': user.name,
            'email': user.email,
            'role': user.role
        }
    }), 200

# Project Routes
@app.route('/api/projects', methods=['GET'])
@jwt_required()
def get_projects():
    try:
        projects = Project.query.all()
        return jsonify([{
            'id': p.id,
            'title': p.title,
            'description': p.description,
            'category': p.category,
            'budget': p.budget,
            'status': p.status,
            'deadline': p.deadline.isoformat() if p.deadline else None,
            'created_at': p.created_at.isoformat(),
            'client_id': p.client_id
        } for p in projects])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/projects/my-projects', methods=['GET'])
@jwt_required()
@role_required('client')
def get_my_projects():
    try:
        current_user = get_jwt_identity()
        projects = Project.query.filter_by(client_id=current_user['id']).all()
        return jsonify([{
            'id': p.id,
            'title': p.title,
            'description': p.description,
            'category': p.category,
            'budget': p.budget,
            'status': p.status,
            'deadline': p.deadline.isoformat() if p.deadline else None,
            'created_at': p.created_at.isoformat()
        } for p in projects])
    except Exception as e:
        print(f"Error fetching projects: {str(e)}")
        return jsonify({'error': 'Failed to fetch projects'}), 500

@app.route('/api/projects', methods=['POST', 'OPTIONS'])
@jwt_required()
@role_required('client')
def create_project():
    if request.method == 'OPTIONS':
        return _build_cors_preflight_response()
        
    try:
        current_user = get_jwt_identity()
        data = request.get_json()
        
        # Log the received data for debugging
        print("Received project data:", data)
        
        # Convert budget to float, handling different formats
        try:
            if isinstance(data['budget'], str):
                budget = float(data['budget'].replace('$', '').replace(',', '').strip())
            else:
                budget = float(data['budget'])
        except (ValueError, KeyError) as e:
            return jsonify({'error': 'Invalid budget format'}), 400
        
        # Handle deadline if provided
        deadline = None
        if data.get('deadline'):
            try:
                deadline = datetime.strptime(data['deadline'], '%Y-%m-%d')
            except ValueError:
                return jsonify({'error': 'Invalid date format. Use YYYY-MM-DD'}), 400
        
        # Create and save the project
        project = Project(
            title=data.get('title', ''),
            description=data.get('description', ''),
            category=data.get('category'),
            budget=budget,
            status='open',
            client_id=current_user['id'],
            deadline=deadline
        )
        
        db.session.add(project)
        db.session.commit()
        
        response = jsonify({
            'message': 'Project created successfully', 
            'project_id': project.id,
            'project': {
                'id': project.id,
                'title': project.title,
                'status': project.status,
                'created_at': project.created_at.isoformat()
            }
        })
        
        return _corsify_actual_response(response), 201
        
    except Exception as e:
        db.session.rollback()
        print(f"Error creating project: {str(e)}")
        return _corsify_actual_response(jsonify({'error': str(e)})), 500

# Proposal Routes
@app.route('/api/proposals', methods=['POST'])
@jwt_required()
@role_required('freelancer')
def create_proposal():
    try:
        current_user = get_jwt_identity()
        data = request.get_json()
        
        # Check if already applied
        existing = Proposal.query.filter_by(
            freelancer_id=current_user['id'],
            project_id=data['project_id']
        ).first()
        
        if existing:
            return jsonify({'error': 'You have already submitted a proposal for this project'}), 400
            
        proposal = Proposal(
            cover_letter=data['cover_letter'],
            bid_amount=data['bid_amount'],
            freelancer_id=current_user['id'],
            project_id=data['project_id']
        )
        
        db.session.add(proposal)
        db.session.commit()
        
        return jsonify({
            'message': 'Proposal submitted successfully',
            'proposal_id': proposal.id
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400

@app.route('/api/projects/available', methods=['GET'])
@jwt_required()
@role_required('freelancer')
def get_available_projects():
    try:
        # Get projects that are open and not created by the current user
        current_user = get_jwt_identity()
        
        projects = Project.query.filter(
            Project.status == 'open',
            Project.client_id != current_user['id'],
            ~Project.proposals.any(Proposal.freelancer_id == current_user['id'])
        ).all()
        
        return jsonify([{
            'id': p.id,
            'title': p.title,
            'description': p.description,
            'budget': p.budget,
            'deadline': p.deadline.isoformat() if p.deadline else None,
            'category': p.category,
            'status': p.status,
            'client_name': p.owner.name
        } for p in projects])
        
    except Exception as e:
        print(f"Error fetching available projects: {str(e)}")
        return jsonify({'error': 'Failed to fetch available projects'}), 500

@app.route('/api/proposals/accepted', methods=['GET'])
@jwt_required()
@role_required('freelancer')
def get_accepted_proposals():
    try:
        current_user = get_jwt_identity()
        
        # Get all proposals for the current freelancer
        proposals = Proposal.query.filter_by(
            freelancer_id=current_user['id']
        ).join(Project).add_entity(Project).all()
        
        result = []
        for proposal, project in proposals:
            result.append({
                'id': proposal.id,
                'project_id': project.id,
                'project_title': project.title,
                'project_description': project.description,
                'proposal_status': proposal.status,  # Changed from project.status to proposal.status
                'project_status': project.status,    # Keep project status as well
                'bid_amount': proposal.bid_amount,
                'cover_letter': proposal.cover_letter,
                'client_name': project.owner.name,
                'client_id': project.owner.id,       # Added client_id for messaging
                'created_at': proposal.created_at.isoformat(),
                'deadline': project.deadline.isoformat() if project.deadline else None
            })
            
        return jsonify(result)
        
    except Exception as e:
        print(f"Error fetching accepted proposals: {str(e)}")
        return jsonify({'error': 'Failed to fetch accepted proposals'}), 500

# Project Detail Routes
@app.route('/api/projects/<int:project_id>', methods=['GET'])
@jwt_required()
def get_project(project_id):
    try:
        current_user = get_jwt_identity()
        project = Project.query.get_or_404(project_id)
        
        # Check if current user is the owner or has a proposal
        if project.client_id != current_user['id']:
            # Check if user has a proposal for this project
            proposal = Proposal.query.filter_by(
                project_id=project_id,
                freelancer_id=current_user['id']
            ).first()
            
            if not proposal and current_user['role'] != 'admin':
                return jsonify({'error': 'Not authorized to view this project'}), 403
        
        return jsonify({
            'id': project.id,
            'title': project.title,
            'description': project.description,
            'category': project.category,
            'budget': project.budget,
            'status': project.status,
            'deadline': project.deadline.isoformat() if project.deadline else None,
            'client_id': project.client_id,
            'client_name': project.owner.name,
            'created_at': project.created_at.isoformat()
        }), 200
        
    except Exception as e:
        print(f"Error fetching project: {str(e)}")
        return jsonify({'error': 'Failed to fetch project details'}), 500

@app.route('/api/projects/<int:project_id>/proposals', methods=['GET'])
@jwt_required()
def get_project_proposals(project_id):
    try:
        current_user = get_jwt_identity()
        project = Project.query.get_or_404(project_id)
        
        # Only project owner can view proposals
        if project.client_id != current_user['id'] and current_user['role'] != 'admin':
            return jsonify({'error': 'Not authorized to view these proposals'}), 403
        
        proposals = Proposal.query.filter_by(project_id=project_id).all()
        
        result = []
        for proposal in proposals:
            freelancer = User.query.get(proposal.freelancer_id)
            result.append({
                'id': proposal.id,
                'freelancer_id': freelancer.id,
                'freelancer_name': freelancer.name,
                'freelancer_email': freelancer.email,
                'cover_letter': proposal.cover_letter,
                'bid_amount': proposal.bid_amount,
                'status': proposal.status,
                'created_at': proposal.created_at.isoformat()
            })
            
        return jsonify(result), 200
        
    except Exception as e:
        print(f"Error fetching project proposals: {str(e)}")
        return jsonify({'error': 'Failed to fetch project proposals'}), 500

@app.route('/api/proposals/<int:proposal_id>', methods=['PUT'])
@jwt_required()
def update_proposal(proposal_id):
    try:
        current_user = get_jwt_identity()
        data = request.get_json()
        
        if 'status' not in data or data['status'] not in ['accepted', 'rejected']:
            return jsonify({'error': 'Invalid status. Must be "accepted" or "rejected"'}), 400
            
        proposal = Proposal.query.get_or_404(proposal_id)
        project = Project.query.get_or_404(proposal.project_id)
        
        # Only project owner can update proposal status
        if project.client_id != current_user['id'] and current_user['role'] != 'admin':
            return jsonify({'error': 'Not authorized to update this proposal'}), 403
            
        # If accepting a proposal, reject all other proposals for this project
        if data['status'] == 'accepted':
            # Check if project is still open
            if project.status != 'open':
                return jsonify({'error': 'This project is no longer open for accepting proposals'}), 400
                
            # Reject all other proposals for this project
            Proposal.query.filter(
                Proposal.project_id == project.id,
                Proposal.id != proposal_id
            ).update({'status': 'rejected'}, synchronize_session=False)
            
            # Update project status to 'in_progress' and set the freelancer
            project.status = 'in_progress'
            project.freelancer_id = proposal.freelancer_id
        
        # Update the proposal status
        proposal.status = data['status']
        
        db.session.commit()
        
        return jsonify({
            'message': f'Proposal {data["status"]} successfully',
            'project_status': project.status
        }), 200
        
    except Exception as e:
        db.session.rollback()
        print(f"Error updating proposal: {str(e)}")
        return jsonify({'error': 'Failed to update proposal'}), 500

# User Routes
@app.route('/api/auth/me', methods=['GET'])
@jwt_required()
def get_current_user():
    current_user = get_jwt_identity()
    user = User.query.get(current_user['id'])
    
    return jsonify({
        'id': user.id,
        'name': user.name,
        'email': user.email,
        'role': user.role
    }), 200

# Initialize Database
with app.app_context():
    db.create_all()
    
    # Create admin user if not exists
    if not User.query.filter_by(email='admin@talentlink.com').first():
        admin = User(
            email='admin@talentlink.com',
            password=generate_password_hash('admin123', method='pbkdf2:sha256'),
            role='admin'
        )
        db.session.add(admin)
        db.session.commit()

if __name__ == '__main__':
    app.run(debug=True, port=5000)