import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./quiz.css";
import { auth } from "../firebase";

export default function Quiz({uid}) {
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search);
  // const uid = auth.currentUser?.uid;

  const title = query.get("title") || undefined;
  const num = parseInt(query.get("num")) || undefined;
  const level = query.get("level") || undefined;

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState(null);
  const [quizId, setQuizId] = useState(null);

  useEffect(() => {
    if (location.state?.questions) {
      const q = location.state.questions;
      setQuestions(Array.isArray(q) ? q : Object.values(q));
    }

    if (location.state?.quizId) {
      setQuizId(location.state.quizId);
    }
  }, [location.state]);

  console.log("✅ questions:", questions);
  console.log("✅ quizId:", quizId);
  console.log("✅ title:", title);

  const [created, setCreated] = useState(false);
  // useEffect(() => {
  //   if (num && title && level && !created) {
  //     // setLoading(true);
  //     const fetchQuestions = async () => {
  //       console.log(num, title, level)
  //       try {
  //         const response = await fetch(
  //           "http://127.0.0.1:5001/anatomix-c8c63/us-central1/api/quiz/create",
  //           {
  //             method: "POST",
  //             headers: {
  //               "Content-Type": "application/json",
  //             },
  //             body: JSON.stringify({
  //               uid,
  //               systems: title,       // เช่น ["ระบบประสาท", "ระบบไหลเวียนเลือด"]
  //               numQuestions: num,   // จำนวนคำถาม
  //               difficulty: level, // เช่น "easy", "medium", "hard"
  //             }),
  //           }
  //         );

  //         if (!response.ok) {
  //           throw new Error("Failed to fetch questions");
  //         }

  //         const data = await response.json();
  //         console.log(data);
  //         setQuizId(data.quizId);
  //         setQuestions(data.questions || []); // สมมติ API return { questions: [...] }
  //         setCreated(true);
  //       } catch (error) {
  //         console.error("Error fetching questions:", error);
  //       } finally {
  //         setLoading(false); // ✅ โหลดเสร็จ
  //       }
  //     };

  //     fetchQuestions();
  //   }
  // }, [num, title, level, created]);

  const handleCreateQuiz = async () => {
    if (!num || !title || !level) return;
    if (created) return; // ป้องกันสร้างซ้ำ

    setLoading(true);
    try {
      const response = await fetch(
        "http://127.0.0.1:5001/anatomix-c8c63/us-central1/api/quiz/create",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            uid,
            systems: title,       // ["ระบบประสาท", ...]
            numQuestions: num,
            difficulty: level,    // "easy", "medium", "hard"
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to fetch questions");

      const data = await response.json();
      console.log("Quiz created:", data);

      setQuizId(data.quizId);
      setQuestions(data.questions || []);
      setCreated(true); // ✅ ป้องกันเรียกซ้ำ

      // ✅ ถ้าต้องการ เซฟ score/userAnswer ตอนนี้สามารถเรียกฟังก์ชัน saveScores(quizId, questions)
      // await saveScores(data.quizId, data.questions);
    } catch (err) {
      console.error("Error creating quiz:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (id, opt) => {
    setAnswers((prev) => ({ ...prev, [id]: opt }));
  };

  const handleSubmit = () => {
    navigate("/quiz-result", { state: { questions, answers, title, quizId } });
  };

  const handleBack = () => {
    navigate("/quiz-generator");
  };

  if (loading) return <p className="loading-text">Loading questions...</p>;

  return (
    <div>
    <button
        onClick={handleCreateQuiz}
        disabled={loading || created}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        {loading ? "Creating..." : created ? "Quiz Created" : "Create Quiz"}
      </button>

    {quizId && (<div className="quiz-container">
      <h1 className="quiz-title">Quiz: {title}</h1>
      <p className="quiz-info">
        Difficulty: {level} | {num} Questions
      </p>

      <button
        onClick={handleCreateQuiz}
        disabled={loading || created}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        {loading ? "Creating..." : created ? "Quiz Created" : "Create Quiz"}
      </button>

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
    </div>)}
    </div>
  );
}
