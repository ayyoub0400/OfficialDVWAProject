const axios = require('axios');
const NodeCache = require('node-cache');

// Cache weather results for 30 minutes
const weatherCache = new NodeCache({ stdTTL: 1800 });

class WeatherService {
  constructor() {
    this.apiKey = process.env.WEATHER_API_KEY || 'demo_key';
    this.baseUrl = 'https://api.openweathermap.org/data/2.5/weather';
  }

  async getWeather(location) {
    // Check cache first
    const cacheKey = `weather_${location.toLowerCase()}`;
    const cachedResult = weatherCache.get(cacheKey);
    
    if (cachedResult) {
      console.log(`Using cached weather for ${location}`);
      return cachedResult;
    }

    try {
      // If no API key provided or using demo key, return simulated weather
      if (this.apiKey === 'demo_key') {
        console.log('Using simulated weather data (no API key provided)');
        const simulatedWeathers = [
          { main: 'Clear', description: 'clear sky', temp: 22, conditions: 'sunny' },
          { main: 'Clouds', description: 'scattered clouds', temp: 18, conditions: 'cloudy' },
          { main: 'Rain', description: 'light rain', temp: 15, conditions: 'rainy' },
          { main: 'Thunderstorm', description: 'thunderstorm', temp: 17, conditions: 'stormy' },
          { main: 'Snow', description: 'light snow', temp: 0, conditions: 'snowy' }
        ];
        const randomWeather = simulatedWeathers[Math.floor(Math.random() * simulatedWeathers.length)];
        
        // Cache the result
        weatherCache.set(cacheKey, randomWeather);
        return randomWeather;
      }

      // Make API request if API key is provided
      const response = await axios.get(this.baseUrl, {
        params: {
          q: location,
          appid: this.apiKey,
          units: 'metric'
        }
      });

      const weatherData = {
        main: response.data.weather[0].main,
        description: response.data.weather[0].description,
        temp: response.data.main.temp,
        conditions: this.mapWeatherToCondition(response.data.weather[0].main)
      };

      // Cache the result
      weatherCache.set(cacheKey, weatherData);
      return weatherData;
    } catch (error) {
      console.error('Error fetching weather:', error.message);
      // Return a default in case of error
      return {
        main: 'Unknown',
        description: 'Unable to fetch weather',
        temp: 20,
        conditions: 'unknown'
      };
    }
  }

  mapWeatherToCondition(weatherMain) {
    const conditionMap = {
      'Clear': 'sunny',
      'Clouds': 'cloudy',
      'Rain': 'rainy',
      'Drizzle': 'rainy',
      'Thunderstorm': 'stormy',
      'Snow': 'snowy',
      'Mist': 'foggy',
      'Fog': 'foggy',
      'Haze': 'foggy'
    };

    return conditionMap[weatherMain] || 'mild';
  }
}

module.exports = new WeatherService();
