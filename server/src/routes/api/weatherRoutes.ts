import { Router } from 'express';
import { get } from 'http';
const router = Router();

import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

// TODO: POST Request with city name to retrieve weather data
router.post('/', async (req, res) => {
  // TODO: GET weather data from city name
  const city = req.body.city;
  const weatherData = await WeatherService.fetchLocationData(city);
    // TODO: save city to search history
  await HistoryService.addCity(city);
  res.json(weatherData);
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

export default router;