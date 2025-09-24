import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./Quiz_page.css";
import { useNavigate } from "react-router-dom";

export default function QuizPage() {
  const location = useLocation();
  const { form } = location.state || {};
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (form?.number) {
      const dummy = Array.from({ length: form.number }, (_, i) => ({
        id: i + 1,
        question: `Question ${i + 1} about ${form.topic}?`,
        options: ["Option A", "Option B", "Option C", "Option D"],
        correct: "Option A",
      }));
      setQuestions(dummy);
    }
  }, [form]);

  const handleSelect = (qid, opt) => setAnswers({ ...answers, [qid]: opt });

  const handleSubmit = () => {
    let sc = 0;
    questions.forEach(q => { if (answers[q.id] === q.correct) sc++; });
    setScore(sc);
    setSubmitted(true);
  };

  if (!form) return <div className="quiz-wrapper"><h2>No quiz generated yet.</h2></div>;

  return (
    <div className="quiz-wrapper">
      <h1 className="quiz-header">{form.topic} Quiz ({form.difficulty})</h1>

      {!submitted ? (
        <>
          {questions.map(q => (
            <div key={q.id} className="quiz-question">
              <p className="question-text">{q.id}. {q.question}</p>
              <div className="options">
                {q.options.map((opt, i) => (
                  <label key={i} className="option-label">
                    <input
                      type="radio"
                      name={`q-${q.id}`}
                      value={opt}
                      checked={answers[q.id] === opt}
                      onChange={() => handleSelect(q.id, opt)}
                    />
                    {opt}
                  </label>
                ))}
              </div>
            </div>
          ))}
          <button className="btn submit" onClick={handleSubmit}>Submit Quiz</button>
        </>
      ) : (
        <div className="quiz-result">
          <h2>Your Score</h2>
          <p>{score} / {form.number} correct</p>
          <p className="score-percent">{Math.round((score / form.number) * 100)}%</p>
           <button className="btn clear"onClick={() => navigate("/quiz-gen")}>Back to Generator</button>
        </div>
      )}
    </div>
  );
}
