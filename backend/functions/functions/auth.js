const admin = require("firebase-admin");
const { doc, setDoc, serverTimestamp } = require("firebase/firestore");
const { db } = require("./firebase");

/**
 * Middleware สำหรับตรวจสอบ Firebase ID Token
 * @param {Request} req
 * @param {Response} res
 * @param {Function} next
 * @return {void}
 */
async function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({error: "Missing or invalid token"});
    }

    const idToken = authHeader.split("Bearer ")[1];

    // ตรวจสอบ token ผ่าน Firebase Admin SDK
    const decodedToken = await admin.auth().verifyIdToken(idToken);

    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
    };

    if (!decodedToken.email_verified) {
      return res.status(403).json({error: "Email not verified"});
    }

    next();
  } catch (error) {
    console.error("Error verifying ID token:", error);
    res.status(401).json({error: "Unauthorized"});
  }
}

// uid, name, email
/**
 * เพิ่ม user เข้า Firestore
 * @param {Request} req
 * @param {Response} res
 * @param {Function} next
 * @return {void}
 */
async function createUser(req, res, next) {
  try {
    // path: users/{uid}
    const userRef = doc(db, "users", req.body.uid);

    await setDoc(userRef, {
      name: req.body.name,
      email: req.body.email,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    console.log("✅ User created with ID:", uid);
    next();
  } catch (error) {
    res.status(400).json("❌ Error creating user:", error);
  }
}

module.exports = {authenticate, createUser};
