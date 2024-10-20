// models/DailySummary.js

const mongoose = require('mongoose');

const DailySummarySchema = new mongoose.Schema({
  city: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  avgTemp: {
    type: Number,
    required: true
  },
  maxTemp: {
    type: Number,
    required: true
  },
  minTemp: {
    type: Number,
    required: true
  },
  dominantWeather: {
    type: String,
    required: true
  },
  avgHumidity: { // New field for average humidity
    type: Number,
    required: true
  },
  avgWindSpeed: { // New field for average wind speed
    type: Number,
    required: true
  }
});

module.exports = mongoose.model('DailySummary', DailySummarySchema);
