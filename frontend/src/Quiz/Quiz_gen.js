import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Quiz_gen.css";

export default function QuizGen() {
  const [form, setForm] = useState({
    topic: "",
    number: "",
    difficulty: "",
  });
  const [generated, setGenerated] = useState(false);
  const navigate = useNavigate();

  const topics = [
    "Cellular biology","Nervous system","Renal","Genetic","Digestive",
    "Endocrine","Respiratory","Cardiovascular","Musculoskeletal",
    "Immune system","Reproductive",
  ];
  const numbers = [10, 20, 30];
  const difficulties = ["Easy", "Medium", "Hard"];

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleClear = () => { setForm({ topic: "", number: "", difficulty: "" }); setGenerated(false); }

  const handleGenerate = () => {
    if (!form.topic || !form.number || !form.difficulty) {
      alert("⚠️ Please select all fields before generating a quiz!");
      return;
    }
    setGenerated(true);
  };

  const handleStartQuiz = () => navigate("/quiz-page", { state: { form } });

  return (
    <div className="quiz-container">
      <div className="quiz-card">
        {!generated ? (
          <>
            <h1 className="quiz-title">Quiz Generator</h1>

            <div className="form-group">
              <label>Quiz Topic</label>
              <select name="topic" value={form.topic} onChange={handleChange}>
                <option value="">Select Topic</option>
                {topics.map((topic, i) => <option key={i} value={topic}>{topic}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label>Number of Questions</label>
              <select name="number" value={form.number} onChange={handleChange}>
                <option value="">Select Number</option>
                {numbers.map((num, i) => <option key={i} value={num}>{num}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label>Difficulty Level</label>
              <select name="difficulty" value={form.difficulty} onChange={handleChange}>
                <option value="">Select Difficulty</option>
                {difficulties.map((lvl, i) => <option key={i} value={lvl}>{lvl}</option>)}
              </select>
            </div>

            <div className="button-group">
              <button onClick={handleClear} className="btn clear">Clear Form</button>
              <button onClick={handleGenerate} className="btn generate">Generate Quiz</button>
            </div>
          </>
        ) : (
          <>
            <h1 className="quiz-title">Quiz Ready!</h1>
            <div className="quiz-summary">
              <p><strong>Topic:</strong> {form.topic}</p>
              <p><strong>Number of Questions:</strong> {form.number}</p>
              <p><strong>Difficulty:</strong> {form.difficulty}</p>
            </div>

            <div className="button-group">
              <button onClick={handleClear} className="btn clear">Back</button>
              <button onClick={handleStartQuiz} className="btn generate">Start Quiz</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
