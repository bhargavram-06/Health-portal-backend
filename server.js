const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

// --- 1. ENHANCED CORS ---
// origin: "*" is fine for now, but adding allowedHeaders ensures JWT works 100%
app.use(cors({
    origin: "*", 
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

// --- 2. CONNECT ROUTES ---
app.use('/api/auth', require('./routes/auth'));
app.use('/api/symptoms', require('./routes/symptoms'));

// --- 3. DATABASE CONNECTION ---
const MONGO_URI = process.env.MONGO_URI;

// Added some standard options to keep the connection stable on Render
mongoose.connect(MONGO_URI)
    .then(() => console.log("✅ MongoDB Connected Successfully"))
    .catch((err) => console.log("❌ MongoDB Connection Error:", err));

app.get('/', (req, res) => {
    res.send("Symptom Analyzer API is running smoothly on Render! 🚀");
});

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});