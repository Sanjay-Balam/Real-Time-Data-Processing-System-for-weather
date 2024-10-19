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
  const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`; // Use metric for Celsius

  try {
    const response = await axios.get(url);
    const data = response.data;

    const weather = {
      city: city,
      main: data.weather[0].main,
      temp: data.main.temp,
      feels_like: data.main.feels_like,
      humidity: data.main.humidity, 
      wind_speed: data.wind.speed, 
      dt: new Date(data.dt * 1000)
    };

    await saveWeatherData(weather);
    console.log(`Weather data for ${city} saved successfully`);
    
    return weather; // Return the weather data

  } catch (error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      console.error(`Error fetching weather data for ${city}: ${error.response.status} - ${error.response.data.message}`);
    } else if (error.request) {
      // The request was made but no response was received
      console.error(`No response received for weather data request for ${city}:`, error.request);
    } else {
      // Something happened in setting up the request
      console.error(`Error in setting up request for ${city}:`, error.message);
    }
    return null;
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
      res.json(weatherData); // Send the weather data as a JSON response
    } catch (error) {
      console.error('Error fetching weather data:', error);
      res.status(500).send('Error fetching weather data'); // Send error message
    }
  };

  // Send initial weather data
  await sendWeatherData();

  // Set interval to send updated weather data every 5 minutes
  const intervalId = setInterval(sendWeatherData, 300000); // 300000 ms = 5 minutes

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

async function fetchWeatherForecast(city) {
  const url = `http://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`; // Use metric for Celsius

  try {
    const response = await axios.get(url);
    const forecastData = response.data.list.map(item => ({
      dt: new Date(item.dt * 1000),
      temp: item.main.temp,
      humidity: item.main.humidity,
      wind_speed: item.wind.speed,
      main: item.weather[0].main
    }));

    console.log(`Forecast data for ${city}:`, forecastData);
    return forecastData; // Return the forecast data

  } catch (error) {
    console.error(`Error fetching weather forecast for ${city}:`, error.message);
    return null; // Return null in case of error
  }
}

// Example usage of the forecast function
app.get('/api/forecast', async (req, res) => {
  const city = req.query.city;

  if (!city) {
    return res.status(400).send('City parameter is required');
  }

  try {
    const forecast = await fetchWeatherForecast(city);
    if (!forecast) {
      return res.status(404).send('Forecast data not found');
    }
    res.json(forecast);
  } catch (error) {
    console.error('Error fetching weather forecast:', error);
    res.status(500).send('Error fetching weather forecast');
  }
});
