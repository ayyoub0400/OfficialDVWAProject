const songLibrary = require('../data/songLibrary');
const moment = require('moment');

class PlaylistGenerator {
  generatePlaylist(mood, weatherCondition) {
    console.log(`Generating playlist for mood: ${mood}, weather: ${weatherCondition}`);
    
    // Get all songs that match mood or weather
    const matchingMoodSongs = songLibrary.filter(song => 
      song.moods.includes(mood.toLowerCase())
    );
    
    const matchingWeatherSongs = songLibrary.filter(song => 
      song.weatherTags.includes(weatherCondition.toLowerCase())
    );
    
    // Combine and remove duplicates
    const allMatchingSongs = [...new Set([...matchingMoodSongs, ...matchingWeatherSongs])];
    
    // If we don't have enough songs, add some random ones
    if (allMatchingSongs.length < 5) {
      const randomSongs = this.getRandomSongs(5 - allMatchingSongs.length, allMatchingSongs);
      allMatchingSongs.push(...randomSongs);
    }
    
    // Shuffle the playlist
    const shuffledPlaylist = this.shuffleArray(allMatchingSongs);
    
    // Take the first 10 songs or fewer if we don't have that many
    const finalPlaylist = shuffledPlaylist.slice(0, 10);
    
    return {
      mood,
      weatherCondition,
      generatedAt: moment().format('MMMM Do YYYY, h:mm:ss a'),
      songCount: finalPlaylist.length,
      songs: finalPlaylist
    };
  }
  
  getRandomSongs(count, excludeSongs) {
    const excludeIds = excludeSongs.map(song => song.id);
    const availableSongs = songLibrary.filter(song => !excludeIds.includes(song.id));
    
    const randomSongs = [];
    for (let i = 0; i < count && i < availableSongs.length; i++) {
      const randomIndex = Math.floor(Math.random() * availableSongs.length);
      randomSongs.push(availableSongs[randomIndex]);
      availableSongs.splice(randomIndex, 1);
    }
    
    return randomSongs;
  }
  
  shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  }
}

module.exports = new PlaylistGenerator();
