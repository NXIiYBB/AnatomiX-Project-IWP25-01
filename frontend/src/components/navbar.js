import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav style={{ backgroundColor: "#0d6efd", padding: "10px 20px", color: "white" }}>
      <h2 style={{ display: "inline-block", marginRight: "20px" }}>AnatomiX</h2>
      <Link to="/home" style={{ color: "white", marginRight: "15px" }}>Home</Link>
      <Link to="/chat" style={{ color: "white", marginRight: "15px" }}>Chat</Link>
      <Link to="/quiz" style={{ color: "white", marginRight: "15px" }}>Quiz</Link>
      <Link to="/profile" style={{ color: "white" }}>Profile</Link>
    </nav>
  );
}