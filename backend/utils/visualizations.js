// utils/visualizations.js

const DailySummary = require('../models/dailySummaryModel');

// Function to get daily summaries for visualization
async function getDailySummaries(city) {
  try {
    const summaries = await DailySummary.find({ city: city }).sort({ date: -1 });
    return summaries;
  } catch (error) {
    console.error("Error fetching daily summaries for visualization:", error.message);
    throw error; // Rethrow the error for handling in the controller
  }
}

module.exports = {
  getDailySummaries
};
