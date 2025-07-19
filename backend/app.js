require('dotenv').config();
const express = require('express');
const app = express();
const passport = require('passport');
require('./passport'); 
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');


const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const studentsRouter = require('./routes/students');

app.use(passport.initialize());
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001','https://student-new-portal.vercel.app','https://student-new-portal-m2tm5v2wy-urvi-chawlas-projects.vercel.app'],
  credentials: true
}));
app.use(logger('dev'));
app.use(express.json()); // <-- MOVE THIS UP!
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/auth', require('./routes/auth'));
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api/students', studentsRouter);
// MongoDB connection...
// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/studentsportal', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.error('MongoDB connection error:', err));



module.exports = app;