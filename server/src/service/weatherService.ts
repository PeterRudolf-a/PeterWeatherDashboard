import dotenv from 'dotenv';
dotenv.config();

// TODO: Define an interface for the Coordinates object
interface Coordinates {
  lat: number;
  lon: number;
}

// TODO: Define a class for the Weather object
class Weather {
  private temperature: number;
  private description: string;
  private icon: string;
  constructor(temperature: number, description: string, icon: string) {
    this.temperature = temperature;
    this.description = description;
    this.icon = icon;
  }
  getTemperature() {
    return this.temperature;
  }
  getDescription() {
    return this.description;
  }
  getIcon() {
    return this.icon;
  }
}

// TODO: Complete the WeatherService class
class WeatherService {
  // TODO: Define the baseURL, API key, and city name properties
  baseURL: string;
  apiKey: string;
  cityName: string;
  constructor() {
    this.baseURL = 'http://api.openweathermap.org/data/2.5/weather';
    this.apiKey = process.env.API_KEY || '';
    this.cityName = '';
  }
  // TODO: Create fetchLocationData method
  async fetchLocationData(query: string) {
    try {
      const response = await fetch(query);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(error);
    }
  }
  // TODO: Create destructureLocationData method
  destructureLocationData(locationData: Coordinates): Coordinates {
    const { lat, lon } = locationData;
    return { lat, lon };
  }
  // TODO: Create buildGeocodeQuery method
  buildGeocodeQuery(): string {
    const { baseURL, apiKey, cityName
    } = this;
    return `${baseURL}/geocode/v1/json?q=${cityName}&key=${apiKey}`;
  }
  // TODO: Create buildWeatherQuery method
  buildWeatherQuery(coordinates: Coordinates): string {
    const { baseURL, apiKey } = this;
    const { lat, lon } = coordinates;
    return `${baseURL}?lat=${lat}&lon=${lon}&appid=${apiKey}`;
  }
  // TODO: Create fetchAndDestructureLocationData method
  async fetchAndDestructureLocationData() {
    const query = this.buildGeocodeQuery();
    const locationData = await this.fetchLocationData(query);
    return this.destructureLocationData(locationData);
  }
  // TODO: Create fetchWeatherData method
  async fetchWeatherData(coordinates: Coordinates) {
    const query = this.buildWeatherQuery(coordinates);
    const response = await fetch(query);
    const data = await response.json();
    return data;
  }
  // TODO: Build parseCurrentWeather method
  parseCurrentWeather(response: any) {
    const { data } = response;
    const currentWeather = new Weather(data[0].temp, data[0].weather.description, data[0].weather.icon);
    return currentWeather;
  }
  // TODO: Complete buildForecastArray method
  buildForecastArray(response: any) {
    if (!response || !response.data || !Array.isArray(response.data)) {
      console.error('Invalid response format');
      return [];
    }
    const { data } = response;
    const forecastArray = data.slice(1).map((day: any) => {
      return new Weather(day.temp ?? 0, day.weather?.description ?? 'No description', day.weather?.icon ?? 'No icon');
    });
    return forecastArray;
  }
  // TODO: Complete getWeatherForCity method
  async getWeatherForCity(city: string) {
    this.cityName = city;
    const coordinates = await this.fetchAndDestructureLocationData();
    const weatherData = await this.fetchWeatherData(coordinates);
    const currentWeather = this.parseCurrentWeather(weatherData);
    const forecastArray = this.buildForecastArray(weatherData);
    return { currentWeather, forecastArray };
  }
}

export default new WeatherService();
