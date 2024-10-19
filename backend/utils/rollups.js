// utils/rollups.js

const Weather = require('../models/weatherModel');

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
          dominantWeather: { $first: '$main' }, // Can enhance this for "dominance" criteria
          count: { $sum: 1 }
        }
      }
    ]);

    if (dailyData.length > 0) {
      console.log(`Daily summary for ${city}:`, dailyData[0]);
      // Store or update the daily summary in a separate collection if needed
    }
  } catch (error) {
    console.error("Error calculating daily summary:", error.message);
  }
}

module.exports = {
  calculateDailySummary
};
