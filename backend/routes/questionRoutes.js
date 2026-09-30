const express = require('express');
const router = express.Router();
const {
    getQuestions,
    getQuestionsByRole,
    createQuestion,
    updateQuestion,
    deleteQuestion
} = require('../controllers/questionController');

router.route('/')
    .get(getQuestions)
    .post(createQuestion);

router.route('/role/:jobRole')
    .get(getQuestionsByRole);

router.route('/:id')
    .put(updateQuestion)
    .delete(deleteQuestion);

module.exports = router;
