// api-server/index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const scrapeRoutes = require('./routes/scrape');

const sendEmail = require('./utils/sendEmail');
const User = require('./models/User');
const userRoutes = require('./routes/user'); // Optional: mount additional routes here

const app = express(); // ✅ Must come before app.use() calls
const PORT = process.env.PORT || 5000;
const SECRET = process.env.JWT_SECRET;

// ✅ Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("✅ Connected to MongoDB");
}).catch(err => {
  console.error("❌ MongoDB connection error:", err);
});

// ✅ Middlewares
app.use(cors());
app.use(express.json());

// ✅ Optional userRoutes if needed
app.use('/api/user', userRoutes);

// ✅ Token generator
const generateToken = (user) => {
  return jwt.sign({ email: user.email, username: user.username }, SECRET, { expiresIn: '1h' });
};

// ✅ Signup Route
app.post('/api/signup', async (req, res) => {
  const { username, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await User.create({ username, email, password: hashedPassword });
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(400).json({ error: 'Email already exists' });
  }
});

// ✅ Login Route
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ error: 'User not found' });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ error: 'Invalid credentials' });

  const token = jwt.sign({ id: user._id }, SECRET, { expiresIn: '1d' });

  res.json({
    token,
    user: {
      username: user.username,
      email: user.email
    },
    message: "Login successful"
  });
});

// ✅ Forgot Password
app.post('/api/forgot-password', async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ error: 'Email not found' });

  const token = crypto.randomBytes(32).toString("hex");
  user.resetToken = token;
  user.resetTokenExpiry = Date.now() + 3600000; // 1 hour
  await user.save();

  const link = `${process.env.FRONTEND_URL}/reset-password/${token}`;
  await sendEmail(email, "Reset Password", `<p>Click <a href="${link}">here</a> to reset your password</p>`);

  res.json({ message: 'Reset link sent to email' });
});

// ✅ Reset Password
app.post('/api/reset-password/:token', async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const user = await User.findOne({
    resetToken: token,
    resetTokenExpiry: { $gt: Date.now() }
  });

  if (!user) return res.status(400).json({ error: 'Token expired or invalid' });

  user.password = await bcrypt.hash(password, 10);
  user.resetToken = undefined;
  user.resetTokenExpiry = undefined;
  await user.save();

  res.json({ message: 'Password reset successful' });
});

// ✅ Protected Profile Endpoint
app.get('/api/profile', (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

  if (!token) return res.sendStatus(401);

  jwt.verify(token, SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    res.json({ message: 'Protected data', user });
  });
});

// ✅ Start Server
app.listen(PORT, () => {
  console.log(`🚀 API Server running at http://localhost:${PORT}`);
});

app.use('/api/scrape', scrapeRoutes);