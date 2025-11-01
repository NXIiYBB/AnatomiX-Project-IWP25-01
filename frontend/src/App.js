import HomePrelogin from "./Home/home-prelogin";
import HomeLoggedIn from "./Home/home-loggedin";
import QuizGenerator from "./QuizPage/quiz-generator";
import Quiz from "./QuizPage/quiz";
import Result from "./QuizPage/result";
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Chat from './components/chat';
import Profile from "./components/profile";
import SignIn from './components/SignIn';


function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [uid, setUid] = useState(null);

    return (
        <Router>
            {/* {isLoggedIn && <Navbar />} */}
            <div style={{ display: "flex" }}>

                <div style={{ flex: 1 }}>
                    <Routes>
                        <Route path="/" element={<HomePrelogin />} />
                        <Route
                            path="/login"
                            element={isLoggedIn ? <Navigate to="/chat" /> : <SignIn setIsLoggedIn={setIsLoggedIn} setUid={setUid} />}/>

                        <Route path="/chat" element={isLoggedIn ? <Chat uid={uid} /> : <Navigate to="/" />} />
                        <Route path="/profile" element={isLoggedIn ? <Profile setIsLoggedIn={setIsLoggedIn} uid={uid} /> : <Navigate to="/" />} />
                        <Route path="/home-loggedin" element={isLoggedIn ? <HomeLoggedIn /> : <Navigate to="/" />} />
                        <Route path="/quiz-generator" element={isLoggedIn ? <QuizGenerator uid={uid} /> : <Navigate to="/" />} />
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
