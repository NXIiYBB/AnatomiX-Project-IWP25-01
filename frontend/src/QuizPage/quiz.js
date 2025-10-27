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
  const [score, setScore] = useState(null); // ← เก็บคะแนน

  // useEffect(() => {
  //   const mockData = {
  //     Genetic: [
  //       {
  //         id: 1,
  //         question: "What is the term for a gene that expresses its trait even when only one copy is present in a heterozygous state?",
  //         options: [
  //           "Independent gene",
  //           "Dominant gene",
  //           "Recessive gene",
  //           "Sex-linked gene",
  //         ],
  //         correct: "Dominant gene",
  //       },
  //       {
  //         id: 2,
  //         question: "What process copies genetic information from DNA to mRNA?",
  //         options: ["DNA replication", "Mutation", "Translation", "Transcription"],
  //         correct: "Transcription",
  //       },
  //     ],
  //     Digestive: [
  //       {
  //         id: 1,
  //         question: "Which organ is primarily responsible for nutrient absorption?",
  //         options: ["Stomach", "Small intestine", "Liver", "Large intestine"],
  //         correct: "Small intestine",
  //       },
  //       {
  //         id: 2,
  //         question: "What enzyme breaks down starch into sugars?",
  //         options: ["Amylase", "Lipase", "Pepsin", "Trypsin"],
  //         correct: "Amylase",
  //       },
  //     ],
  //   };

  //   setTimeout(() => {
  //     setQuestions(mockData[title] || []);
  //     setLoading(false);
  //   }, 500);
  // }, [title]);

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
  });

  const handleAnswerChange = (id, opt) => {
    setAnswers((prev) => ({ ...prev, [id]: opt }));
  };

  const handleSubmit = () => {
    let calculatedScore = 0;
    questions.forEach((q, index) => {
      if (answers[index] === q.answer) calculatedScore++;
    });
    setScore(calculatedScore); // ← แทน alert
  };

  const handleTryAgain = () => {
    setAnswers({});
    setScore(null);
  };

  const handleBack = () => {
    navigate("/quiz-generator");
  };

  if (loading) return <p className="loading-text">Loading questions...</p>;

  return (
    <div className="quiz-container">
      <h1 className="quiz-title">Quiz: {title}</h1>
      <p className="quiz-info">Difficulty: {level} | {num} Questions</p>

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

      {score === null ? (
        <button className="submit-btn" onClick={handleSubmit}>
          Submit Quiz
        </button>
      ) : (
        <div className="score-container">
          <h2>🎯 You scored {score}/{questions.length}</h2>
          <button className="try-btn" onClick={handleTryAgain}>
            Try Again
          </button>
          <button className="back-btn" onClick={handleBack}>
            Back to Quiz Generator
          </button>
        </div>
      )}
    </div>
  );
}
