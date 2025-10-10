import React from "react";
import "./home-loggedin.css";
import { Link } from "react-router-dom";

export default function HomeLoggedIn() {
  return (
    <>
      <div className="home-container">

        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-overlay">
            <h1>
              Unlock the Power of Physiology learning
            </h1>
            <p>
              AnatomiX is an interactive web platform designed to enhance high school students learning of physiology. It feature an AI chatbot, adaptive diagrams and a quiz generation tool.
            </p>
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
              <Link to="/home-prelogin" className="card-btn">
                Chat with Bot
              </Link>
            </div>

            <div className="offer-card">
                <i className="icon">🧠</i>
                <h3>Interactive Diagrams</h3>
                <p>
                    Explore animated anatomy and physiology processes through engaging,
                    zoomable diagrams with detailed explanations.
                </p>
                <Link to="/home-prelogin" className="card-btn">
                    View Diagram
                </Link>
            </div>

            <div className="offer-card">
                <i className="icon">📝</i>
                <h3>Quiz Generator</h3>
                <p>
                    Create custom quizzes based on topics and question types to test your
                    knowledge and track your mastery.
                </p>
                <Link to="/quiz-generator" className="card-btn">
                    Generate Quiz
                </Link>
            </div>

          </div>
        </section>        
      </div>
    </>
  );
}
//  src/Home/home-loggedin.js