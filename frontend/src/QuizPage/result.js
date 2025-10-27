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

  // คำนวณคะแนน
  const score = questions.reduce(
    (acc, q) => acc + (answers[q.id] === q.correct ? 1 : 0),
    0
  );

  return (
    <div className="quiz-container">
      <h1 className="quiz-title">Quiz Result: {title}</h1>
      <h2>🎯 You scored {score}/{questions.length}</h2>

      {questions.map((q) => {
        const userAns = answers[q.id];
        const isCorrect = userAns === q.correct;
        return (
          <div key={q.id} className={`quiz-question-card ${isCorrect ? 'correct' : 'wrong'}`}>
            <h3>{q.id}. {q.question}</h3>
            <p>Your answer: {userAns || "No answer"} {isCorrect ? "✅" : "❌"}</p>
            {!isCorrect && <p>Correct answer: {q.correct}</p>}
          </div>
        );
      })}

      <button className="back-btn" onClick={() => navigate("/quiz-generator")}>
        Back to Quiz Generator
      </button>
    </div>
  );
}
