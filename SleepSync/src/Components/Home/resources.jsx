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
          At SleepSync, we believe better sleep leads to better health. Our mission is to empower individuals with sleep apnea by providing clear, accessible resources that educate, support, and guide them toward treatment options. Whether you're newly diagnosed, supporting a loved one, or simply curious about sleep health, SleepSync is here to help you navigate your journey toward better rest.
          </p>
        </section>

        <hr />

        <section className="what">
          <h1>What is Sleep Apnea?</h1>
          <p>
          Sleep apnea is a common but serious sleep disorder in which breathing repeatedly stops and starts during sleep. It can lead to poor sleep quality, daytime fatigue, and increased health risks if left untreated. There are different types of sleep apnea, and treatment may involve lifestyle changes, CPAP therapy, or medical procedures. Early diagnosis and proper care can significantly improve quality of life.
          </p>
          <figure>
            <figcaption>Common Symptoms Include:</figcaption>
              <ul>
                <li>Loud snoring or gasping during sleep</li>
                <li>Daytime drowsiness or difficulty concentrating</li>
                <li>Morning headaches or dry mouth</li>
                <li>Interrupted breathing observed by a partner</li>
            </ul>
          </figure>
        </section>

        <hr />

        <section className="education">
                <h2>Educational Resources</h2>
                <div className="card-grid">
                  <a href="https://www.mayoclinic.org/diseases-conditions/sleep-apnea/diagnosis-treatment/drc-20377636">
                  <div className="card">
                    <img src={img1} alt="Understanding Sleep Apnea" />
                    <div className="card-text">
                      <h4>Treatment Options Explained</h4>
                      <p>CPAP, oral devices, surgeries—what’s right for you?</p>
                    </div>
                  </div>
                  </a>
                  <a href="https://www.nhlbi.nih.gov/health/sleep-apnea/living-with">
                  <div className="card">
                    <img src={img2} alt="Understanding Sleep Apnea" />
                    <div className="card-text">
                      <h4>Living with Sleep Apnea</h4>
                      <p>Real stories, daily habits, and support networks</p>
                    </div>
                  </div>
                  </a>
                  <a href="https://www.sleepapnea.org/cpap/">
                  <div className="card">
                    <img src={img3} alt="Understanding Sleep Apnea" />
                    <div className="card-text">
                      <h4>A Guide to CPAP Machines</h4>
                      <p>A quick start guide to CPAP therapy—setup, cleaning, and common problems.</p>
                    </div>
                  </div>
                  </a>
                  <a href="https://www.sleepfoundation.org/sleep-apnea/alternatives-to-cpap">
                  <div className="card">
                    <img src={img3} alt="Understanding Sleep Apnea" />
                    <div className="card-text">
                      <h4>CPAP Machine Alternatives</h4>
                      <p>Sleep Apnea Treatments Without CPAP</p>
                    </div>
                  </div>
                  </a>
                  <a href="https://psychcentral.com/health/why-psychologists-are-starting-to-care-about-sleep-apnea#mental-health-ties">
                  <div className="card">
                    <img src={img3} alt="Understanding Sleep Apnea" />
                    <div className="card-text">
                      <h4>Sleep Apnea and Mental Health</h4>
                      <p>Explore how poor sleep impacts your emotional and cognitive well-being</p>
                    </div>
                  </div>
                  </a>
                  <a href="https://dontsleeponosa.lilly.com/identifying-osa?gad_source=1&gad_campaignid=22173663083&gbraid=0AAAAAq1-qeam4Qq0mhynllW7Fg9ITFPVF&gclid=CjwKCAjwi-DBBhA5EiwAXOHsGZl-LPzPtZvEqIAtms7BWR83IOvm_QWQMPMXji1fUd69aogfE4efyRoCjW4QAvD_BwE">
                  <div className="card">
                    <img src={img3} alt="Understanding Sleep Apnea" />
                    <div className="card-text">
                      <h4>Sleep Apnea Quiz</h4>
                      <p>Answer a few quick questions to see if you are at risk</p>
                    </div>
                  </div>
                  </a>
                </div>
              </section>
      </main>
    </div>
  );
};

export default Resources;