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
  const [loading, setLoading] = useState(false);

  // useEffect(() => {
  //   if (form?.number) {
  //     const dummy = Array.from({ length: form.number }, (_, i) => ({
  //       id: i + 1,
  //       question: `Question ${i + 1} about ${form.topic}?`,
  //       options: ["Option A", "Option B", "Option C", "Option D"],
  //       correct: "Option A",
  //     }));
  //     setQuestions(dummy);
  //   }
  // }, [form]);
  useEffect(() => {
    console.log(form)
    if (form?.number && form?.topic && form?.difficulty) {
      setLoading(true);
      const fetchQuestions = async () => {
        console.log(form.number,form.topic, form.difficulty)
        try {
          const response = await fetch(
            "http://127.0.0.1:5001/anatomix-c8c63/us-central1/api/quiz/create",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                systems: form.topic,       // เช่น ["ระบบประสาท", "ระบบไหลเวียนเลือด"]
                numQuestions: form.number,   // จำนวนคำถาม
                difficulty: form.difficulty, // เช่น "easy", "medium", "hard"
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
  }, [form]);

  const handleSelect = (qid, opt) => setAnswers({ ...answers, [qid]: opt });

  const handleSubmit = () => {
    let sc = 0;

    questions.forEach((q, index) => {
      if (answers[index] === q.answer) {
        sc++;
      }
    });

    setScore(sc);
    setSubmitted(true);
  };

  if (!form) return <div className="quiz-wrapper"><h2>No quiz generated yet.</h2></div>;

  if (loading)
    return (
      <div className="quiz-wrapper">
        <div className="loading-spinner"></div>
        <p>กำลังสร้างแบบทดสอบ โปรดรอสักครู่...</p>
      </div>
    );
  return (
    <div className="quiz-wrapper">
      <h1 className="quiz-header">{form.topic} Quiz ({form.difficulty})</h1>

      {!submitted ? (
        <>
          {questions.map((q, index) => (
            <div key={index} className="quiz-question">
              <p className="question-text">{index + 1}. {q.question}</p>
              <div className="options">
                {q.choices.map((opt, i) => (
                  <label key={i} className="option-label">
                    <input
                      type="radio"
                      name={`q-${index}`}
                      value={opt}
                      checked={answers[index] === opt}
                      onChange={() => handleSelect(index, opt)}
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
        <p className="score-percent">
          {Math.round((score / form.number) * 100)}%
        </p>

        {/* แสดงคำอธิบายแต่ละข้อ */}
        <div className="quiz-review">
          <h3>Review Answers</h3>
          {questions.map((q, index) => (
            <div key={index} className="review-item">
              <p><strong>ข้อ {index + 1}:</strong> {q.question}</p>
              <p>✅ <strong>คำตอบที่ถูกต้อง:</strong> {q.answer}</p>
              <p>📝 <strong>คำตอบของคุณ:</strong> {answers[index] || "—"}</p>
              {q.explanation && (
                <p className="explanation">
                  💡 <strong>คำอธิบาย:</strong> {q.explanation}
                </p>
              )}
              <hr />
            </div>
          ))}
        </div>

        <button className="btn clear" onClick={() => navigate("/quiz-gen")}>
          Back to Generator
        </button>
      </div>

      )}
    </div>
  );
}
