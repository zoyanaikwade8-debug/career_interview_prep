const Question = require('../models/Question');

// @desc    Get all questions
// @route   GET /api/questions
// @access  Public (or Admin protected in a real app)
const getQuestions = async (req, res) => {
    try {
        const questions = await Question.find();
        res.json(questions);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get questions by job role
// @route   GET /api/questions/role/:jobRole
const getQuestionsByRole = async (req, res) => {
    try {
        const { jobRole } = req.params;
        // Fetch up to 30 questions for this role randomly or sequentially
        const questions = await Question.find({ jobRole }).limit(30);
        res.json(questions);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Create a new question
// @route   POST /api/questions
const createQuestion = async (req, res) => {
    try {
        const { department, jobRole, questionText, options, correctAnswer } = req.body;
        
        if (!options || options.length !== 4) {
            return res.status(400).json({ message: 'Exactly 4 options are required' });
        }

        const question = await Question.create({
            department,
            jobRole,
            questionText,
            options,
            correctAnswer
        });

        res.status(201).json(question);
    } catch (error) {
        res.status(400).json({ message: 'Invalid data', error: error.message });
    }
};

// @desc    Update a question
// @route   PUT /api/questions/:id
const updateQuestion = async (req, res) => {
    try {
        const { department, jobRole, questionText, options, correctAnswer } = req.body;
        
        if (options && options.length !== 4) {
            return res.status(400).json({ message: 'Exactly 4 options are required' });
        }

        const question = await Question.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!question) {
            return res.status(404).json({ message: 'Question not found' });
        }

        res.json(question);
    } catch (error) {
        res.status(400).json({ message: 'Update failed', error: error.message });
    }
};

// @desc    Delete a question
// @route   DELETE /api/questions/:id
const deleteQuestion = async (req, res) => {
    try {
        const question = await Question.findByIdAndDelete(req.params.id);
        
        if (!question) {
            return res.status(404).json({ message: 'Question not found' });
        }

        res.json({ message: 'Question removed successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Delete failed', error: error.message });
    }
};

module.exports = {
    getQuestions,
    getQuestionsByRole,
    createQuestion,
    updateQuestion,
    deleteQuestion
};
