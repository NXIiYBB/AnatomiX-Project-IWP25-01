import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./quiz.css";

export default function Quiz() {
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search);

  const title = query.get("title") || "Quiz";
  const num = parseInt(query.get("num")) || 5;
  const level = query.get("level") || "Medium";

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const mockData = {
      Genetic: [
        {
          id: 1,
          question:
            "What is the term for a gene that expresses its trait even when only one copy is present in a heterozygous state?",
          options: [
            "Independent gene",
            "Dominant gene",
            "Recessive gene",
            "Sex-linked gene",
          ],
          correct: "Dominant gene",
        },
        {
          id: 2,
          question: "What process copies genetic information from DNA to mRNA?",
          options: ["DNA replication", "Mutation", "Translation", "Transcription"],
          correct: "Transcription",
        },
      ],
      Digestive: [
        {
          id: 1,
          question: "Which organ is primarily responsible for nutrient absorption?",
          options: ["Stomach", "Small intestine", "Liver", "Large intestine"],
          correct: "Small intestine",
        },
        {
          id: 2,
          question: "What enzyme breaks down starch into sugars?",
          options: ["Amylase", "Lipase", "Pepsin", "Trypsin"],
          correct: "Amylase",
        },
      ],
    };

    setTimeout(() => {
      setQuestions(mockData[title] || []);
      setLoading(false);
    }, 500);
  }, [title]);

  const handleAnswerChange = (id, opt) => {
    setAnswers((prev) => ({ ...prev, [id]: opt }));
  };

  const handleSubmit = () => {
    // ส่งไปหน้า Result พร้อมข้อมูล questions + answers
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

      {questions.slice(0, num).map((q) => (
        <div key={q.id} className="quiz-question-card">
          <h3>
            {q.id}. {q.question}
          </h3>
          <div className="options-group">
            {q.options.map((opt, i) => (
              <label key={i} className="option-label">
                <input
                  type="radio"
                  name={`q-${q.id}`}
                  value={opt}
                  checked={answers[q.id] === opt}
                  onChange={() => handleAnswerChange(q.id, opt)}
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
