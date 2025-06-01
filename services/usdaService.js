
const axios = require('axios');

const fetchCalories = async (dish_name, apiKey) => {
  const url = 'https://api.nal.usda.gov/fdc/v1/foods/search';
  const params = {
    query: dish_name,
    api_key: apiKey,
    pageSize: 1,
  };

  const response = await axios.get(url, { params });
  const food = response.data.foods[0];

  if (!food || !food.foodNutrients) throw new Error('Dish not found');

  const caloriesNutrient = food.foodNutrients.find(n => n.nutrientName.toLowerCase() === 'energy');
  const caloriesPerServing = caloriesNutrient ? caloriesNutrient.value : 0;

  return {
    dish_name,
    calories_per_serving: caloriesPerServing,
    source: 'USDA FoodData Central',
  };
};

module.exports = { fetchCalories };
