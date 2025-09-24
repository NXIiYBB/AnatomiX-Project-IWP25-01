// frontend/src/components/AuthForm.js
import React, { useState } from "react";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { collection, setDoc, getDocs, doc } from "firebase/firestore";

export default function AuthForm({ setIsLoggedIn }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [username, setUsername] = useState("");

  const handleSignup = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "users"));
      let usernameChecked = true;

      // เช็ค username
      querySnapshot.forEach((doc) => {
        if (doc.data().username === username) { 
          setMessage("Username already taken.");
          usernameChecked = false;
        };
      });

      if (usernameChecked) {
        // create account
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // ส่ง email verification
        await sendEmailVerification(user);
        setMessage(
            "Registered! Please check your email to verify your account. (Check your spam folder too!)"
        );

        // create collection db for new user
        try {
            await setDoc(doc(db, "users", auth.currentUser.uid), {
              username: username,
              quiz: [],
              chats: [],
            });
            } catch (e) {
              console.error("Error adding document: ", e);
              console.log(e.message)
            }
      };
    } catch (error) {
      console.error(error);
      setMessage(error.message);
    }
  };

  const handleLogin = async () => {
    try {
      // info check
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (!user.emailVerified) {
        setMessage("Please verify your email before logging in. Check your inbox or spam folder.");
        return;
      }

      setIsLoggedIn(true);
      setMessage("Login successful!");
    } catch (error) {
      console.error(error);
      setMessage(error.message);
    }
  };

  const handleResendVerification = async () => {
    if (auth.currentUser) {
      await sendEmailVerification(auth.currentUser);
      setMessage("📧 Verification email resent!");
    } else {
      setMessage("❌ No user logged in.");
    }
  };

  // เรียก API ที่ป้องกันด้วย token
  const callProtectedApi = async () => {
    try {
      const token = await auth.currentUser.getIdToken(); // ดึง Firebase ID Token
      const res = await fetch(
        "https://us-central1-anatomix-c8c63.cloudfunctions.net/api/profile",
        {
          headers: {
            Authorization: `Bearer ${token}`, // แนบ token ไปกับ request
          },
        }
      );
      const data = await res.json();
      setMessage("🔒 Protected API response: " + JSON.stringify(data));
    } catch (err) {
      setMessage("❌ " + err.message);
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto", textAlign: "center", backgroundColor: "#e7f1ff", padding: "30px", borderRadius: "8px" }}>
      <h1 style={{ color: "#0d6efd" }}>AnatomiX Auth</h1>
      
      <input
        type="username"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        style={{ display: "block", width: "100%", margin: "10px 0", padding: "10px", borderRadius: "4px", border: "1px solid #ccc" }}
      />

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ display: "block", width: "100%", margin: "10px 0", padding: "10px", borderRadius: "4px", border: "1px solid #ccc" }}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ display: "block", width: "100%", margin: "10px 0", padding: "10px", borderRadius: "4px", border: "1px solid #ccc" }}
      />

      <div style={{ marginTop: "15px" }}>
        <button
          onClick={handleSignup}
          style={{ padding: "10px 20px", backgroundColor: "#0d6efd", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", marginRight: "10px" }}
        >
          Sign Up
        </button>

        <button
          onClick={handleLogin}
          style={{ padding: "10px 20px", backgroundColor: "#198754", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
        >
          Login
        </button>
      </div>

      <div style={{ marginTop: "15px" }}>
        <button
          onClick={handleResendVerification}
          style={{ padding: "8px 16px", backgroundColor: "#ffc107", color: "#333", border: "none", borderRadius: "4px", cursor: "pointer" }}
        >
          Resend Verification Email
        </button>
      </div>

      <div style={{ marginTop: "15px" }}>
        <button
          onClick={callProtectedApi}
          style={{ padding: "8px 16px", backgroundColor: "#0dcaf0", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
        >
          Call Protected API
        </button>
      </div>

      <p style={{ marginTop: "20px", color: "#333" }}>{message}</p>
    </div>
  );
}
