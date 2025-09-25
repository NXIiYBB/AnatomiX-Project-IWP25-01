const functions = require("firebase-functions");
const cors = require("cors");
const express = require("express");
const admin = require("firebase-admin");
const {authenticate} = require("./functions/auth");
const {signUp, logIn} = require("./functions/test");
const {createQuiz, addQuizResult} = require("./functions/quiz");
const {createConversation, addMessage, getConversationHistory, getConversationList} = require("./functions/addMessage");
const { GoogleGenAI } = require("@google/genai");
const fs = require("fs");
const path = require("path");
const { db } = require("./functions/firebase");
const { doc, collection, addDoc, serverTimestamp, orderBy, getDocs, query } = require("firebase/firestore");

const ai = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY,})

const app = express();
app.use(cors({origin: true }));
app.use(express.json());

admin.initializeApp();

app.get("/profile", authenticate, (req, res) => {
  res.json({
    message: "ข้อมูลนี้เฉพาะผู้ใช้ที่ล็อกอิน",
    uid: req.user.uid,
    email: req.user.email,
  });
});

app.post("/signUp", signUp, (req, res) => {});
app.post("/logIn", logIn, (req, res) => {});
app.post("/chat/newConversation", createConversation, (req, res) => {});
app.get("/chat/addMessage", addMessage, (req, res) => {});
app.get("/chat/history", getConversationHistory, (req, res) => {});
app.get("/chat/historyList", getConversationList, (req, res) => {});
app.post("/quiz/create", createQuiz, (req, res) => {});

const systemPrompt = fs.readFileSync(
  path.join(__dirname, "system_prompt.txt"),
  "utf-8"
); 


// uid, conversationId, text
/**
 * Chat
 * @param {Request} req
 * @param {Response} res
 * @return {void}
 */
app.post("/chat", async (req, res) => {
  try {
    const { uid, conversationId, text } = req.body;

    // ดึงข้อมูลแชทเดิม
    const messagesRef = collection(
      db,
      "users",
      uid,
      "conversations",
      conversationId,
      "messages"
    );

    const q = query(messagesRef, orderBy("createdAt", "asc"));
    const snapshot = await getDocs(q);

    // ข้อมูลแชทเดิมจาก Firestore
    const history = snapshot.docs
      .map(doc => doc.data())
      .filter(msg => msg.text)
      .map(msg => ({
        role: msg.role,
        parts: [{ type: "text", text: msg.text }]
      }));

    const contents = [
      {
        role: "model",
        parts: [{ type: "text", text: systemPrompt }]
      },
      ...history,
      {
        role: "user",
        parts: [{ type: "text", text: text }]
      }
    ];

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: contents,
    });

    // บันทึก user message
    await addDoc(messagesRef, {
      role: "user",
      text,
      createdAt: serverTimestamp(),
    });

    // บันทึก model reply
    await addDoc(messagesRef, {
      role: "model",
      text: response.text,
      createdAt: serverTimestamp(),
    });
    
    res.json({ "response": {text: response.text, role: "model"}})
  } catch (error) {
    console.error("Chat error:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

exports.api = functions.https.onRequest(app);

