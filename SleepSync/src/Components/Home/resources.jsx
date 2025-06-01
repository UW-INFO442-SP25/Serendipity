import React from 'react';
import './resources.css';
import img1 from '../../assets/img1.jpg';
import img2 from '../../assets/img2.jpg';
import img3 from '../../assets/img3.jpg';
import img4 from '../../assets/img4.jpg';
import img5 from '../../assets/img5.jpg';
import img6 from '../../assets/img6.jpg';

const Resources = () => {
  const resourceList = [
    {
      img: img1,
      title: 'Treatment Options Explained',
      text: 'CPAP, oral devices, surgeries—what’s right for you?',
      link: 'https://www.mayoclinic.org/diseases-conditions/sleep-apnea/diagnosis-treatment/drc-20377636',
      alt: 'Diagram of different treatment options for sleep apnea'
    },
    {
      img: img2,
      title: 'Living with Sleep Apnea',
      text: 'Real stories, daily habits, and support networks',
      link: 'https://www.nhlbi.nih.gov/health/sleep-apnea/living-with',
      alt: 'Person with CPAP machine sitting at a table'
    },
    {
      img: img3,
      title: 'A Guide to CPAP Machines',
      text: 'A quick start guide to CPAP therapy—setup, cleaning, and common problems.',
      link: 'https://www.sleepapnea.org/cpap/',
      alt: 'CPAP machine setup and cleaning instructions'
    },
    {
      img: img4,
      title: 'CPAP Machine Alternatives',
      text: 'Sleep Apnea Treatments Without CPAP',
      link: 'https://www.sleepfoundation.org/sleep-apnea/alternatives-to-cpap',
      alt: 'Illustration of alternative treatments to CPAP'
    },
    {
      img: img5,
      title: 'Sleep Apnea and Mental Health',
      text: 'Explore how poor sleep impacts your emotional and cognitive well-being',
      link: 'https://psychcentral.com/health/why-psychologists-are-starting-to-care-about-sleep-apnea#mental-health-ties',
      alt: 'Illustration of mental health effects from poor sleep'
    },
    {
      img: img6,
      title: 'Sleep Apnea Quiz',
      text: 'Answer a few quick questions to see if you are at risk',
      link: 'https://dontsleeponosa.lilly.com/identifying-osa',
      alt: 'Preview of interactive sleep apnea risk quiz'
    }
  ];

  return (
    <div>
      <main className="resource-container">
        {/* About Us */}
        <section className="intro" role="region" aria-labelledby="intro-heading">
          <h1 id="intro-heading">About Us</h1>
          <p>
            At SleepSync, we believe better sleep leads to better health. Our mission is to empower
            individuals with sleep apnea by providing clear, accessible resources that educate,
            support, and guide them toward treatment options. Whether you're newly diagnosed,
            supporting a loved one, or simply curious about sleep health, SleepSync is here to help
            you navigate your journey toward better rest.
          </p>
        </section>

        {/* What is Sleep Apnea */}
        <section className="what" role="region" aria-labelledby="what-heading">
          <h1 id="what-heading">What is Sleep Apnea?</h1>
          <p>
            Sleep apnea is a common but serious sleep disorder in which breathing repeatedly stops
            and starts during sleep. It can lead to poor sleep quality, daytime fatigue, and
            increased health risks if left untreated. There are different types of sleep apnea, and
            treatment may involve lifestyle changes, CPAP therapy, or medical procedures. Early
            diagnosis and proper care can significantly improve quality of life.
          </p>
          <figure>
            <figcaption>Common Symptoms Include:</figcaption>
            <ul role="list">
              <li role="listitem">Loud snoring or gasping during sleep</li>
              <li role="listitem">Daytime drowsiness or difficulty concentrating</li>
              <li role="listitem">Morning headaches or dry mouth</li>
              <li role="listitem">Interrupted breathing observed by a partner</li>
            </ul>
          </figure>
        </section>

        {/* Educational Resources */}
        <section className="education" role="region" aria-labelledby="resources-heading">
          <h2 id="resources-heading">Educational Resources</h2>
          <div className="card-grid">
            {resourceList.map((res, index) => (
              <a
                key={index}
                href={res.link}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Read more: ${res.title}`}
              >
                <div className="card">
                  <img src={res.img} alt={res.alt} />
                  <div className="card-text">
                    <h4>{res.title}</h4>
                    <p>{res.text}</p>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Resources;
