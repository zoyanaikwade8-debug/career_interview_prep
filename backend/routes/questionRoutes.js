const express = require('express');
const router = express.Router();
const {
    getQuestions,
    getQuestionsByRole,
    createQuestion,
    updateQuestion,
    deleteQuestion
} = require('../controllers/questionController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, getQuestions)
    .post(protect, createQuestion);

router.route('/role/:jobRole')
    .get(protect, getQuestionsByRole);

router.route('/:id')
    .put(protect, updateQuestion)
    .delete(protect, deleteQuestion);

module.exports = router;
