// utils/alerting.js

// Configurable thresholds (can be modified for each city)
const thresholds = {
    temperature: 35, // Example threshold for temperature (Celsius)
    consecutiveUpdates: 2 // Number of consecutive updates to check
  };
  
  // Store a cache to track consecutive violations
  let alertCache = {};
  
  // Check thresholds and trigger alerts if necessary
  function checkThresholds(weatherData) {
    const city = weatherData.city;
    const temp = parseFloat(weatherData.temp);
  
    if (!alertCache[city]) {
      alertCache[city] = { count: 0, lastTemp: temp };
    }
  
    // Check if temperature exceeds threshold
    if (temp > thresholds.temperature) {
      alertCache[city].count++;
    } else {
      alertCache[city].count = 0; // Reset if threshold is not breached
    }
  
    // Trigger alert if the threshold is breached for two consecutive updates
    if (alertCache[city].count >= thresholds.consecutiveUpdates) {
      console.log(`ALERT: High temperature in ${city}: ${temp}°C`);
      // Trigger additional alert mechanisms like email or SMS here
    }
  }
  
  module.exports = {
    checkThresholds
  };
  