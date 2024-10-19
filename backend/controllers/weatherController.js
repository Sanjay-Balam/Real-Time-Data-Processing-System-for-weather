// controllers/weatherController.js

const Weather = require('../models/weatherModel');
const { calculateDailySummary } = require('../utils/rollups');
const { checkThresholds } = require('../utils/alerting');

// Save weather data for a city
async function saveWeatherData(weatherData) {
  try {
    const newWeatherData = new Weather(weatherData);
    await newWeatherData.save();
    
    // Trigger rollup calculations and threshold checks after saving data
    await calculateDailySummary(weatherData.city);
    checkThresholds(weatherData);

    console.log(`Weather data for ${weatherData.city} saved and processed.`);
  } catch (error) {
    console.error("Error saving weather data:", error.message);
  }
}

module.exports = {
  saveWeatherData
};
