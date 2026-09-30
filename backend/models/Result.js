const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    jobRole: {
        type: String,
        required: true
    },
    score: {
        type: Number,
        required: true
    },
    totalQuestions: {
        type: Number,
        required: true,
        default: 0
    },
    details: [{
        questionText: String,
        submittedAnswer: String,
        correctAnswer: String,
        isCorrect: Boolean
    }]
}, {
    timestamps: true
});

const Result = mongoose.model('Result', resultSchema);
module.exports = Result;
