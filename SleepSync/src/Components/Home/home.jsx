import React from 'react';
import './home.css';
import img1 from '../../assets/img1.jpg';
import img2 from '../../assets/img2.jpg';
import img3 from '../../assets/img3.jpg';

const Home = () => {
  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Better Sleep. Better Life</h1>
          <p>A comprehensive platform to understand, manage, and improve your sleep apnea journey</p>
          <button className="hero-btn">Sign-up / Log-in</button>
        </div>
      </section>

      {/* About Section */}
      <section className="about">
        <h2>About us</h2>
        <p>Learn more about us and explore our forums, behavior tracker, and resources</p>
        <button className="learn-more-btn">Learn More</button>
      </section>

      {/* Features Section */}
      <section className="features">
        <h2>Our Features</h2>
        <div className="feature-cards">
          <div className="feature-card">
            <div className="icon">📚</div>
            <h3>Educational Resources</h3>
            <p>Learn about sleep apnea and treatments</p>
          </div>
          <div className="feature-card">
            <div className="icon">💬</div>
            <h3>Discussion Forum</h3>
            <p>Connect with others and share experiences</p>
          </div>
          <div className="feature-card">
            <div className="icon">📈</div>
            <h3>Behavior Tracker</h3>
            <p>Monitor your progress and symptoms</p>
          </div>
        </div>
      </section>

      {/* Educational Resources Section */}
      <section className="resources">
        <h2>Educational Resources</h2>
        <div className="resource-cards">
          <div className="resource-card">
          <img src={img1} alt="Understanding Sleep Apnea" />
            <h4>Understanding Sleep Apnea</h4>
            <p>Learn the basics of sleep apnea</p>
          </div>
          <div className="resource-card">
          <img src={img2} alt="Understanding Sleep Apnea" />
            <h4>Understanding Sleep Apnea</h4>
            <p>Learn the basics of sleep apnea</p>
          </div>
          <div className="resource-card">
          <img src={img3} alt="Understanding Sleep Apnea" />
            <h4>Understanding Sleep Apnea</h4>
            <p>Learn the basics of sleep apnea</p>
          </div>
        </div>
        <button className="view-all-btn">View All Resources</button>
      </section>
    </div>
  );
};

export default Home;