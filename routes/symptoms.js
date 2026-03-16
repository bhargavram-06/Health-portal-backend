const express = require('express');
const router = express.Router();
const Symptom = require('../models/Symptom');

// GET all symptoms (for the dashboard list)
router.get('/', async (req, res) => {
    try {
        const symptoms = await Symptom.find();
        res.json(symptoms);
    } catch (err) {
        res.status(500).json({ msg: "Server Error" });
    }
});

// GET a specific symptom by name
router.get('/:name', async (req, res) => {
    try {
        const symptom = await Symptom.findOne({ name: req.params.name });
        if (!symptom) return res.status(404).json({ msg: "Symptom not found" });
        res.json(symptom);
    } catch (err) {
        res.status(500).json({ msg: "Server Error" });
    }
});

module.exports = router;