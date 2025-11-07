# TalentLink - Freelance Talent Marketplace

TalentLink is a full-stack freelance talent marketplace platform that connects clients with skilled freelancers. Built with React (Vite) for the frontend and Flask for the backend, featuring real-time messaging, project management, and secure authentication.

## 🚀 Features

- User authentication (Client/Freelancer roles)
- Project posting and management
- Proposal submission and management
- Real-time messaging
- Project categories and search functionality
- Responsive design

## 🛠️ Prerequisites

- Node.js (v16 or higher)
- Python (3.8 or higher)
- pip (Python package manager)
- SQLite (for development)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/talentlink.git
cd talentlink
```

### 2. Backend Setup

1. Create and activate a virtual environment (recommended):
   ```bash
   # Windows
   python -m venv venv
   .\venv\Scripts\activate

   # macOS/Linux
   python3 -m venv venv
   source venv/bin/activate
   ```

2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory with the following variables:
   ```
   FLASK_APP=app.py
   FLASK_ENV=development
   SECRET_KEY=your-secret-key-here
   JWT_SECRET_KEY=your-jwt-secret-key
   DATABASE_URL=sqlite:///talentlink.db
   ```


### 3. Frontend Setup

1. Install Node.js dependencies:
   ```bash
   cd frontend
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

### 4. Start the Backend Server

In a new terminal window, with your virtual environment activated:

```bash
# From the project root directory
python app.py
```

## 🌐 Access the Application

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000


## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request


## 🙏 Acknowledgments

- Built with React, Vite, and Flask
- Using Socket.IO for real-time features
- Icons by Lucide and Phosphor
