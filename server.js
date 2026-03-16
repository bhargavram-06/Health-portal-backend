const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// --- 1. DYNAMIC PORT CONFIG ---
// Render automatically assigns a port. This line ensures the app uses it.
const PORT = process.env.PORT || 5000;

// --- 2. UPDATED CORS MIDDLEWARE ---
// Replace the Netlify URL with your actual Netlify link once you deploy the frontend.
app.use(cors({
    origin: [
        "http://localhost:5173", // Local development (Vite default)
        "https://your-project-name.netlify.app" // YOUR FUTURE NETLIFY URL
    ],
    credentials: true
}));

app.use(express.json());

// --- 3. CONNECT ROUTES ---
app.use('/api/auth', require('./routes/auth'));
app.use('/api/symptoms', require('./routes/symptoms'));

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
    .then(() => console.log("✅ MongoDB Connected Successfully"))
    .catch((err) => console.log("❌ MongoDB Connection Error:", err));

app.get('/', (req, res) => {
    res.send("Symptom Analyzer API is running smoothly on Render! 🚀");
});

// Start Server
app.listen(PORT, () => {
    // Note: On Render, the log will show the assigned port (e.g., 10000)
    console.log(`🚀 Server is running on port ${PORT}`);
});