// models/Weather.js

const mongoose = require('mongoose');

const WeatherSchema = new mongoose.Schema({
  city: {
    type: String,
    required: true
  },
  main: {
    type: String,
    required: true
  },
  temp: {
    type: Number,
    required: true
  },
  feels_like: {
    type: Number,
    required: true
  },
  humidity: { // New field for humidity
    type: Number,
    required: true
  },
  wind_speed: { // New field for wind speed
    type: Number,
    required: true
  },
  dt: {
    type: Date,
    required: true
  },
});

module.exports = mongoose.model('Weather', WeatherSchema);
