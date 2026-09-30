const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'https://career-interview-prep-w79q.vercel.app'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/questions', require('./routes/questionRoutes'));
app.use('/api/departments', require('./routes/departmentRoutes'));
app.use('/api/results', require('./routes/resultRoutes'));

// Fallback Routes (in case frontend VITE_API_URL omits the /api prefix)
app.use('/auth', require('./routes/authRoutes'));
app.use('/questions', require('./routes/questionRoutes'));
app.use('/departments', require('./routes/departmentRoutes'));
app.use('/results', require('./routes/resultRoutes'));

app.get('/', (req, res) => {
    res.send('API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
