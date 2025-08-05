const { db } = require('../../firebase.js');

class SpotController {
    async shareSpot(req, res) {
        const { title, description, location, userId, species, technique } = req.body;
        try {
            const newSpot = {
                title,
                description,
                location,
                userId,
                species,
                technique,
                createdAt: new Date(),
                approved: false,
                ratings: [] // <-- Add this line
            };
            const spotRef = await db.collection('fishingSpots').add(newSpot);
            res.status(201).json({ id: spotRef.id, ...newSpot });
        } catch (error) {
            res.status(500).json({ error: 'Error creating fishing spot' });
        }
    }

    async getAllSpots(req, res) {
        try {
            const spotsSnapshot = await db.collection('fishingSpots').where('approved', '==', true).get();
            const spots = spotsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            res.status(200).json(spots);
        } catch (error) {
            res.status(500).json({ error: 'Error retrieving fishing spots' });
        }
    }

    async getSpotById(req, res) {
        const { id } = req.params;
        try {
            const doc = await db.collection('fishingSpots').doc(id).get();
            if (!doc.exists) {
                return res.status(404).json({ error: 'Spot not found' });
            }
            res.status(200).json({ id: doc.id, ...doc.data() });
        } catch (error) {
            res.status(500).json({ error: 'Error retrieving fishing spot' });
        }
    }

    async filterSpots(req, res) {
        const { species, technique } = req.query;
        try {
            let query = db.collection('fishingSpots').where('approved', '==', true);
            if (species) query = query.where('species', '==', species);
            if (technique) query = query.where('technique', '==', technique);
            const spotsSnapshot = await query.get();
            const spots = spotsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            res.status(200).json(spots);
        } catch (error) {
            res.status(500).json({ error: 'Error filtering fishing spots' });
        }
    }
}

module.exports = new SpotController();