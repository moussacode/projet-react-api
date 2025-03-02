const express = require('express');
const { login, register } = require('../controllers/authController');
const { protect, authorize } = require('../middleware/auth');


const router = express.Router();

router.post('/login', login);
router.post('/register', register);

router.use(protect);
router.use(authorize('admin'));

module.exports = router;