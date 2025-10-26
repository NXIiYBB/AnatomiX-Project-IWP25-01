import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePrelogin from "./Home/home-prelogin";
import HomeLoggedIn from "./Home/home-loggedin";
import QuizGenerator from "./QuizPage/quiz-generator";
import Quiz from "./QuizPage/quiz";

function App() {
  return (
   <Router>
      <Routes>
        <Route path="/" element={<HomePrelogin />} />
        <Route path="/home-loggedin" element={<HomeLoggedIn />} />
        <Route path="/quiz-generator" element={<QuizGenerator />} />
        <Route path="/quiz" element={<Quiz />} />
      </Routes>
    </Router>
  );
}

export default App;
