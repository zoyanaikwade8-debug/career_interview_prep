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
        let questions = await Question.find({ jobRole }).limit(30);
        
        // AUTO-SEEDING LOGIC: If no questions exist for this role, auto-generate them
        if (questions.length === 0) {
            const isNetwork = jobRole.toLowerCase().includes('network');
            const defaultDepartment = isNetwork ? 'IT & Networking' : 'General';
            
            let seedData = [];
            
            if (isNetwork) {
                seedData = [
                    {
                        department: defaultDepartment,
                        jobRole,
                        questionText: 'Explain the 7 layers of the OSI model.',
                        options: [
                            'Physical, Data Link, Network, Transport, Session, Presentation, Application',
                            'Network, Internet, Transport, Application, Session, Presentation, Physical',
                            'Physical, Logical, Transport, Application, Session, Presentation, Data Link',
                            'Application, Presentation, Session, Transport, Logical, Data Link, Physical'
                        ],
                        correctAnswer: 'Physical, Data Link, Network, Transport, Session, Presentation, Application'
                    },
                    {
                        department: defaultDepartment,
                        jobRole,
                        questionText: 'What is the primary difference between TCP and UDP?',
                        options: [
                            'TCP is connection-oriented, UDP is connectionless',
                            'UDP is connection-oriented, TCP is connectionless',
                            'TCP is faster but less reliable than UDP',
                            'Both operate strictly at the Application Layer'
                        ],
                        correctAnswer: 'TCP is connection-oriented, UDP is connectionless'
                    },
                    {
                        department: defaultDepartment,
                        jobRole,
                        questionText: 'How does a router differ from a switch?',
                        options: [
                            'A router connects different networks (Layer 3), a switch connects devices within a network (Layer 2)',
                            'A switch connects different networks, a router connects devices within a network',
                            'They are functionally identical in modern networks',
                            'A router only handles wireless traffic, a switch only handles wired traffic'
                        ],
                        correctAnswer: 'A router connects different networks (Layer 3), a switch connects devices within a network (Layer 2)'
                    }
                ];
            } else {
                seedData = [
                    {
                        department: defaultDepartment,
                        jobRole,
                        questionText: `What is a critical competency required for a successful ${jobRole}?`,
                        options: [
                            'Effective communication and teamwork',
                            'Domain-specific technical expertise',
                            'Analytical problem solving',
                            'All of the above'
                        ],
                        correctAnswer: 'All of the above'
                    },
                    {
                        department: defaultDepartment,
                        jobRole,
                        questionText: `How should a professional ${jobRole} handle a suddenly approaching tight deadline?`,
                        options: [
                            'Immediately request a deadline extension without reviewing the work',
                            'Prioritize critical tasks, communicate blockers, and manage time efficiently',
                            'Ignore the deadline and proceed at a normal pace',
                            'Work non-stop without sleep until the task is complete'
                        ],
                        correctAnswer: 'Prioritize critical tasks, communicate blockers, and manage time efficiently'
                    },
                    {
                        department: defaultDepartment,
                        jobRole,
                        questionText: 'Which of the following best describes an effective approach to overcoming a major project challenge?',
                        options: [
                            'Blaming other departments or team members',
                            'Ignoring the problem hoping it resolves itself',
                            'Analyzing the root cause, consulting peers, and methodically implementing a solution',
                            'Immediately escalating to upper management before attempting to solve it'
                        ],
                        correctAnswer: 'Analyzing the root cause, consulting peers, and methodically implementing a solution'
                    }
                ];
            }

            // Insert seed data into MongoDB
            await Question.insertMany(seedData);
            
            // Re-fetch the newly inserted questions
            questions = await Question.find({ jobRole }).limit(30);
        }

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
