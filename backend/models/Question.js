const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    department: {
        type: String,
        required: true
    },
    jobRole: {
        type: String,
        required: true
    },
    questionText: {
        type: String,
        required: true
    },
    options: {
        type: [String],
        required: true,
        validate: [arrayLimit, '{PATH} exceeds the limit of 4']
    },
    correctAnswer: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

function arrayLimit(val) {
    return val.length === 4;
}

const Question = mongoose.model('Question', questionSchema);
module.exports = Question;
