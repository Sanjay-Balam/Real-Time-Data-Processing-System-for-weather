// test/weatherTest.js

const chai = require('chai');
const sinon = require('sinon');
const mongoose = require('mongoose');
const { expect } = chai;

const Weather = require('../models/weatherModel');
const { calculateDailySummary } = require('../utils/rollups');
const { checkThresholds } = require('../utils/alerting');

describe('Weather Rollups and Alerts', function() {
  before(async function() {
    // Connect to test database
    await mongoose.connect('mongodb+srv://bsanjay0701:YKY4Ca9QMRzAlLuB@cluster0.ohqeuj1.mongodb.net/assignment2', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
  });

  after(async function() {
    // Drop the test database after all tests
    await mongoose.connection.db.dropDatabase();
    await mongoose.disconnect();
  });

  describe('Daily Rollups', function() {
    beforeEach(async function() {
      // Insert mock data into the database before each test
      const weatherData = [
        { city: 'Delhi', main: 'Clear', temp: 30, dt: new Date() },
        { city: 'Delhi', main: 'Clear', temp: 32, dt: new Date() },
        { city: 'Delhi', main: 'Rain', temp: 28, dt: new Date() }
      ];

      await Weather.insertMany(weatherData);
    });

    afterEach(async function() {
      // Clear the weather data after each test
      await Weather.deleteMany({});
    });

    it('should calculate correct daily summary for a city', async function() {
      const dailySummary = await calculateDailySummary('Delhi');

      expect(dailySummary).to.be.an('object');
      expect(dailySummary.avgTemp).to.equal(30);  // (30 + 32 + 28) / 3
      expect(dailySummary.maxTemp).to.equal(32);
      expect(dailySummary.minTemp).to.equal(28);
      expect(dailySummary.dominantWeather).to.equal('Clear');  // Dominant based on frequency
    });
  });

  describe('Threshold-based Alerts', function() {
    let consoleSpy;

    beforeEach(function() {
      // Spy on console.log to capture alert messages
      consoleSpy = sinon.spy(console, 'log');
    });

    afterEach(function() {
      // Restore the original console.log behavior
      consoleSpy.restore();
    });

    it('should trigger alert when temperature exceeds threshold', function() {
      const weatherData = { city: 'Delhi', temp: 36, main: 'Clear' };

      checkThresholds(weatherData);

      expect(consoleSpy.calledWith('ALERT: High temperature in Delhi: 36°C')).to.be.true;
    });

    it('should not trigger alert when temperature is below threshold', function() {
      const weatherData = { city: 'Delhi', temp: 32, main: 'Clear' };

      checkThresholds(weatherData);

      expect(consoleSpy.called).to.be.false;
    });

    it('should trigger alert after consecutive threshold breaches', function() {
      const weatherData1 = { city: 'Delhi', temp: 36, main: 'Clear' };
      const weatherData2 = { city: 'Delhi', temp: 37, main: 'Clear' };

      checkThresholds(weatherData1);
      checkThresholds(weatherData2);

      expect(consoleSpy.calledWith('ALERT: High temperature in Delhi: 37°C')).to.be.true;
    });
  });
});
