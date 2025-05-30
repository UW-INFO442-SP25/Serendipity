import React from 'react';
import { useNavigate } from 'react-router-dom';
import './home.css';
import img1 from '../../assets/img1.jpg';
import img2 from '../../assets/img2.jpg';
import img3 from '../../assets/img3.jpg';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Better Sleep. Better Life</h1>
          <p>A comprehensive platform to understand, manage, and improve your sleep apnea journey</p>
          <button className="hero-btn" onClick={() => navigate('/login')}>
            Sign-up / Log-in
          </button>
        </div>
      </section>

      {/* About Section */}
      <section className="about">
        <h2>About us</h2>
        <p>Learn more about us and explore our forums, behavior tracker, and resources</p>
        <button className="learn-more-btn" onClick={() => navigate('/resources')}>
          Learn More
        </button>
      </section>

      {/* Features Section */}
    <section className="features">
      <h2>Our Features</h2>
      <div className="feature-cards">
        <div className="feature-card clickable" onClick={() => navigate('/resources')}>
          <div className="icon">📚</div>
          <h3>Educational Resources</h3>
          <p>Learn about sleep apnea and treatments</p>
        </div>
        <div className="feature-card clickable" onClick={() => navigate('/discussion')}>
          <div className="icon">💬</div>
          <h3>Discussion Forum</h3>
          <p>Connect with others and share experiences</p>
        </div>
        <div className="feature-card clickable" onClick={() => navigate('/tracker')}>
          <div className="icon">📈</div>
          <h3>Behavior Tracker</h3>
          <p>Monitor your progress and symptoms</p>
        </div>
      </div>
    </section>


      {/* Educational Resources Section */}
    <section className="resources">
      <h2>Educational Resources</h2>
      <div className="card-grid">
        <a href="https://www.mayoclinic.org/diseases-conditions/sleep-apnea/diagnosis-treatment/drc-20377636" target="_blank" rel="noopener noreferrer">
          <div className="card">
            <img src={img1} alt="Treatment Options Explained" />
            <div className="card-text">
              <h4>Treatment Options Explained</h4>
              <p>CPAP, oral devices, surgeries—what’s right for you?</p>
            </div>
          </div>
        </a>
        <a href="https://www.nhlbi.nih.gov/health/sleep-apnea/living-with" target="_blank" rel="noopener noreferrer">
          <div className="card">
            <img src={img2} alt="Living with Sleep Apnea" />
            <div className="card-text">
              <h4>Living with Sleep Apnea</h4>
              <p>Real stories, daily habits, and support networks</p>
            </div>
          </div>
        </a>
        <a href="https://www.sleepapnea.org/cpap/" target="_blank" rel="noopener noreferrer">
          <div className="card">
            <img src={img3} alt="Guide to CPAP Machines" />
            <div className="card-text">
              <h4>A Guide to CPAP Machines</h4>
              <p>A quick start guide to CPAP therapy—setup, cleaning, and common problems.</p>
            </div>
          </div>
        </a>
      </div>
  <button className="view-all-btn" onClick={() => navigate('/resources')}>
    View All Resources
  </button>
</section>
    </div>
  );
};

export default Home;
