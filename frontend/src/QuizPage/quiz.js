import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./quiz.css";
import { auth } from "../firebase";

export default function Quiz() {
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search);
  const uid = auth.currentUser?.uid;

  const title = query.get("title") || "Quiz";
  const num = parseInt(query.get("num")) || 5;
  const level = query.get("level") || "Medium";

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [score, setScore] = useState(null);

  useEffect(() => {
    if (num && title && level) {
      // setLoading(true);
      const fetchQuestions = async () => {
        console.log(num, title, level)
        try {
          const response = await fetch(
            "http://127.0.0.1:5001/anatomix-c8c63/us-central1/api/quiz/create",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                uid,
                systems: title,       // เช่น ["ระบบประสาท", "ระบบไหลเวียนเลือด"]
                numQuestions: num,   // จำนวนคำถาม
                difficulty: level, // เช่น "easy", "medium", "hard"
              }),
            }
          );

          if (!response.ok) {
            throw new Error("Failed to fetch questions");
          }

          const data = await response.json();
          console.log(data);
          setQuestions(data.questions || []); // สมมติ API return { questions: [...] }
        } catch (error) {
          console.error("Error fetching questions:", error);
        } finally {
          setLoading(false); // ✅ โหลดเสร็จ
        }
      };

      fetchQuestions();
    }
  }, [num]);

  const handleAnswerChange = (id, opt) => {
    setAnswers((prev) => ({ ...prev, [id]: opt }));
  };

  const handleSubmit = () => {
    navigate("/quiz-result", { state: { questions, answers, title } });
  };

  const handleBack = () => {
    navigate("/quiz-generator");
  };

  if (loading) return <p className="loading-text">Loading questions...</p>;

  return (
    <div className="quiz-container">
      <h1 className="quiz-title">Quiz: {title}</h1>
      <p className="quiz-info">
        Difficulty: {level} | {num} Questions
      </p>

      {questions.map((q, index) => (
        <div key={index} className="quiz-question-card">
          <h3>{index+1}. {q.question}</h3>
          <div className="options-group">
            {q.choices.map((opt, i) => (
              <label key={i} className="option-label">
                <input
                  type="radio"
                  name={`q-${index}`}
                  value={opt}
                  checked={answers[index] === opt}
                  onChange={() => handleAnswerChange(index, opt)}
                  disabled={score !== null} // ← ปิดแก้ไขหลัง submit
                />
                {String.fromCharCode(65 + i)}. {opt}
              </label>
            ))}
          </div>
        </div>
      ))}

      <div className="button-group">
        <button className="submit-btn" onClick={handleSubmit}>
          Submit Quiz
        </button>
        <button className="back-btn" onClick={handleBack}>
          Back
        </button>
      </div>
    </div>
  );
}
