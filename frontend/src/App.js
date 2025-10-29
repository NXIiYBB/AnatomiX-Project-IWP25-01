import HomePrelogin from "./Home/home-prelogin";
import HomeLoggedIn from "./Home/home-loggedin";
import QuizGenerator from "./QuizPage/quiz-generator";
import Quiz from "./QuizPage/quiz";
import Result from "./QuizPage/result";
// import logo from './logo.svg';
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
// import './App.css';

// import Navbar from './components/Navbar';
// import Home from './components/home';
import Chat from './components/chat';
// import Quiz from "./components/quiz";
import Profile from "./components/profile";
import SignIn from './components/SignIn';


function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [uid, setUid] = useState(null);

    return (
        // <Chat />
        // <SignIn />
        <Router>
            {/* {isLoggedIn && <Navbar />} */}

            <div style={{ display: "flex" }}>

                <div style={{ flex: 1 }}>
                    <Routes>
                        <Route path="/" element={<HomePrelogin />} />
                        <Route
                            path="/login"
                            element={isLoggedIn ? <Navigate to="/home-loggedin" /> : <SignIn setIsLoggedIn={setIsLoggedIn} setUid={setUid} />}/>

                        {/* <Route path="/home" element={isLoggedIn ? <Home /> : <Navigate to="/login" />} /> */}
                        <Route path="/chat" element={isLoggedIn ? <Chat uid={uid} /> : <Navigate to="/" />} />
                        {/* <Route path="/quiz" element={isLoggedIn ? <Quiz /> : <Navigate to="/login" />} /> */}
                        <Route path="/profile" element={isLoggedIn ? <Profile setIsLoggedIn={setIsLoggedIn} uid={uid} /> : <Navigate to="/" />} />
                        <Route path="/home-loggedin" element={isLoggedIn ? <HomeLoggedIn /> : <Navigate to="/" />} />
                        <Route path="/quiz-generator" element={isLoggedIn ? <QuizGenerator /> : <Navigate to="/" />} />
                        <Route path="/quiz" element={isLoggedIn ? <Quiz uid={uid} /> : <Navigate to="/" />} />
                        <Route path="/quiz-result" element={isLoggedIn ? <Result uid={uid} /> : <Navigate to="/" />} />
                        <Route path="*" element={<Navigate to={isLoggedIn ? "/home" : "/"} />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
}

export default App;

                        // <Route path="/home" element={isLoggedIn ? <Home /> : <Navigate to="/login" />} />
                        // <Route path="/chat" element={<Chat />} />
                        // <Route path="/quiz" element={isLoggedIn ? <Quiz /> : <Navigate to="/login" />} />
                        // <Route path="/profile" element={isLoggedIn ? <Profile setIsLoggedIn={setIsLoggedIn} /> : <Navigate to="/login" />} />
