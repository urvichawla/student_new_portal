 const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Student = require('../models/Student');
const router = express.Router();
const id = '6878eeaad080bb66dc54b184';

router.get('/test', (req, res) => res.send('Auth test route works!'));
// Local login (JWT)
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await Student.findOne({ email });
  if (!user) return res.status(400).json({ error: 'Invalid credentials' });
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });
  const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1d' });
  res.json({ token, user: { id: user._id, email: user.email, name: user.name } });
});

// Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', passport.authenticate('google', { session: false, failureRedirect: '/' }),
  (req, res) => {
    // Successful authentication, issue JWT
    const token = jwt.sign({ id: req.user._id, email: req.user.email }, process.env.JWT_SECRET, { expiresIn: '1d' });
    // Redirect to frontend with token (or send as JSON)
    res.redirect(`http://localhost:3000/profile?token=${token}`);
  }
);

module.exports = router; 