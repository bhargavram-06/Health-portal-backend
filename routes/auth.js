const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const nodemailer = require('nodemailer');
const User = require('../models/User');

// --- 1. STABLE NODEMAILER CONFIG FOR RENDER ---
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // Must be false for 587
    pool: true,
    auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS  
    },
    tls: {
        // This prevents the "Connection Timeout" by allowing the 
        // handshake even on restricted cloud networks
        rejectUnauthorized: false,
        minVersion: "TLSv1.2"
    }
});

// Startup check - Check your Render logs for this!
transporter.verify((error, success) => {
    if (error) {
        console.log("❌ NODEMAILER CONFIG ERROR:", error.message);
    } else {
        console.log("✅ NODEMAILER IS READY TO SEND OTP");
    }
});

// --- 2. REGISTRATION ---
router.post('/register', async (req, res) => {
    const { fullName, email, password, age, bloodGroup, height, weight } = req.body;
    try {
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ msg: "User already exists" });

        user = new User({ fullName, email, password, age, bloodGroup, height, weight });
        
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        await user.save();

        const payload = { user: { id: user.id, fullName: user.fullName, email: user.email } };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' }, (err, token) => {
            if (err) throw err;
            res.json({ token, msg: "Registration Successful" });
        });
    } catch (err) {
        console.error("Register Error:", err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
});

// --- 3. LOGIN ---
router.post('/login', async (req, res) => {
    const { email, password, captchaToken } = req.body;
    try {
        const secretKey = process.env.RECAPTCHA_SECRET_KEY;
        const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${captchaToken}`;
        const response = await axios.post(verifyUrl);

        if (!response.data.success) {
            return res.status(400).json({ msg: "reCAPTCHA verification failed" });
        }

        let user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: "Invalid Credentials" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: "Invalid Credentials" });

        const payload = { user: { id: user.id, fullName: user.fullName, email: user.email } };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' }, (err, token) => {
            if (err) throw err;
            res.json({ token });
        });
    } catch (err) {
        res.status(500).json({ msg: 'Server Error' });
    }
});

// --- 4. FORGOT PASSWORD (TIMEOUT & SMTP FIX) ---
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ msg: "User not found" });

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.resetPasswordOTP = otp;
        user.resetPasswordExpires = Date.now() + 600000; // 10 mins
        await user.save();

        const mailOptions = {
            from: `"Vital Portal Support" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Password Reset OTP',
            html: `
                <div style="font-family: sans-serif; text-align: center; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                    <h2 style="color: #00c853;">Security OTP</h2>
                    <p>Enter this code to reset your password:</p>
                    <div style="font-size: 32px; font-weight: bold; background: #f4f4f4; padding: 15px; display: inline-block; letter-spacing: 5px;">${otp}</div>
                    <p style="color: #888; font-size: 12px; margin-top: 10px;">This code expires in 10 minutes.</p>
                </div>`
        };

        // Use a clean Promise-based sendMail
        await transporter.sendMail(mailOptions);
        console.log("✅ OTP SENT SUCCESSFULLY to:", email);
        res.json({ msg: "OTP sent to your email" });

    } catch (err) {
        console.error("❌ SMTP ERROR:", err.message);
        res.status(500).json({ msg: `SMTP Error: ${err.message}` });
    }
});

// --- 5. VERIFY & RESET ---
router.post('/verify-otp', async (req, res) => {
    const { email, otp } = req.body;
    try {
        const user = await User.findOne({ 
            email, 
            resetPasswordOTP: otp,
            resetPasswordExpires: { $gt: Date.now() } 
        });
        
        if (!user) {
            return res.status(400).json({ msg: "Invalid or expired OTP" });
        }
        res.json({ msg: "OTP verified" });
    } catch (err) {
        res.status(500).json({ msg: 'Server Error' });
    }
});

router.post('/reset-password', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ msg: "User not found" });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        user.resetPasswordOTP = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();
        res.json({ msg: "Password updated successfully" });
    } catch (err) {
        res.status(500).json({ msg: 'Server Error' });
    }
});

module.exports = router;