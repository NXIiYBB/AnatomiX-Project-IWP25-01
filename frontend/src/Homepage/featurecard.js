import React from "react";
import "./FeatureCard.css";

function FeatureCard({ title, desc, linkText, onClick }) {
  return (
    <div className="feature-card">
      <h3>{title}</h3>
      <p>{desc}</p>
      {linkText && (
        <button className="link-btn" onClick={onClick}>
          {linkText}
        </button>
      )}
    </div>
  );
}

export default FeatureCard;
