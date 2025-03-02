const express = require('express');
const path = require('path');
const figlet = require('figlet');
const colors = require('colors');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import routes
const apiRoutes = require('./routes/apiRoutes');

// Initialize express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// API routes
app.use('/api', apiRoutes);

// Default route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  // Display fancy console output
  console.log(
    figlet.textSync('MoodTunes', {
      font: 'Standard',
      horizontalLayout: 'default',
      verticalLayout: 'default'
    }).rainbow
  );
  console.log(colors.cyan('=================================='));
  console.log(colors.yellow(`Server running on port ${PORT}`));
  console.log(colors.green(`Visit http://localhost:${PORT} to get your mood-based playlists!`));
  console.log(colors.cyan('=================================='));
});
