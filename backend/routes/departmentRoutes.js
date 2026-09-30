const express = require('express');
const router = express.Router();
const { getDepartments } = require('../controllers/departmentController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getDepartments);

module.exports = router;
