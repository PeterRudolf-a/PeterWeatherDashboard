import fs from 'fs';

// TODO: Define a City class with name and id properties
class City {
  name: string;
  id: string;
  constructor(name: string, id: string) {
    this.name = name;
    this.id = id;
  }
}

// TODO: Complete the HistoryService class
class HistoryService {
  // TODO: Define a read method that reads from the searchHistory.json file
  private async read() {
    try {
      const data = await fs.promises.readFile('./searchHistory.json', 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error reading from searchHistory.json:', error);
    }
  }
  // TODO: Define a write method that writes the updated cities array to the searchHistory.json file
  private async write(cities: City[]) {
    try {
      await fs.promises.writeFile('./searchHistory.json', JSON.stringify(cities, null, 2));
    } catch (error) {
      console.error('Error writing to searchHistory.json:', error);
    }
  }
  // TODO: Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
  async getCities() {
    const cities = (await this.read()) || [];
    return cities
      .filter((city: any): city is City => city && typeof city.name === 'string' && typeof city.id === 'string')
      .map((city: City) => new City(city.name, city.id));
  }

  async getCity(id: string) {
    const cities = await this.read();
    if (!cities) {
      return undefined;
    }
    return cities.find((city: City) => city.id === id);
  }

  // TODO Define an addCity method that adds a city to the searchHistory.json file
  async addCity(city: City) {
    const cities = (await this.read()) || [];
    cities.push(city);
    await this.write(cities);
  }
  // * BONUS TODO: Define a removeCity method that removes a city from the searchHistory.json file
  async removeCity(id: string) {
    const cities = await this.read();
    const updatedCities = cities.filter((city: City) => city.id !== id);
    await this.write(updatedCities);
  }
}

export default new HistoryService();
