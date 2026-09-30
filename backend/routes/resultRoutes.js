const express = require('express');
const router = express.Router();
const { submitQuiz, getUserResults } = require('../controllers/resultController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, submitQuiz)
    .get(protect, getUserResults);

module.exports = router;
