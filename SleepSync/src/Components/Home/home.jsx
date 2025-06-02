import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, signOut, onAuthStateChanged } from 'firebase/auth';
import './home.css';
import img1 from '../../assets/img1.jpg';
import img2 from '../../assets/img2.jpg';
import img3 from '../../assets/img3.jpg';

const Home = () => {
  const navigate = useNavigate();
  const auth = getAuth();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user && !user.isAnonymous);
    });
    return () => unsubscribe();
  }, [auth]);

  const handleAuthClick = () => {
    if (isLoggedIn) {
      signOut(auth).then(() => navigate('/'));
    } else {
      navigate('/login');
    }
  };

  const handleKeyDown = (e, path) => {
    if (e.key === 'Enter') navigate(path);
  };

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero" role="region" aria-labelledby="hero-heading">
        <div className="hero-content">
          <h1 id="hero-heading">Better Sleep. Better Life</h1>
          <p>A comprehensive platform to understand, manage, and improve your sleep apnea journey</p>
          <button
            className="hero-btn"
            onClick={handleAuthClick}
            aria-label={isLoggedIn ? 'Log out from your account' : 'Sign up or log in to your account'}
          >
            {isLoggedIn ? 'Log Out' : 'Sign-up / Log-in'}
          </button>
        </div>
      </section>

      {/* About Section */}
      <section className="about" role="region" aria-labelledby="about-heading" aria-describedby="about-desc">
        <h2 id="about-heading">About Us</h2>
        <p id="about-desc">Learn more about us and explore our forums, behavior tracker, and resources</p>
        <button
          className="learn-more-btn"
          onClick={() => navigate('/resources')}
          aria-label="Navigate to educational resources"
        >
          Learn More
        </button>
      </section>

      {/* Features Section */}
      <section className="features" role="region" aria-labelledby="features-heading">
        <h2 id="features-heading">Our Features</h2>
        <div className="feature-cards">
          <div
            className="feature-card clickable"
            onClick={() => navigate('/resources')}
            onKeyDown={(e) => handleKeyDown(e, '/resources')}
            role="button"
            tabIndex={0}
            aria-label="Explore Educational Resources"
          >
            <div className="icon" aria-hidden="true">📚</div>
            <h3>Educational Resources</h3>
            <p>Learn about sleep apnea and treatments</p>
          </div>

          <div
            className="feature-card clickable"
            onClick={() => navigate('/discussion')}
            onKeyDown={(e) => handleKeyDown(e, '/discussion')}
            role="button"
            tabIndex={0}
            aria-label="Join the Discussion Forum"
          >
            <div className="icon" aria-hidden="true">💬</div>
            <h3>Discussion Forum</h3>
            <p>Connect with others and share experiences</p>
          </div>

          <div
            className="feature-card clickable"
            onClick={() => navigate('/tracker')}
            onKeyDown={(e) => handleKeyDown(e, '/tracker')}
            role="button"
            tabIndex={0}
            aria-label="Track your behaviors and symptoms"
          >
            <div className="icon" aria-hidden="true">📈</div>
            <h3>Behavior Tracker</h3>
            <p>Monitor your progress and symptoms</p>
          </div>
        </div>
      </section>

      {/* Embedded Video Section */}
      <section className="video-section" role="region" aria-labelledby="video-heading" aria-describedby="video-desc">
        <h2 id="video-heading">What is Obstructive Sleep Apnea?</h2>
        <p id="video-desc">Watch this educational video to learn about symptoms, causes, and treatment options.</p>
        <div className="video-wrapper">
          <iframe
            width="100%"
            height="400"
            src="https://www.youtube.com/embed/xEuFw_nu8oA"
            title="Obstructive Sleep Apnea Awareness Video"
            aria-label="Embedded video explaining obstructive sleep apnea from YouTube"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </section>

      {/* Educational Resources Section */}
      <section className="resources" role="region" aria-labelledby="resources-heading">
        <h2 id="resources-heading">Educational Resources</h2>
        <div className="card-grid">
          <a
            href="https://www.mayoclinic.org/diseases-conditions/sleep-apnea/diagnosis-treatment/drc-20377636"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Learn about treatment options for sleep apnea on Mayo Clinic"
          >
            <div className="card">
              <img src={img1} alt="Treatment Options Explained" />
              <div className="card-text">
                <h4>Treatment Options Explained</h4>
                <p>CPAP, oral devices, surgeries—what’s right for you?</p>
              </div>
            </div>
          </a>

          <a
            href="https://www.nhlbi.nih.gov/health/sleep-apnea/living-with"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Read about living with sleep apnea on NHLBI"
          >
            <div className="card">
              <img src={img2} alt="Living with Sleep Apnea" />
              <div className="card-text">
                <h4>Living with Sleep Apnea</h4>
                <p>Real stories, daily habits, and support networks</p>
              </div>
            </div>
          </a>

          <a
            href="https://www.sleepapnea.org/cpap/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Guide to CPAP machines from sleepapnea.org"
          >
            <div className="card">
              <img src={img3} alt="Guide to CPAP Machines" />
              <div className="card-text">
                <h4>A Guide to CPAP Machines</h4>
                <p>A quick start guide to CPAP therapy—setup, cleaning, and common problems.</p>
              </div>
            </div>
          </a>
        </div>

        <button
          className="view-all-btn"
          onClick={() => navigate('/resources')}
          aria-label="View all educational resources"
        >
          View All Resources
        </button>
      </section>
      <div className='meet our team'>
        <h1>Meet Our Team!</h1>
      </div>
      <div className='image-row'>
        <div className='image-container'>
          <div className='image-name'>Diana Almanza Almonte
            <a href="https://www.linkedin.com/in/diana-almanza-almonte-79bb67232/" target="_blank" rel="noopener noreferrer">
                <img class="linkedin-logo" src="/IMGs/Linkedin.png" alt="Linkedin-logo" />
            </a>
          </div>
          <img class="profile-pic" src="/IMGs/diana.jpeg" alt="Diana Linkedin pic" />
        </div>
      </div>


    </div>
  );
};

export default Home;
