// components/Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function Home() {
  return (
    <div className="home-container">
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Understand Your <span className="highlight">Best Friend</span>
          </h1>
          <p className="hero-text">
            Using advanced AI technology to bridge the communication gap between you and your furry companion.
          </p>
          <div className="cta-buttons">
            <Link to="/translate" className="cta-button primary">
              Try It Now
              <FontAwesomeIcon icon="paw" />
            </Link>
            <Link to="/how-it-works" className="cta-button secondary">
              Learn More
              <FontAwesomeIcon icon="chart-line" />
            </Link>
          </div>
        </div>
        <div className="hero-graphic">
          <div className="dog-animation">
            {/* Existing dog animation */}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="features-section">
        <h2 className="section-title">How It Works</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <FontAwesomeIcon icon="microphone" />
            </div>
            <h3>Record</h3>
            <p>Capture your dog's bark with crystal-clear audio quality</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <FontAwesomeIcon icon="brain" />
            </div>
            <h3>Analyze</h3>
            <p>Our AI processes complex bark patterns and emotions</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <FontAwesomeIcon icon="language" />
            </div>
            <h3>Translate</h3>
            <p>Get instant translations in human language</p>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="benefits-section">
        <h2 className="section-title">Why Choose Bark Translator</h2>
        <div className="benefits-grid">
          <div className="benefit-card">
            <FontAwesomeIcon icon="heart" className="benefit-icon" />
            <h3>Strengthen Your Bond</h3>
            <p>Better understand your dog's needs and emotions</p>
          </div>
          <div className="benefit-card">
            <FontAwesomeIcon icon="shield-dog" className="benefit-icon" />
            <h3>Health Monitoring</h3>
            <p>Detect potential health issues through bark patterns</p>
          </div>
          <div className="benefit-card">
            <FontAwesomeIcon icon="comments" className="benefit-icon" />
            <h3>Real-Time Translation</h3>
            <p>Instant feedback on what your dog is trying to tell you</p>
          </div>
        </div>
      </div>

      {/* Statistics Section */}
      <div className="stats-section">
        <div className="stat-card">
          <h3>10K+</h3>
          <p>Happy Dogs</p>
        </div>
        <div className="stat-card">
          <h3>95%</h3>
          <p>Accuracy Rate</p>
        </div>
        <div className="stat-card">
          <h3>24/7</h3>
          <p>Support</p>
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="bottom-cta">
        <h2>Ready to Talk with Your Dog?</h2>
        <p>Start translating barks into meaningful conversations today!</p>
        <Link to="/translate" className="cta-button primary large">
          Get Started Now
          <FontAwesomeIcon icon="paw" />
        </Link>
      </div>
    </div>
  );
}

export default Home;