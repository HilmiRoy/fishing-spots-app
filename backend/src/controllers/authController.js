const admin = require('firebase-admin');
const { db } = require('../../firebase.js');

class AuthController {
    async signup(req, res) {
        const { email, password } = req.body;
        try {
            const userRecord = await admin.auth().createUser({
                email,
                password,
            });
            // Add user to Firestore users collection
            await db.collection('users').doc(userRecord.uid).set({
                email: userRecord.email,
                role: "user",
                createdAt: new Date()
            });
            res.status(201).json({ message: 'User created successfully', uid: userRecord.uid });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async login(req, res) {
        const { email } = req.body;
        try {
            const userRecord = await admin.auth().getUserByEmail(email);
            // Password verification should be handled on the frontend with Firebase Auth
            res.status(200).json({ message: 'Login successful', uid: userRecord.uid });
        } catch (error) {
            res.status(401).json({ error: 'Invalid credentials' });
        }
    }
}

module.exports = new AuthController();