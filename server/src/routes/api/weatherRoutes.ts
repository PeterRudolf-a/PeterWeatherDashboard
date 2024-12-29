import { Router } from 'express';
//import { get } from 'http';
const router = Router();

import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

// TODO: POST Request with city name to retrieve weather data
router.post('/', async (req, res) => {
  // TODO: GET weather data from city name
  const city: string = req.body.city;
  if (!city) {
    return res.status(400).send({ error: 'City name is required' });
  }

  try {
    const coordinates = await WeatherService.fetchLocationData(city);
    if (!coordinates) {
      return res.status(500).send({ error: 'Failed to retrieve location data' });
    }
    const weatherData = await WeatherService.fetchWeatherData(coordinates);
    if (!weatherData) {
      return res.status(500).send({ error: 'Failed to save city to search history' });
    }
    res.send(weatherData);
    // TODO: save city to search history
    const cityId = weatherData.id;
    const cityName = weatherData.name;
    const newCity = { name: cityName, id: cityId };
    await HistoryService.addCity(newCity);
    return;
  } catch (error) {
    return res.status(500).send({ error: 'Failed to retrieve weather data' });
  }
});

// TODO: GET search history
router.get('/history', async (_req, res) => {
  try {
    const cities = await HistoryService.getCities();
    res.json(cities);
  } catch (error) {
    res.status(500).send({ error: 'Failed to retrieve search history' });
  }
});

// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const city = await HistoryService.getCity(id);
    if (!city) {
      return res.status(404).send({ error: 'City not found in search history' });
    }
    await HistoryService.removeCity(id);
    return res.json({ message: 'City removed from search history' });
  } catch (error) {
    return res.status(500).send({ error: 'Failed to remove city from search history' });
  }
});
