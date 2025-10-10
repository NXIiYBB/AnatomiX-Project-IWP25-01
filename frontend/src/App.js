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
        <Route path="/home_loggedin" element={<HomeLoggedIn />} />
        <Route path="/quiz-gen" element={<QuizGenerator />} />
        <Route path="/quiz-page" element={<Quiz />} />
      </Routes>
    </Router>
  );
}

export default App;
