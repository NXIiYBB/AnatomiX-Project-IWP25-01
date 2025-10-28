import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./quiz.css";

export default function Result() {
  const location = useLocation();
  const navigate = useNavigate();

  // รับข้อมูลจาก navigate
  const { questions, answers, title } = location.state || {};
  if (!questions || !answers) {
    return <p>No result data found.</p>;
  }
  console.log("questions : ", questions)
  console.log("answers : ", answers)
  // คำนวณคะแนน

  const questionValues = Object.values(questions);
  const score = questionValues.reduce(
    (acc, q, index) => acc + (answers[index] === q.answer ? 1 : 0),
    0
  );

  return (
    <div className="quiz-container">
      <h1 className="quiz-title">Quiz Result: {title}</h1>
      <h2>🎯 You scored {score}/{questions.length}</h2>

      {questions.map((q, index) => {
        const userAns = answers[index];
        const isCorrect = userAns === q.answer;
        return (
          <div key={index} className={`quiz-question-card ${isCorrect ? 'correct' : 'wrong'}`}>
            <h3>{index+1}. {q.question}</h3>
            <p><b>Your answer</b>: {userAns || "No answer"} {isCorrect ? "✅" : "❌"}</p>
            {!isCorrect && <p><b>Correct answer</b>: {q.answer}</p>}
            <p><br></br><b>Explanation</b>: {q.explanation}</p>
          </div>
        );
      })}

      <button className="back-btn" onClick={() => navigate("/quiz-generator")}>
        Back to Quiz Generator
      </button>
    </div>
  );
}
