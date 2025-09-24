import React from "react";
import "./Homepage.css";
import FeatureCard from "./featurecard";
import physioimg from "../pics/physio3.png";

export default function AnatomixLanding() {
  return (
    <div className="container">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-text">
          <h1>
            Unlock the <span className="highlight">Power of Physiology</span> Learning
          </h1>
          <p>
            AnatomiX is an interactive web platform designed to enhance high school
            students' learning of physiology. It features an AI chatbot, adaptive
            diagrams, and a quiz generation tool.
          </p>
          <div className="hero-buttons">
            <button className="primary-btn">Start Learning Now</button>
            <button className="secondary-btn">Explore Resources</button>
          </div>
        </div>
        <img src={physioimg} alt="Physiology" className="hero-img" />
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2>Key Features of AnatomiX</h2>
        <div className="features">
          <FeatureCard
            title="AI Chatbot"
            desc="Get instant answers to your physiology questions with our intelligent AI."
            linkText="Learn More"
            onClick={() => alert("Go to AI Chatbot page")}
          />
          <FeatureCard
            title="Interactive Diagrams"
            desc="Explore complex physiological concepts through adaptive, clickable 3D diagrams"
            linkText="View Diagrams"
            onClick={() => alert("Go to Diagrams page")}
          />
          <FeatureCard
            title="Quiz Generator"
            desc="Create custom quizzes to test your knowledge and track your understanding."
            linkText="Generate Quiz"
            onClick={() => window.location.href = "/quiz-gen"}
          />
        </div>
      </section>

      {/* Footer / CTA Section */}
      <footer>
        <h2>Ready to Master Physiology?</h2>
        <p>Join thousands of students who are already excelling with Anatomix.</p>
        <button className="primary-btn">Start Your Journey Now</button>
      </footer>
    </div>
  );
}
