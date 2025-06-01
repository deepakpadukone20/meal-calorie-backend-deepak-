const express = require('express');
const router = express.Router();
const { getCalories } = require('../controllers/calorieController');

router.post('/get-calories', getCalories);

module.exports = router;
