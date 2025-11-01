const { error } = require("firebase-functions/logger");
const { auth, db } = require("./firebase");
const { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification } = require("firebase/auth");
const { collection, setDoc, getDocs, doc, serverTimestamp } = require("firebase/firestore");

// email, password, username
/**
 * Sign up
 * @param {Request} req
 * @param {Response} res
 * @return {void}
 */
async function signUp(req, res) {
    const querySnapshot = await getDocs(collection(db, "users"));
    const usernameTaken = querySnapshot.docs.some(doc => doc.data().username === req.body.username);

    if (usernameTaken) {
        return res.status(400).json({ error: "Username already taken." });
    }

    try {
        // create account
        const userCredential = await createUserWithEmailAndPassword(auth, req.body.email, req.body.password);
        const user = userCredential.user;

        // ส่ง email verification
        await sendEmailVerification(user);

        // create collection db for new user
        try {
            // path: users/{uid}
            const userRef = doc(db, "users", user.uid);

            await setDoc(userRef, {
            username: req.body.username,
            email: req.body.email,
            });

            const conversationsRef = collection(userRef, "conversations");
            const conversationRef = doc(conversationsRef);
            
            await setDoc(conversationRef, {
                title: `Your First Step with AnatomiX`,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            });
        } catch (error) {
            res.status(400).json("❌ Error creating user:", error);
        }

        res.json(
            {message: "Registered! Please check your email to verify your account. (Check your spam folder too!)"}
        );

    } catch(error) {
        res.status(400).json({error: error.message})
    }
}


// email, password
/**
 * Log In
 * @param {Request} req
 * @param {Response} res
 * @param {Function} next
 * @return {void}
 */
async function logIn(req, res, next) {
    try {
      // info check
      const userCredential = await signInWithEmailAndPassword(auth, req.body.email, req.body.password);
      const user = userCredential.user;

      if (!user.emailVerified) {
        res.json({message: "Please verify your email before logging in. Check your inbox or spam folder."});
        return;
      }

      res.json({message: "Login successful!", uid: user.uid});
      next();
    } catch (error) {
      res.status(400).json({error: error});
    }
}

module.exports = {signUp, logIn};