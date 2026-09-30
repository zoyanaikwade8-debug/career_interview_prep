const express = require('express');
const router = express.Router();
const { registerUser, loginUser, googleAuth, updateProfile } = require('../controllers/authController');
const { check } = require('express-validator');
const { protect } = require('../middleware/authMiddleware');

router.post(
    '/register',
    [
        check('firstName', 'First name is required').not().isEmpty(),
        check('surname', 'Surname is required').not().isEmpty(),
        check('username', 'Username is required').not().isEmpty(),
        check('email', 'Please include a valid email').isEmail(),
        check('mobile', 'Mobile number is required').not().isEmpty(),
        check(
            'password',
            'Password must be exactly 8 characters long and contain both letters and numbers'
        ).matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8}$/)
    ],
    registerUser
);

router.post(
    '/login',
    [
        check('email', 'Please include a valid email').isEmail(),
        check('password', 'Password is required').exists()
    ],
    loginUser
);

// Google Auth Route
router.post('/google', googleAuth);

// Profile Route
router.put('/profile', protect, updateProfile);

module.exports = router;
