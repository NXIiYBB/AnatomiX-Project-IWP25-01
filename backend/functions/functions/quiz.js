const { db } = require("./firebase");
const { GoogleGenAI } = require("@google/genai"); // หรือ GenAI instance ของคุณ
const ai = new GoogleGenAI({ apiKey: process.env.GENAI_API_KEY });
const { doc, collection, writeBatch, serverTimestamp, setDoc, getDocs } = require("firebase/firestore");

// 1. createQuiz
/**
 * createQuiz
 * @param {Request} req
 * @param {Response} res
 * @return {void}
 */
async function createQuiz(req, res) {
    try {
    const { uid, systems, numQuestions, difficulty } = req.body;

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
    You are an expert physiology teacher.
    Create a multiple-choice quiz for high school or undergraduate students.
    **Do not** include any introductory text, summary, or explanation before or after the JSON array.
    Body system(s): ${systems.join ? systems.join(", ") : systems}
    Number of questions: ${numQuestions}
    Difficulty level: ${difficulty}

    Each question must be multiple-choice with 4 options.
    Output the result as a JSON array of objects in this exact format:
    [
    {
        "question": "Question text...",
        "choices": ["Option A", "Option B", "Option C", "Option D"],
        "answer": "Correct option",
        "explanation": "Short explanation"
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

    const userDocRef = doc(db, "users", uid);
    // สร้าง quizId (doc อัตโนมัติ)
    const quizRef = doc(collection(userDocRef, "quizzes"));

    await setDoc(quizRef, {
    systems,
    numQuestions,
    difficulty,
    createdAt: serverTimestamp(),
    });

    // เพิ่ม questions ลง subcollection
    const batch = writeBatch(db);
    questions.forEach((q, idx) => {
    const qRef = doc(collection(quizRef, "questions"), `q${String(idx + 1).padStart(2, "0")}`);
    batch.set(qRef, { ...q, userAnswer: null, score: null });
    });

    await batch.commit();

    // res.json({ quizId: quizRef.id, questions });
    res.json({ questions, quizId: quizRef.id });
  } catch (error) {
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
    const { quizId, uid, answers } = req.body;

    // ✅ สร้าง reference
    const userDocRef = doc(db, "users", uid);
    const quizRef = doc(userDocRef, "quizzes", quizId);
    const questionsColRef = collection(quizRef, "questions");

    // ✅ ดึงข้อมูล questions
    const questionsSnap = await getDocs(questionsColRef);

    // ✅ เริ่ม batch
    const batch = writeBatch(db);
    let totalScore = 0;

    questionsSnap.docs.forEach((docSnap, idx) => {
      const q = docSnap.data();
      const userAnswer = answers[idx];
      const score = userAnswer === q.answer ? 1 : 0;
      totalScore += score;

      batch.update(docSnap.ref, { userAnswer, score });
    });

    // ✅ อัปเดตคะแนนรวมใน quiz document
    batch.update(quizRef, { totalScore });

    // ✅ commit การเขียนทั้งหมด
    await batch.commit();

    res.json({ message: "Quiz results saved", totalScore });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// 3. createQuizFromConversation
/**
 * createQuizFromConversation
 * @param {Request} req
 * @param {Response} res
 * @return {void}
 */
async function createQuizFromConversation(req, res) {
  try {
    const { uid, conversationId, title, content } = req.body;

    if (!uid || !content) {
      return res.status(400).json({ error: "Missing uid or content" });
    }

    // 🔹 เรียก model สร้างคำถามจากเนื้อหา (สมมุติใช้ GPT)
    const prompt = `
    You are an expert physiology teacher.
    Create a quiz for high school or undergraduate students.
    Generate 10 multiple-choice questions based on the content below.
    Each question must have 4 answer choices.
    Output the result as a JSON array of objects in this exact format:
    [
    {
        "question": "Question text...",
        "choices": ["Option A", "Option B", "Option C", "Option D"],
        "answer": "Correct option",
        "explanation": "Short explanation"
    }
    ]
    Content:
    ${content}
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

    const userDocRef = doc(db, "users", uid);
    // สร้าง quizId (doc อัตโนมัติ)
    const quizRef = doc(collection(userDocRef, "quizzes"));

    await setDoc(quizRef, {
    systems: title,
    numQuestions: 10,
    difficulty: "-",
    createdAt: serverTimestamp(),
    sourceConversation: conversationId || null,
    });

    // เพิ่ม questions ลง subcollection
    const batch = writeBatch(db);
    questions.forEach((q, idx) => {
    const qRef = doc(collection(quizRef, "questions"), `q${String(idx + 1).padStart(2, "0")}`);
    batch.set(qRef, { ...q, userAnswer: null, score: null });
    });

    await batch.commit();

    // res.json({ quizId: quizRef.id, questions });
    res.json({ questions, quizId: quizRef.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {createQuiz, addQuizResult, createQuizFromConversation};