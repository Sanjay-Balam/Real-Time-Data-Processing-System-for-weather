// scripts/weatherPoller.js

const axios = require('axios');
const express = require('express');
const cors = require('cors');
const connectDB = require('../config/db');
const { saveWeatherData } = require('../controllers/weatherController');
const { getDailySummaries } = require('../utils/visualizations'); // Import the function to get daily summaries
require('dotenv').config();

const app = express();
app.use(cors());

connectDB();

const apiKey = process.env.OPENWEATHER_API_KEY;
const cities = ['Delhi', 'Mumbai', 'Chennai', 'Bangalore', 'Kolkata', 'Hyderabad'];

async function fetchWeatherData(city) {
  const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

  try {
    const response = await axios.get(url);
    const data = response.data;

    const weather = {
      city: city,
      main: data.weather[0].main,
      temp: (data.main.temp - 273.15).toFixed(2),
      feels_like: (data.main.feels_like - 273.15).toFixed(2),
      dt: new Date(data.dt * 1000)
    };

    await saveWeatherData(weather);
    console.log(`Weather data for ${city} saved successfully`);
    
    return weather; // Return the weather data

  } catch (error) {
    console.error(`Error fetching weather data for ${city}:`, error.message);
    return null; // Return null in case of error
  }
}

async function fetchAllCitiesWeather() {
  const allWeatherData = []; // Array to hold weather data for all cities
  for (let city of cities) {
    const weatherData = await fetchWeatherData(city);
    if (weatherData) {
      allWeatherData.push(weatherData); // Collect weather data
    }
  }
  console.log("Printing all the weather details",allWeatherData);
  return allWeatherData; // Return all collected weather data
}

// Function to fetch and save weather data for all cities
const updateWeatherData = async () => {
  console.log("Fetching weather data for all cities...");
  await fetchAllCitiesWeather(); // Fetch and save weather data
};

// Set an interval to update weather data every 5 minutes (300000 ms)
setInterval(updateWeatherData, 300000); // 300000 ms = 5 minutes

// Initial fetch to populate data when the server starts
updateWeatherData();

// Updated GET endpoint to fetch weather data for all cities continuously
app.get('/api/weather', async (req, res) => {
  // Function to send updated weather data
  const sendWeatherData = async () => {
    try {
      const weatherData = await fetchAllCitiesWeather(); // Get all weather data
      res.write(JSON.stringify(weatherData)); // Send the weather data as a stream
      res.write('\n'); // New line to separate data
    } catch (error) {
      console.error('Error fetching weather data:', error);
      res.write('Error fetching weather data\n'); // Send error message
    }
  };

  // Send initial weather data
  await sendWeatherData();

  // Set interval to send updated weather data every 10 seconds
  const intervalId = setInterval(sendWeatherData, 300000); // 5min

  // Clear the interval and end the response when the client disconnects
  req.on('close', () => {
    clearInterval(intervalId);
    res.end(); // End the response
  });
});

// New GET endpoint to visualize daily summaries
app.get('/api/visualize', async (req, res) => {
  const city = req.query.city; // Get city from query parameters
  try {
    const summaries = await getDailySummaries(city); // Fetch daily summaries for the specified city
    res.json(summaries); // Send the summaries as a JSON response
  } catch (error) {
    console.error('Error fetching daily summaries:', error);
    res.status(500).send('Error fetching daily summaries'); // Send error response
  }
});

app.get('/', (req, res) => {
  res.send('Weather polling system is running');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
