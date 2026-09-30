const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');
const { check } = require('express-validator');

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
            'Please enter a password with 6 or more characters, containing at least one number and one special character'
        ).isLength({ min: 6 }).matches(/^(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/)
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

module.exports = router;
