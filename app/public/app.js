document.addEventListener('DOMContentLoaded', () => {
  // Get DOM elements
  const locationInput = document.getElementById('location');
  const moodSelect = document.getElementById('mood');
  const generateBtn = document.getElementById('generate-btn');
  const weatherCard = document.getElementById('weather-card');
  const weatherInfo = document.getElementById('weather-info');
  const playlistCard = document.getElementById('playlist-card');
  const playlistInfo = document.getElementById('playlist-info');

  // Load available moods
  fetch('/api/moods')
    .then(response => response.json())
    .then(data => {
      const { moods } = data;
      moods.forEach(mood => {
        const option = document.createElement('option');
        option.value = mood;
        option.textContent = capitalizeFirstLetter(mood);
        moodSelect.appendChild(option);
      });
    })
    .catch(error => console.error('Error loading moods:', error));

  // Generate playlist when button is clicked
  generateBtn.addEventListener('click', () => {
    const location = locationInput.value.trim();
    const mood = moodSelect.value;

    if (!location) {
      alert('Please enter your location');
      return;
    }

    if (!mood) {
      alert('Please select your mood');
      return;
    }

    // Show loading state
    generateBtn.textContent = 'Generating...';
    generateBtn.disabled = true;

    // Fetch playlist
    fetch(`/api/playlist?mood=${mood}&location=${location}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to generate playlist');
        }
        return response.json();
      })
      .then(data => {
        displayWeather(data.weather);
        displayPlaylist(data.playlist);
        generateBtn.textContent = 'Generate Playlist';
        generateBtn.disabled = false;
      })
      .catch(error => {
        console.error('Error:', error);
        alert('Error generating playlist. Please try again.');
        generateBtn.textContent = 'Generate Playlist';
        generateBtn.disabled = false;
      });
  });

  // Display weather information
  function displayWeather(weather) {
    weatherInfo.innerHTML = `
      <div class="weather-display">
        <div class="weather-icon">${getWeatherEmoji(weather.conditions)}</div>
        <h3>${weather.main}</h3>
        <p>${weather.description}</p>
        <p>${weather.temp}°C</p>
      </div>
    `;
    weatherCard.classList.remove('hidden');
  }

  // Display playlist
  function displayPlaylist(playlist) {
    let html = `
      <div class="playlist-header">
        <h3>${capitalizeFirstLetter(playlist.mood)} mood + ${capitalizeFirstLetter(playlist.weatherCondition)} weather</h3>
        <p>Generated at: ${playlist.generatedAt}</p>
      </div>
    `;

    html += '<div class="songs-list">';
    
    playlist.songs.forEach(song => {
      html += `
        <div class="song-item">
          <div class="song-title">${song.title}</div>
          <div class="song-artist">by ${song.artist}</div>
          <div class="song-genre">Genre: ${song.genre}</div>
          <div class="song-tags">
            ${song.moods.map(m => `<span class="tag mood-tag">${capitalizeFirstLetter(m)}</span>`).join('')}
            ${song.weatherTags.map(w => `<span class="tag">${capitalizeFirstLetter(w)}</span>`).join('')}
          </div>
        </div>
      `;
    });

    html += '</div>';
    
    playlistInfo.innerHTML = html;
    playlistCard.classList.remove('hidden');
    
    // Scroll to playlist
    playlistCard.scrollIntoView({ behavior: 'smooth' });
  }

  // Helper functions
  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  function getWeatherEmoji(condition) {
    const weatherEmojis = {
      'sunny': '☀️',
      'clear': '🌤️',
      'cloudy': '☁️',
      'rainy': '🌧️',
      'stormy': '⛈️',
      'snowy': '❄️',
      'foggy': '🌫️',
      'windy': '💨',
      'mild': '😌',
      'warm': '🌡️',
      'cold': '🥶',
      'unknown': '❓'
    };

    return weatherEmojis[condition] || '🌈';
  }
});
