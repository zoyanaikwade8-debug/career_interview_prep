const Result = require('../models/Result');
const Question = require('../models/Question');

// @desc    Submit quiz and calculate score
// @route   POST /api/results
// @access  Private
const submitQuiz = async (req, res) => {
    try {
        const { jobRole, answers } = req.body;
        
        if (!jobRole || !answers) {
            return res.status(400).json({ message: 'Job role and answers are required' });
        }

        const questionIds = Object.keys(answers);
        
        // Fetch the submitted questions from database
        const questions = await Question.find({ _id: { $in: questionIds } });
        
        let score = 0;
        const details = [];

        // Calculate score securely on the backend
        questions.forEach((q) => {
            const userAnswer = answers[q._id.toString()] || '';
            const isCorrect = userAnswer === q.correctAnswer;
            
            if (isCorrect) {
                score += 1;
            }

            details.push({
                questionText: q.questionText,
                submittedAnswer: userAnswer,
                correctAnswer: q.correctAnswer,
                isCorrect
            });
        });

        // Save result in database
        const result = await Result.create({
            userId: req.user._id,
            jobRole,
            score,
            totalQuestions: questions.length,
            details
        });

        res.status(201).json({
            score: result.score,
            total: result.totalQuestions,
            details: result.details
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error calculating result', error: error.message });
    }
};

// @desc    Get logged in user results
// @route   GET /api/results
// @access  Private
const getUserResults = async (req, res) => {
    try {
        const results = await Result.find({ userId: req.user._id }).sort({ createdAt: -1 });
        res.json(results);
    } catch (error) {
        res.status(500).json({ message: 'Server Error fetching results', error: error.message });
    }
};

module.exports = {
    submitQuiz,
    getUserResults
};
