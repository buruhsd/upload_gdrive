const express = require('express');
const app = express();
const path = require('path');

// Serve static files (HTML, JS, CSS, etc.) from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  // Send the HTML file when the root URL is accessed
  res.sendFile(path.join(__dirname, 'test.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
