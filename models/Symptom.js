const mongoose = require('mongoose');

const SymptomSchema = new mongoose.Schema({
    name: { type: String, required: true },
    medicine: { type: String, required: true },
    dosage: { type: String },
    diet: { type: String },
    precaution: { type: String },
    bg: { type: String },
    color: { type: String },
    iconName: { type: String } // Matches the key in IconMap
});

module.exports = mongoose.model('Symptom', SymptomSchema);