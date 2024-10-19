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
