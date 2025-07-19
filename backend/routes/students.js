  console.log('students.js loaded');
const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  console.log('authHeader:', authHeader); // <--- Add this
  if (!authHeader) {
    console.log('No token provided');
    return res.status(401).json({ error: 'No token' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded JWT:', decoded); // <--- Add this
    req.user = decoded;
    next();
  } catch (err) {
    console.error('JWT verification error:', err); // <--- Add this
    res.status(401).json({ error: 'Invalid token' });
  }
}

// --- /me routes FIRST ---
router.get('/me', authMiddleware, async (req, res) => {
  console.log('GET /api/students/me route hit');
  console.log('req.user:', req.user);
  try {
    if (!req.user || !req.user.id) {
      console.log('No user or user.id in req.user');
      return res.status(400).json({ error: 'No user ID in token' });
    }
    const student = await Student.findById(req.user.id, '-password');
    console.log('student:', student);
    if (!student) {
      console.log('Student not found for id:', req.user.id);
      return res.status(404).json({ error: 'Student not found' });
    }
    res.json(student);
  } catch (err) {
    console.error('Error in /me:', err);
    res.status(500).json({ error: err.message });
  }
});
router.put('/me', authMiddleware, async (req, res) => {
  try {
    const { name, email } = req.body;
    const student = await Student.findByIdAndUpdate(
      req.user.id,
      { name, email },
      { new: true, select: '-password' }
    );
    if (!student) return res.status(404).json({ error: 'Student not found' });
    res.json(student);
  } catch (err) {
    console.error('Error in /me:', err); 
    res.status(400).json({ error: err.message });
  }
});
router.post('/me/pay', authMiddleware, async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(
      req.user.id,
      { feesPaid: true },
      { new: true, select: '-password' }
    );
    if (!student) return res.status(404).json({ error: 'Student not found' });
    res.json({ message: 'Fees paid successfully', student });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// --- /me routes END ---

// Get all students (protected)
router.get('/',  async (req, res) => {
  try {
  
    const students = await Student.find({}, '-password');
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Register a new student (public)
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    // Check if email already exists
    const existing = await Student.findOne({ email });
    if (existing) {
      return res.status(400).json({ error: 'Email already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const student = new Student({ name, email, password: hashedPassword });
    await student.save();
    res.status(201).json({ message: 'Student registered successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
// Login (handled in /api/auth/login)

// Get profile by ID (protected)
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const student = await Student.findById(req.params.id, '-password');
    if (!student) return res.status(404).json({ error: 'Student not found' });
    res.json(student);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { name, email } = req.body;
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      { name, email },
      { new: true, select: '-password' }
    );
    if (!student) return res.status(404).json({ error: 'Student not found' });
    res.json(student);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Pay fees (simulate payment, protected)
router.post('/:id/pay', authMiddleware, async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      { feesPaid: true },
      { new: true, select: '-password' }
    );
    if (!student) return res.status(404).json({ error: 'Student not found' });
    res.json({ message: 'Fees paid successfully', student });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router; 