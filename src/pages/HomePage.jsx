import React from "react";

export default function Home() {
  return (
    <div className="home-container">
      {/* HERO SECTION */}
      <section className="hero">
        <div className="hero-content">
          <h1>
            Find the perfect <span>freelancer</span> for your business
          </h1>
          <p>
            Connect with skilled professionals across design, development,
            writing, marketing, and more.
          </p>
          <div className="search-bar">
            <input
              type="text"
              placeholder="Try 'Logo Design' or 'Website Development'"
            />
            <button>Search</button>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="categories">
        <h2>Popular Categories</h2>
        <div className="category-grid">
          {[
            {
              name: "Web Development",
              img: "https://images.unsplash.com/photo-1522205408450-add114ad53fe",
            },
            {
              name: "Graphic Design",
              img: "https://images.unsplash.com/photo-1503602642458-232111445657",
            },
            {
              name: "Content Writing",
              img: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2",
            },
            {
              name: "Digital Marketing",
              img: "https://images.unsplash.com/photo-1519389950473-47ba0277781c",
            },
            {
              name: "Video Editing",
              img: "https://images.unsplash.com/photo-1516251193007-45ef944ab0c6",
            },
            {
              name: "App Development",
              img: "https://images.unsplash.com/photo-1555066931-4365d14bab8c",
            },
          ].map((cat, i) => (
            <div className="category-card" key={i}>
              <img src={cat.img} alt={cat.name} />
              <div className="category-info">
                <h3>{cat.name}</h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* WHY TALENTLINK */}
      <section className="why-section">
        <h2>Why Choose TalentLink?</h2>
        <div className="why-grid">
          <div className="why-card">
            <img
              src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
              alt="Verified Talent"
            />
            <h3>Verified Talent</h3>
            <p>Every freelancer is verified and skilled.</p>
          </div>
          <div className="why-card">
            <img
              src="https://cdn-icons-png.flaticon.com/512/3208/3208707.png"
              alt="Secure Payments"
            />
            <h3>Secure Payments</h3>
            <p>Pay safely through our escrow system.</p>
          </div>
          <div className="why-card">
            <img
              src="https://cdn-icons-png.flaticon.com/512/1077/1077012.png"
              alt="24/7 Support"
            />
            <h3>24/7 Support</h3>
            <p>Our support team is available anytime, anywhere.</p>
          </div>
        </div>
      </section>

      {/* FREELANCERS */}
      <section className="freelancers">
        <h2>Featured Freelancers</h2>
        <div className="freelancer-grid">
          {[
            {
              name: "Aarav Sharma",
              skill: "Web Developer",
              img: "https://images.unsplash.com/photo-1603415526960-f7e0328d0f5b",
            },
            {
              name: "Priya Desai",
              skill: "Graphic Designer",
              img: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e",
            },
            {
              name: "Rohan Gupta",
              skill: "Content Writer",
              img: "https://images.unsplash.com/photo-1522071820081-009f0129c71c",
            },
            {
              name: "Ananya Verma",
              skill: "Video Editor",
              img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d",
            },
          ].map((f, i) => (
            <div className="freelancer-card" key={i}>
              <img src={f.img} alt={f.name} />
              <h3>{f.name}</h3>
              <p>{f.skill}</p>
            </div>
          ))}
        </div>
      </section>

      

      {/* INLINE CSS STYLING */}
      <style>{`
        .home-container {
          font-family: 'Poppins', sans-serif;
          color: #222;
          background: #fff;
        }

        /* HERO */
        .hero {
          background: url("https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1500&q=80")
            no-repeat center center/cover;
          height: 80vh;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          text-align: center;
          position: relative;
        }
        .hero::after {
          content: "";
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.55);
        }
        .hero-content {
          position: relative;
          z-index: 2;
          max-width: 700px;
          padding: 0 20px;
        }
        .hero h1 {
          font-size: 3rem;
          font-weight: 700;
          margin-bottom: 15px;
        }
        .hero h1 span {
          color: #1dbf73;
        }
        .hero p {
          font-size: 1.2rem;
          margin-bottom: 25px;
        }
        .search-bar {
          display: flex;
          justify-content: center;
          gap: 10px;
        }
        .search-bar input {
          width: 70%;
          padding: 12px 15px;
          border: none;
          border-radius: 5px;
          outline: none;
        }
        .search-bar button {
          background: #1dbf73;
          border: none;
          padding: 12px 25px;
          color: #fff;
          border-radius: 5px;
          font-weight: 600;
          cursor: pointer;
        }
        .search-bar button:hover {
          background: #17a864;
        }

        /* CATEGORIES */
        .categories {
          padding: 60px 10%;
          text-align: center;
          background: #f8f9fa;
        }
        .categories h2 {
          font-size: 2rem;
          margin-bottom: 30px;
          color: #333;
        }
        .category-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 25px;
        }
        .category-card {
          background: #fff;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
          transition: 0.3s;
          cursor: pointer;
        }
        .category-card:hover {
          transform: translateY(-5px);
        }
        .category-card img {
          width: 100%;
          height: 180px;
          object-fit: cover;
        }
        .category-info {
          padding: 15px;
        }
        .category-info h3 {
          color: #1dbf73;
          font-size: 1.1rem;
        }

        /* WHY SECTION */
        .why-section {
          padding: 70px 10%;
          background: #fff;
          text-align: center;
        }
        .why-section h2 {
          font-size: 2rem;
          margin-bottom: 40px;
        }
        .why-grid {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 40px;
        }
        .why-card {
          width: 280px;
          background: #f9f9f9;
          border-radius: 10px;
          padding: 25px;
          transition: 0.3s;
        }
        .why-card:hover {
          transform: translateY(-5px);
        }
        .why-card img {
          width: 60px;
          margin-bottom: 15px;
        }
        .why-card h3 {
          color: #1dbf73;
        }

        /* FREELANCERS */
        .freelancers {
          padding: 60px 10%;
          background: #f8f9fa;
          text-align: center;
        }
        .freelancer-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 30px;
        }
        .freelancer-card {
          background: #fff;
          border-radius: 10px;
          padding: 20px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          transition: 0.3s;
        }
        .freelancer-card:hover {
          transform: translateY(-5px);
        }
        .freelancer-card img {
          width: 100%;
          border-radius: 10px;
          height: 200px;
          object-fit: cover;
          margin-bottom: 10px;
        }
        .freelancer-card h3 {
          color: #333;
        }
        .freelancer-card p {
          color: #666;
          font-size: 0.9rem;
        }

       
        }
      `}</style>
    </div>
  );
}
