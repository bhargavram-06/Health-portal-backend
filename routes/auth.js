const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const nodemailer = require('nodemailer');
const User = require('../models/User');

// --- Updated Helper for Nodemailer ---
// Using host and port 465 is more reliable for Gmail than just 'service: gmail'
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // Use SSL
    auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS  
    }
});

// @route   POST api/auth/register
router.post('/register', async (req, res) => {
    const { fullName, email, password, age, bloodGroup, height, weight } = req.body;
    try {
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ msg: "User already exists" });

        user = new User({ fullName, email, password, age, bloodGroup, height, weight });
        
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        await user.save();

        const payload = { 
            user: { 
                id: user.id, 
                fullName: user.fullName, 
                email: user.email,
                age: user.age, 
                bloodGroup: user.bloodGroup, 
                height: user.height, 
                weight: user.weight 
            } 
        };

        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' }, (err, token) => {
            if (err) throw err;
            res.json({ token, msg: "Registration Successful" });
        });
    } catch (err) {
        console.error("Register Error:", err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/auth/login
router.post('/login', async (req, res) => {
    const { email, password, captchaToken } = req.body;
    try {
        const response = await axios.post(`https://www.google.com/recaptcha/api/siteverify`, null, {
            params: { secret: process.env.RECAPTCHA_SECRET_KEY, response: captchaToken }
        });
        if (!response.data.success) return res.status(400).json({ msg: "reCAPTCHA failed" });

        let user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: "Invalid Credentials" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: "Invalid Credentials" });

        const payload = { 
            user: { 
                id: user.id, 
                fullName: user.fullName, 
                email: user.email,
                age: user.age, 
                bloodGroup: user.bloodGroup, 
                height: user.height, 
                weight: user.weight 
            } 
        };

        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' }, (err, token) => {
            if (err) throw err;
            res.json({ token });
        });
    } catch (err) {
        console.error("Login Error:", err.message);
        res.status(500).send('Server Error');
    }
});

// --- FORGOT PASSWORD ROUTES ---

// 1. Send OTP
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ msg: "User not found" });

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.resetPasswordOTP = otp;
        user.resetPasswordExpires = Date.now() + 600000; // 10 minutes
        await user.save();

        const mailOptions = {
            from: `"Health Portal Support" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Your Password Reset OTP',
            html: `
                <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                    <h2 style="color: #00c853;">Password Reset Request</h2>
                    <p>You requested to reset your password. Use the code below to proceed:</p>
                    <div style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #333; margin: 20px 0;">${otp}</div>
                    <p style="color: #666; font-size: 12px;">This code will expire in 10 minutes.</p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        res.json({ msg: "OTP sent to your email" });
    } catch (err) {
        console.error("Forgot Pass Error:", err);
        res.status(500).json({ msg: "Error sending email" });
    }
});

// 2. Verify OTP
router.post('/verify-otp', async (req, res) => {
    const { email, otp } = req.body;
    try {
        const user = await User.findOne({ 
            email, 
            resetPasswordOTP: otp, 
            resetPasswordExpires: { $gt: Date.now() } 
        });
        
        if (!user) return res.status(400).json({ msg: "Invalid or expired OTP" });
        
        res.json({ msg: "OTP verified" });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// 3. Reset Password
router.post('/reset-password', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ msg: "User not found" });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        
        // Clear OTP fields after successful reset
        user.resetPasswordOTP = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.json({ msg: "Password updated successfully" });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

module.exports = router;