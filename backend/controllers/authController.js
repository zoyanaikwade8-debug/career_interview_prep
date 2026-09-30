const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};

const registerUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { firstName, surname, username, email, mobile, password } = req.body;

    try {
        const userExists = await User.findOne({ $or: [{ email }, { username }] });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = await User.create({
            firstName,
            surname,
            username,
            email,
            mobile,
            password
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                firstName: user.firstName,
                surname: user.surname,
                username: user.username,
                email: user.email,
                mobile: user.mobile,
                token: generateToken(user._id)
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

const loginUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                firstName: user.firstName,
                surname: user.surname,
                username: user.username,
                email: user.email,
                mobile: user.mobile,
                token: generateToken(user._id)
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

const googleAuth = async (req, res) => {
    try {
        const { email, displayName } = req.body;
        let user = await User.findOne({ email });

        if (user) {
            // Log in existing user
            return res.json({
                _id: user._id,
                firstName: user.firstName,
                surname: user.surname,
                username: user.username,
                email: user.email,
                mobile: user.mobile,
                token: generateToken(user._id)
            });
        } else {
            // Register new user via Google
            const names = displayName ? displayName.split(' ') : ['Google', 'User'];
            const firstName = names[0];
            const surname = names.length > 1 ? names[names.slice(1).join(' ')] : 'User';
            const username = email.split('@')[0] + Math.floor(Math.random() * 1000);
            
            // Generate a secure random password since they use Google
            const password = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8) + "1!";

            user = await User.create({
                firstName,
                surname: (surname && surname !== 'undefined') ? surname : 'User',
                username,
                email,
                mobile: '0000000000', // Default mobile for OAuth users
                password
            });

            return res.status(201).json({
                _id: user._id,
                firstName: user.firstName,
                surname: user.surname,
                username: user.username,
                email: user.email,
                mobile: user.mobile,
                token: generateToken(user._id)
            });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error during Google Auth', error: error.message });
    }
};

module.exports = {
    registerUser,
    loginUser,
    googleAuth
};
