import React from "react";
import { Link } from "react-router-dom";
import { auth } from "../firebase"; // import จาก firebase.js
import { signOut } from "firebase/auth";

export default function Profile({ setIsLoggedIn }) {
  function handleLogout() {
    signOut(auth)
        .then(() => {
        // ออกจากระบบสำเร็จ
        console.log("User logged out");
        // อัปเดต state ถ้ามี เช่น
        setIsLoggedIn(false);
        })
        .catch((error) => {
        console.error("Logout error:", error);
        });
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Your Profile</h1>
      <p>See your activity summary, quiz results, and account info.</p>
      <button onClick={handleLogout}><Link to="/login" style={{ color: "black", padding: "15px" }}>Logout</Link></button>
    </div>
  );
}