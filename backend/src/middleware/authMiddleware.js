const admin = require('firebase-admin');
const { db } = require('../../firebase.js');

module.exports = {
  authenticateUser: async (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) {
      return res.status(401).json({ message: 'No token provided, authorization denied.' });
    }
    try {
      const decodedToken = await admin.auth().verifyIdToken(token.replace('Bearer ', ''));
      // Fetch user role from Firestore
      const userDoc = await db.collection('users').doc(decodedToken.uid).get();
      req.user = { ...decodedToken, role: userDoc.exists ? userDoc.data().role : 'user' };
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Invalid token.' });
    }
  },

  authorizeAdmin: (req, res, next) => {
    const user = req.user;
    if (user && user.role === 'admin') {
      return next();
    }
    return res.status(403).json({ message: 'Access denied, admin only.' });
  }
};