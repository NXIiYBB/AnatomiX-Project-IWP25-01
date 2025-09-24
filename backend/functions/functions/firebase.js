// src/firebase.js
const { initializeApp } = require("firebase/app");
const { getAuth } = require("firebase/auth");
const { getFirestore } = require("firebase/firestore");

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

const auth = getAuth(app);
const db = getFirestore(app);

module.exports = {auth, db};
