import React from "react";
import "./home-prelogin.css";
import { Link } from "react-router-dom";

export default function HomePrelogin() {
  return (
    <>
      <div className="home-container">

        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-overlay">
            <h1>
              Unlock the Secrets of Physiology with AnatomiX
            </h1>
            <p>
              AnatomiX is your ultimate interactive learning platform designed to make
              complex physiology concepts easy to understand for high school students.
            </p>
            <Link to="/home-loggedin" className="btn-primary">
            Start Learning Today
            </Link>
          </div>
        </section>

        {/* What AnatomiX Offers */}
        <section className="offers-section">
          <h2>What AnatomiX Offers</h2>
          <p>Dive into core functionalities that make learning efficient and enjoyable.</p>
          <div className="offer-grid">
            <div className="offer-card">
              <i className="icon">🤖</i>
              <h3>AI Chatbot</h3>
              <p>
                Get instant answers to your toughest physiology questions, available in
                both Thai and English. Your personal tutor, 24/7.
              </p>
            </div>

            <div className="offer-card">
              <i className="icon">📝</i>
              <h3>Quiz Generator</h3>
              <p>
                Create custom quizzes based on topics and question types to test your
                knowledge and track your mastery.
              </p>
            </div>
          </div>
        </section>

        {/* Why Choose Section */}
        <section className="why-section">
          <h2>Why Choose AnatomiX?</h2>
          <p>
            Experience learning tailored to your needs, ensuring deeper understanding
            and better results.
          </p>
          <div className="why-grid">
            <div className="why-item">
              <h4>📚 Simplified Learning</h4>
              <p>
                Break down complex concepts into easy-to-understand visual aids for better
                retention.
              </p>
            </div>
            <div className="why-item">
              <h4>🎯 Personalized Practice</h4>
              <p>
                Generate quizzes tailored to your learning style and identify areas for
                improvement.
              </p>
            </div>
            <div className="why-item">
              <h4>⚡ Instant Support</h4>
              <p>
                Access an AI tutor anytime for immediate clarification and guidance.
              </p>
            </div>
          </div>
        </section>

      </div>
    </>
  );
}
//  src/Home/home-prelogin.js