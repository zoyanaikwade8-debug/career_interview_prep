const express = require('express');
const router = express.Router();
const { submitQuiz } = require('../controllers/resultController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').post(protect, submitQuiz);

module.exports = router;
