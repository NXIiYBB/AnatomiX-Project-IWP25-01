import React from "react";
import "./Home.css";
import { useNavigate } from "react-router-dom";

function FeatureCard({ title, desc }) {
  return (
    <div className="features-preview">
      <h2>{title}</h2>
      <p>{desc}</p>
    </div>
  );
}

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      {/* Overlay top */}
      <div className="overlay">
        <div className="home-content">
          <h1>Unlock the Secret of Physiology with AnatomiX</h1>
          <p className="tagline">
            <span>AnatomiX</span> is your ultimate interactive learning platform,
            designed to make complex physiology concepts easy to understand for high school students.
          </p>
          <div className="home-buttons">
            <button
              className="primary-btn"
              onClick={() => navigate("/home_loggedin")}
            >
              Sign In
            </button>
            <button
              className="secondary-btn"
              onClick={() => navigate("/home_loggedin")}
            >
              Register
            </button>
          </div>
        </div>
      </div>

      {/* Features section */}
      <div className="features">
        <h2>Key Features of AnatomiX</h2>
        <div className="features-grid">
          <FeatureCard
            title="AI Chatbot"
            desc="Get instant answers to your physiology questions with our intelligent AI."
          />
          <FeatureCard
            title="Interactive Diagrams"
            desc="Explore complex physiological concepts through adaptive, clickable 3D diagrams."
          />
          <FeatureCard
            title="Quiz Generator"
            desc="Create custom quizzes to test your knowledge and track your understanding."
          />
        </div>
      </div>
    </div>
  );
}
