const express = require('express');
const router = express.Router();
const weatherService = require('../services/weatherService');
const playlistGenerator = require('../services/playlistGenerator');

// Get available moods
router.get('/moods', (req, res) => {
  const moods = [
    'happy', 'sad', 'energetic', 'relaxed', 'peaceful',
    'motivated', 'melancholy', 'excited', 'thoughtful',
    'calm', 'intense', 'mysterious', 'cozy', 'content'
  ];
  
  res.json({ moods });
});

// Get weather for location
router.get('/weather/:location', async (req, res) => {
  try {
    const location = req.params.location;
    const weatherData = await weatherService.getWeather(location);
    res.json(weatherData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Generate playlist based on mood and location
router.get('/playlist', async (req, res) => {
  try {
    const { mood, location } = req.query;
    
    if (!mood || !location) {
      return res.status(400).json({ error: 'Mood and location are required' });
    }
    
    // Get weather for the location
    const weatherData = await weatherService.getWeather(location);
    
    // Generate playlist based on mood and weather
    const playlist = playlistGenerator.generatePlaylist(mood, weatherData.conditions);
    
    res.json({
      playlist,
      weather: weatherData
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
