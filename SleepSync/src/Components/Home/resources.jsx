import React from 'react';
import './resources.css';
import img1 from '../../assets/img1.jpg';
import img2 from '../../assets/img2.jpg';
import img3 from '../../assets/img3.jpg';
import img4 from '../../assets/img4.jpg';
import img5 from '../../assets/img5.jpg';
import img6 from '../../assets/img6.jpg';

const Resources = () => {
  const resourceCards = [img1, img2, img3, img4, img5, img6];

  return (
    <div>
      <main className="resource-container">
        <section className="intro">
          <h1>About us</h1>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </p>
        </section>

        <hr />

        <section className="what">
          <h1>What is Sleep Apnea?</h1>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </p>
          <ul>
            <li>eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui</li>
            <li>eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt</li>
            <li>eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt</li>
          </ul>
        </section>

        <hr />

        <section className="education">
          <h2>Learn more about sleep apnea</h2>
          <p>Explore educational resources!</p>
          <div className="card-grid">
            {resourceCards.map((src, idx) => (
              <div key={idx} className="card">
                <img src={src} alt="Sleep Apnea Education" />
                <div className="card-text">
                  <h4>Understanding Sleep Apnea</h4>
                  <p>Learn the basics of sleep apnea</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Resources;