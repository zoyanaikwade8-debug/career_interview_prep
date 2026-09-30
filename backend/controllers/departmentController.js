const Department = require('../models/Department');

const getDepartments = async (req, res) => {
    try {
        // Automatically seed the database if it's empty to satisfy the requirement
        let departments = await Department.find();
        
        if (departments.length === 0) {
            const seedData = [
                {
                    name: 'Information Technology (IT)',
                    description: 'Focuses on computing infrastructure, networks, and IT services.',
                    jobRoles: [
                        'Systems Administrator', 'Network Engineer', 'IT Support Specialist', 
                        'Database Administrator', 'Cloud Architect', 'IT Security Analyst', 
                        'DevOps Engineer', 'IT Project Manager', 'Business Systems Analyst'
                    ]
                },
                {
                    name: 'Computer Science (CS)',
                    description: 'Focuses on software engineering, application development, and computational theory.',
                    jobRoles: [
                        'Frontend Developer', 'Backend Developer', 'Full Stack Developer', 
                        'Mobile App Developer', 'Software Engineer', 'Quality Assurance Tester', 
                        'Game Developer', 'Machine Learning Engineer', 'Embedded Systems Developer'
                    ]
                },
                {
                    name: 'Data Science (DS)',
                    description: 'Focuses on extracting insights from data, statistics, and machine learning.',
                    jobRoles: [
                        'Data Analyst', 'Data Scientist', 'Data Engineer', 
                        'Business Intelligence Analyst', 'Machine Learning Scientist', 
                        'Deep Learning Engineer', 'Data Architect', 'Statistician', 'Quantitative Analyst'
                    ]
                }
            ];
            
            await Department.insertMany(seedData);
            departments = await Department.find(); // Fetch the newly inserted data
        }

        res.json(departments);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

module.exports = {
    getDepartments
};
