import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./quiz-generator.css";
import Navbar from '../components/navbar';

export default function QuizGenerator() {
  const [generated, setGenerated] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    numQuestions: "",
    difficulty: "",
  });

  const topics = [
    "ระบบไหลเวียนเลือด",
    "ระบบทางเดินหายใจ",
    "ระบบย่อยอาหาร",
    "ระบบประสาท",
    "ระบบกล้ามเนื้อและโครงร่าง",
    "ระบบขับถ่าย/ปัสสาวะ",
    "ระบบต่อมไร้ท่อ",
    "สุ่ม 1 ระบบ",
    "รวมทุกระบบในร่างกาย"
  ];
  const numbers = [10, 20, 30];
  const difficulties = ["Easy", "Medium", "Hard"];
  
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

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
      <Navbar />
      <h2>Generate Your Quiz</h2>
      <p>Customize your quiz to test your physiology knowledge.</p>

      <form onSubmit={handleSubmit}>
        {/* Quiz Title */}
        <div className="form-group">
          <label htmlFor="title">Quiz Title</label>
          <select id="title" name="title" value={formData.title} onChange={handleChange}>
            <option value="">Select</option>
            {topics.map((topic, i) => <option key={i} value={topic}>{topic}</option>)}
          </select>
        </div>

        {/* Number of Questions */}
        <div className="form-group">
          <label htmlFor="numQuestions">Number of Questions</label>
          <select id="numQuestions" name="numQuestions" value={formData.numQuestions} onChange={handleChange}>
            <option value="">Select</option>
            {numbers.map((num, i) => <option key={i} value={num}>{num}</option>)}
          </select>
        </div>

        {/* Difficulty */}
        <div className="form-group">
          <label htmlFor="difficulty">Difficulty Level</label>
          <select id="difficulty" name="difficulty" value={formData.difficulty} onChange={handleChange}>
            <option value="">Select</option>
            {difficulties.map((lvl, i) => <option key={i} value={lvl}>{lvl}</option>)}
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
