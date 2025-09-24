// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA0ffSJGH-Obg70zclYVEfbM8RWtIlHy50",
  authDomain: "anatomix-c8c63.firebaseapp.com",
  projectId: "anatomix-c8c63",
  storageBucket: "anatomix-c8c63.firebasestorage.app",
  messagingSenderId: "1092377545857",
  appId: "1:1092377545857:web:119dea8edc013bf4185180",
  measurementId: "G-NDSP4H785W"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
