import dotenv from 'dotenv';
dotenv.config();

// TODO: Define an interface for the Coordinates object
interface Coordinates {
  lat: number;
  lon: number;
}

// TODO: Define a class for the Weather object
class Weather {
  private city: string;
  private date: string;
  private icon: string;
  private description: string;
  private temperature: number;
  private windSpeed: number;
  private humidity: number;
  
  constructor(city: string, date: string, icon: string, description: string, temperature: number, windSpeed: number, humidity: number) {
    this.city = city;
    this.date = date;
    this.icon = icon;
    this.description = description;
    this.temperature = temperature;
    this.windSpeed = windSpeed;
    this.humidity = humidity;
  }

  getCity() {
    return this.city;
  }

  getDate() {
    return this.date;
  }

  getIcon() {
    return this.icon;
  }

  getDescription() {
    return this.description;
  }

  getTemperature() {
    return this.temperature;
  }

  getWindSpeed() {
    return this.windSpeed;
  }

  getHumidity() {
    return this.humidity;
  }
}

// TODO: Complete the WeatherService class
class WeatherService {
  // TODO: Define the baseURL, API key, and city name properties
  baseURL: string;
  apiKey: string;
  cityName: string;
  constructor() {
    this.baseURL = 'http://api.openweathermap.org/data/2.5/forecast';
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
    const currentWeather = new Weather(data[0].city ?? '', data[0].date ?? '', data[0].weather?.icon ?? 'No icon', data[0].weather?.description ?? 'No description', data[0].temp ?? 0, data[0].wind_speed ?? 0, data[0].humidity ?? 0);
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
      return new Weather(day.city ?? '', day.date ?? '', day.weather?.icon ?? 'No icon', day.weather?.description ?? 'No description', day.temp ?? 0, day.wind_speed ?? 0, day.humidity ?? 0);
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
