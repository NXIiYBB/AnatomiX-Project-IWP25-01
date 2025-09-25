// import logo from './logo.svg';
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
// import './App.css';

// import Navbar from './components/Navbar';
import Home from './components/home';
import Chat from './components/chat';
import Quiz from "./components/quiz";
import Profile from "./components/profile";
import SignIn from './components/SignIn';


function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    return (
        // <Chat />
        // <SignIn />
        <Router>
            {/* {isLoggedIn && <Navbar />} */}

            <div style={{ display: "flex" }}>

                <div style={{ flex: 1 }}>
                    <Routes>
                        <Route
                            path="/login"
                            element={isLoggedIn ? <Navigate to="/home" /> : <SignIn setIsLoggedIn={setIsLoggedIn} />}/>

                        <Route path="/home" element={isLoggedIn ? <Home /> : <Navigate to="/login" />} />
                        <Route path="/chat" element={isLoggedIn ? <Chat /> : <Navigate to="/login" />} />
                        <Route path="/quiz" element={isLoggedIn ? <Quiz /> : <Navigate to="/login" />} />
                        <Route path="/profile" element={isLoggedIn ? <Profile setIsLoggedIn={setIsLoggedIn} /> : <Navigate to="/login" />} />

                        <Route path="*" element={<Navigate to={isLoggedIn ? "/home" : "/login"} />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
}

export default App;
