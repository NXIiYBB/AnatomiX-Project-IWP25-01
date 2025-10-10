import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./quiz-generator.css";

export default function QuizGenerator() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    numQuestions: "",
    difficulty: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { title, numQuestions, difficulty } = formData;

    if (!title || !numQuestions || !difficulty) {
      alert("⚠️ Please fill in all fields before generating your quiz.");
      return;
    }

    // ✅ ส่งค่าที่เลือกไปหน้า /quiz พร้อม query params
    navigate(`/quiz?title=${encodeURIComponent(title)}&num=${numQuestions}&level=${difficulty}`);
  };

  return (
    <div className="quiz-generator-container">
      <h2>Generate Your Quiz</h2>
      <p>Customize your quiz to test your physiology knowledge.</p>

      <form onSubmit={handleSubmit}>
        {/* Quiz Title */}
        <div className="form-group">
          <label htmlFor="title">Quiz Title</label>
          <select id="title" name="title" value={formData.title} onChange={handleChange}>
            <option value="">Select</option>
            <option value="Cellular biology">Cellular biology</option>
            <option value="Nervous system">Nervous system</option>
            <option value="Renal">Renal</option>
            <option value="Genetic">Genetic</option>
            <option value="Digestive">Digestive</option>
            <option value="Endocrine">Endocrine</option>
            <option value="Respiratory">Respiratory</option>
            <option value="Cardiovascular">Cardiovascular</option>
            <option value="Musculoskeletal">Musculoskeletal</option>
            <option value="Immune system">Immune system</option>
            <option value="Reproductive">Reproductive</option>
          </select>
        </div>

        {/* Number of Questions */}
        <div className="form-group">
          <label htmlFor="numQuestions">Number of Questions</label>
          <select id="numQuestions" name="numQuestions" value={formData.numQuestions} onChange={handleChange}>
            <option value="">Select</option>
            <option value="10">10</option>
            <option value="15">15</option>
            <option value="20">20</option>
          </select>
        </div>

        {/* Difficulty */}
        <div className="form-group">
          <label htmlFor="difficulty">Difficulty Level</label>
          <select id="difficulty" name="difficulty" value={formData.difficulty} onChange={handleChange}>
            <option value="">Select</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>

        {/* Buttons */}
        <div className="button-group">
          <button type="submit" id="generate-btn">Generate Quiz</button>
        </div>
      </form>
    </div>
  );
}
