const axios = require('axios');
const jwt = require('jsonwebtoken');

exports.getCalories = async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  const token = authHeader.split(' ')[1];
  try {
    jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }

  const { dishName, servings } = req.body;
  if (!dishName || servings <= 0) {
    return res.status(400).json({ error: 'Invalid input' });
  }

  try {
    const response = await axios.get('https://api.nal.usda.gov/fdc/v1/foods/search', {
      params: {
        query: dishName,
        api_key: process.env.USDA_API_KEY,
        pageSize: 1
      }
    });

    const food = response.data.foods?.[0];
    if (!food || !food.foodNutrients) throw new Error('Dish not found');

    const calorieData = food.foodNutrients.find(
      (n) => n.nutrientName.toLowerCase() === 'energy'
    );

    const calories_per_serving = calorieData ? calorieData.value : 0;
    const total_calories = calories_per_serving * servings;

    res.json({
      dishName,
      servings,
      calories_per_serving,
      total_calories,
      source: "USDA FoodData Central"
    });
  } catch (error) {
    res.status(404).json({ error: 'Dish not found or API error' });
  }
};
