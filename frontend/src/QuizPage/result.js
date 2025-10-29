import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./quiz.css";

export default function Result({uid}) {
  const location = useLocation();
  const navigate = useNavigate();

  // รับข้อมูลจาก navigate
  const { questions, answers, title, quizId } = location.state || {};

  const [hasSubmitted, setHasSubmitted] = useState(false); // กันส่งซ้ำ

  useEffect(() => {
    // ✅ เรียกใช้ useEffect ทุกครั้ง แต่เช็คเงื่อนไขภายใน
    if (!answers || !quizId || hasSubmitted) return;

    const fetchAddScores = async () => {
      try {
        const response = await fetch(
          "http://127.0.0.1:5001/anatomix-c8c63/us-central1/api/quiz/result",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ quizId, uid, answers }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to add score");
        }

        const data = await response.json();
        console.log("✅ Score added:", data);
        setHasSubmitted(true); // กันไม่ให้ส่งซ้ำ
      } catch (error) {
        console.error("❌ Error fetching add score:", error);
      }
    };

    fetchAddScores();
  }, [answers, quizId, uid, hasSubmitted]);
  
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
