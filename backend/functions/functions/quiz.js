const { db } = require("./firebase");
const { GoogleGenAI } = require("@google/genai"); // หรือ GenAI instance ของคุณ
const ai = new GoogleGenAI({ apiKey: process.env.GENAI_API_KEY });
const { doc, collection, writeBatch, serverTimestamp, setDoc } = require("firebase/firestore");

// 1. createQuiz
/**
 * createQuiz
 * @param {Request} req
 * @param {Response} res
 * @return {void}
 */
async function createQuiz(req, res) {
    try {
    const { systems, numQuestions, difficulty } = req.body;

    // สร้าง prompt สำหรับ AI ให้ output เป็น Multiple Choice JSON
    // const prompt = `
    // You are an expert physiology teacher. 
    // Generate a quiz for high school / undergraduate students.
    // Systems: ${systems.join ? systems.join(", ") : systems}
    // Number of questions: ${numQuestions}
    // Difficulty: ${difficulty}

    // Each question must be multiple choice with 4 options (A-D).
    // Output as JSON array of objects in this format:
    // [
    // {
    //     "question": "...",
    //     "choices": ["choice1", "choice2", "choice3", "choice4"],
    //     "answer": "correct choice",
    //     "explanation": "short explanation"
    // }
    // ]
    // `;
    const prompt = `
    คุณเป็นครูผู้เชี่ยวชาญด้านสรีรวิทยา
    สร้างแบบทดสอบสำหรับนักเรียนมัธยมปลายหรือระดับปริญญาตรี
    ระบบร่างกาย: ${systems.join ? systems.join(", ") : systems}
    จำนวนคำถาม: ${numQuestions}
    ระดับความยาก: ${difficulty}

    แต่ละคำถามต้องเป็นแบบปรนัย มีตัวเลือก 4 ข้อ (A-D)
    ส่งออกผลลัพธ์เป็น JSON array ของ object ตามรูปแบบนี้เท่านั้น:
    [
    {
        "question": "คำถาม...",
        "choices": ["ตัวเลือก A", "ตัวเลือก B", "ตัวเลือก C", "ตัวเลือก D"],
        "answer": "ตัวเลือกที่ถูกต้อง",
        "explanation": "คำอธิบายสั้นๆ"
    }
    ]
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    let raw = response.text;

    // ลบ ```json หรือ ``` ออก
    raw = raw.replace(/```(json)?/g, "").trim();

    let questions;
    try {
        questions = JSON.parse(raw);
    } catch (err) {
        console.error("Failed to parse JSON from AI:", raw);
        throw err;
    }

    // สร้าง quizId (doc อัตโนมัติ)
    const quizRef = doc(collection(db, "quizzes"));

    await setDoc(quizRef, {
    systems,
    numQuestions,
    difficulty,
    createdAt: serverTimestamp(),
    });

    // เพิ่ม questions ลง subcollection
    const batch = writeBatch(db);
    questions.forEach((q, idx) => {
    const qRef = doc(collection(quizRef, "questions"), `q${idx + 1}`);
    batch.set(qRef, { ...q, userAnswer: null, score: null });
    });

    await batch.commit();

    // res.json({ quizId: quizRef.id, questions });
    res.json({ questions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}

// 2. addQuiz (update quiz answers, userScore etc.)
/**
 * addQuiz
 * @param {Request} req
 * @param {Response} res
 * @return {void}
 */
async function addQuizResult(req, res) {
  try {
    const { quizId, userId, answers } = req.body;

    const quizRef = db.collection("quizzes").doc(quizId);
    const questionsSnap = await quizRef.collection("questions").get();

    const batch = db.batch();
    let totalScore = 0;

    questionsSnap.forEach((docSnap, idx) => {
      const q = docSnap.data();
      const userAnswer = answers[idx];
      const score = userAnswer === q.answer ? 1 : 0;
      totalScore += score;

      batch.update(docSnap.ref, { userAnswer, score });
    });

    // อัปเดตคะแนนรวม
    batch.update(quizRef, { totalScore });
    await batch.commit();

    res.json({ message: "Quiz results saved", totalScore });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}

module.exports = {createQuiz, addQuizResult};