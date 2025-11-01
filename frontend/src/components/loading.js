import React from "react";
import "./loading.css";

export default function Loading() {
  return (
    <div className="loading-overlay">
      <div className="loading-box">
        <div className="spinner"></div>
        <h2>Loading AnatomiX...</h2>
      </div>
    </div>
  );
}