// utils/rollups.js

const Weather = require('../models/weatherModel'); // Import the Weather model
const DailySummary = require("../models/dailySummaryModel")

// Calculate daily rollups for a specific city
async function calculateDailySummary(city) {
  try {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    const dailyData = await Weather.aggregate([
      { $match: { city: city, dt: { $gte: today } } },
      {
        $group: {
          _id: '$city',
          avgTemp: { $avg: '$temp' },
          maxTemp: { $max: '$temp' },
          minTemp: { $min: '$temp' },
          dominantWeather: { $first: '$main' },
          avgHumidity: { $avg: '$humidity' },
          avgWindSpeed: { $avg: '$wind_speed' },
          count: { $sum: 1 }
        }
      }
    ]);

    if (dailyData.length > 0) {
      console.log(`Daily summary for ${city}:`, dailyData[0]);
      
      const summary = new DailySummary({
        city: city,
        date: today,
        avgTemp: dailyData[0].avgTemp,
        maxTemp: dailyData[0].maxTemp,
        minTemp: dailyData[0].minTemp,
        dominantWeather: dailyData[0].dominantWeather,
        avgHumidity: dailyData[0].avgHumidity,
        avgWindSpeed: dailyData[0].avgWindSpeed
      });
      await summary.save();
    }
  } catch (error) {
    console.error(`Error calculating daily summary for ${city}:`, error.message);
  }
}

module.exports = {
  calculateDailySummary
};
