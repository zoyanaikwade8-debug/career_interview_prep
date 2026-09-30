const express = require('express');
const router = express.Router();
const { getDepartments } = require('../controllers/departmentController');

router.route('/').get(getDepartments);

module.exports = router;
