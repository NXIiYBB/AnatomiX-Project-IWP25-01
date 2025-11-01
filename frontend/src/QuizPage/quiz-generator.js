import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./quiz-generator.css";
import Navbar from '../components/navbar';
import Loading from '../components/loading';

export default function QuizGenerator({uid}) {
  const [generated, setGenerated] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [created, setCreated] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    numQuestions: "",
    difficulty: "",
  });

  const topics = [
    "Cardiovascular System",
    "Respiratory System",
    "Digestive System",
    "Nervous System",
    "Musculoskeletal System",
    "Urinary System",
    "Endocrine System",
    "Random System",
    "All Systems"
];
  const numbers = [10, 20, 30];
  const difficulties = ["Easy", "Medium", "Hard"];
  
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { title, numQuestions, difficulty } = formData;

    if (!title || !numQuestions || !difficulty) {
      alert("⚠️ Please fill in all fields before generating your quiz.");
      return;
    }

    if (created) return;
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
            numQuestions: numQuestions,
            difficulty: difficulty,    // "easy", "medium", "hard"
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to fetch questions");

      const data = await response.json();
      console.log("Quiz created:", data);
      setCreated(true); // ✅ ป้องกันเรียกซ้ำ
      navigate("/quiz", { state: { title: title, quizId: data.quizId, questions: data.questions } });

    } catch (err) {
      console.error("Error creating quiz:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="quiz-generator-container">
      <Navbar />
      <h2>Generate Your Quiz</h2>
      <p>Customize your quiz to test your physiology knowledge.</p>

      <form onSubmit={handleSubmit}>
        {/* Quiz Title */}
        <div className="form-group">
          <label htmlFor="title">Quiz Title</label>
          <input
            list="topics-list"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Select or type a topic"
          />
          <datalist id="topics-list">
            {topics.map((topic, i) => (
              <option key={i} value={topic} />
            ))}
          </datalist>
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
