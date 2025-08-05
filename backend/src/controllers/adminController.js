const { db } = require('../../firebase.js');

exports.approveSpot = async (req, res) => {
    const { id } = req.params;
    try {
        await db.collection('fishingSpots').doc(id).update({ approved: true });
        res.status(200).json({ message: 'Fishing spot approved successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Error approving spot.' });
    }
};

exports.rejectSpot = async (req, res) => {
    const { id } = req.params;
    try {
        await db.collection('fishingSpots').doc(id).delete();
        res.status(200).json({ message: 'Fishing spot rejected successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Error rejecting spot.' });
    }
};

exports.getPendingSpots = async (req, res) => {
    const snapshot = await db.collection('fishingSpots').where('approved', '==', false).get();
    const spots = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json({ spots });
};