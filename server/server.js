const express = require('express');
const path = require('path');
require('dotenv').config(); // Load environment variables from .env file
const app = express();

const PORT = process.env.PORT || 3001; // Use any port you prefer

// Serve static files from the 'build' folder
app.use(express.static(path.join(__dirname, 'build')));

// Serve React app on any route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
