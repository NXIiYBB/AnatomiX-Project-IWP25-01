const { doc, collection, addDoc, serverTimestamp, setDoc, orderBy, getDocs, query } = require("firebase/firestore");
const { db } = require("./firebase");

// uid, conversationId, role, text
/**
 * เพิ่มข้อความใหม่เข้าไปใน conversation
 * @param {Request} req
 * @param {Response} res
 * @return {void}
 */
async function addMessage(req, res) {
  try {
    // path: users/{uid}/conversations/{conversationId}/messages
    const messagesRef = collection(
      db,
      "users",
      req.body.uid,
      "conversations",
      req.body.conversationId,
      "messages"
    );

    await addDoc(messagesRef, {
      role: req.body.role,
      text: req.body.text,
      createdAt: serverTimestamp(),
    });

    res.json({message: "Successful!"});
  } catch (error) {
    res.status(400).json({error: "❌ Error adding message: " + error});
  }
}

// uid, title
/**
 * เพิ่ม conversation ใหม่เข้าไปใน users
 * @param {Request} req
 * @param {Response} res
 * @return {void}
 */
async function createConversation(req, res) {
  try {
    const { uid, title } = req.body;

    if (!uid || !title) {
      return res.status(400).json({ error: "❌ uid and title are required" });
    }

    const conversationsRef = collection(db, "users", uid, "conversations");

    const docRef = await addDoc(conversationsRef, {
      title,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    res.json({
      conversationId: docRef.id,
      title,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      message: "✅ Conversation created successfully!",
    });
  } catch (error) {
    res.status(400).json({error: "❌ Error creating conversation:" + error});
  }
}

// uid, conversationId
/**
 * get Conversation History
 * @param {Request} req
 * @param {Response} res
 * @return {void}
 */
async function getConversationHistory(req, res) {
  try {const {uid, conversationId} = req.query;
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

  const messages = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json({ res: messages });
  // return snapshot.docs.map(doc => doc.data());
} catch (error) {
  res.status(400).json({error: "❌ Error get conversation history:" + error});
}
}

// uid
/**
 * get Conversation list
 * @param {Request} req
 * @param {Response} res
 * @return {void}
 */
async function getConversationList(req, res) {
  try {const {uid} = req.query;
  const messagesRef = collection(
    db,
    "users",
    uid,
    "conversations"
  );

  const q = query(messagesRef, orderBy("createdAt", "asc"));
  const snapshot = await getDocs(q);

  const conversations = snapshot.docs.map(doc => ({
    id: doc.id,    
    ...doc.data(), 
  }));

  res.json({ res: conversations });
} catch (error) {
  res.status(400).json({error: "❌ Error get conversation history:" + error.message});
}
}

module.exports = {addMessage, createConversation, getConversationHistory, getConversationList};