import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home-notlogin/Home";  
import AnatomixLanding from "./Homepage";
import QuizGen from "./Quiz/Quiz_gen";
import QuizPage from "./Quiz/QuizPage";

function App() {
  return (
   <Router>
      <Routes>
        <Route path="/" element={<Home />} />  

        <Route path="/home_loggedin" element={<AnatomixLanding/>}/>
        <Route path="/quiz-gen" element={<QuizGen />} />
        <Route path="/quiz-page" element={<QuizPage />} />
      </Routes>
    </Router>
  );
}

export default App;
