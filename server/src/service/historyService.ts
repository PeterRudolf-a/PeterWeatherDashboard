import fs from 'fs';

// TODO: Define a City class with name and id properties
class City {
  name: string;
  id: string;
  constructor(name: string, id: string) {
    this.name = name;
    this.id = id;
  }
  getName() {
    return this.name;
  }
  getId() {
    return this.id;
  }
}

// TODO: Complete the HistoryService class
class HistoryService {
  // TODO: Define a read method that reads from the searchHistory.json file
  private async read() {
    try {
      const data = await fs.promises.readFile('db/searchHistory.json', 'utf-8');
      return JSON.parse(data);
    } catch (error: any) {
      console.error('Error reading from searchHistory.json:', error);
      console.warn('searchHistory.json file not found, returning empty array.');
      return [];
    }
  }

  async getCities() {
    return await this.read();
  }

  async getCity(id: string) {
    const cities = await this.read();
    return cities.find((city: City) => city.id === id);
  }

  // TODO: Define a write method that writes the updated cities array to the searchHistory.json file
  async addCity(city: City) {
    const newCity = new City(city.name, city.id);
    const cities = await this.read();
    if (cities.find((c: City) => c.id === newCity.id)) {
      return cities;
    }
    const updatedCities = [...cities, newCity];
    try {
      await fs.promises.writeFile('db/searchHistory.json', JSON.stringify(updatedCities, null, 2));
    } catch (error: any) {
      console.error('Error writing to searchHistory.json:', error);
    }
    return newCity;
  }

  // * BONUS TODO: Define a removeCity method that removes a city from the searchHistory.json file
  async removeCity(id: string) {
    const cities = await this.read();
    const updatedCities = cities.filter((city: City) => city.id !== id);
    await this.addCity(updatedCities);
  }
}

export default new HistoryService();
