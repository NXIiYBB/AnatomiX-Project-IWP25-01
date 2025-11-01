import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./quiz.css";
import { auth } from "../firebase";

export default function Quiz({uid}) {
  const location = useLocation();
  const navigate = useNavigate();
  // const uid = auth.currentUser?.uid;

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState(null);
  const [quizId, setQuizId] = useState(null);
  const [title, setTitle] = useState(null);

  useEffect(() => {
    const state = location.state || {};
  
    setQuestions(Array.isArray(state.questions) ? state.questions : Object.values(state.questions || {}));
    setQuizId(state.quizId || null);
    setTitle(state.title || null);
  }, [location.state]);

  console.log("✅ questions:", questions);
  console.log("✅ quizId:", quizId);
  console.log("✅ title:", title);

  const handleAnswerChange = (id, opt) => {
    setAnswers((prev) => ({ ...prev, [id]: opt }));
  };

  const handleSubmit = () => {
    navigate("/quiz-result", { state: { questions, answers, title, quizId } });
  };

  const handleBack = () => {
    navigate("/quiz-generator");
  };

  return (
    <div>

    {quizId && (<div className="quiz-container">
      <h1 className="quiz-title">Quiz: {title}</h1>
      <p className="quiz-info">
        {questions.length} Questions
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
                {opt}
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
    </div>)}
    </div>
  );
}
