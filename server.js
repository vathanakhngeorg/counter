const express = require('express');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = './count.json';

app.use(cors());
app.use(express.json());

// Ensure the data file exists
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, '{}', 'utf8');
}

// Load data safely from JSON file
function loadData() {
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(data || '{}'); // fallback to empty object if file empty
  } catch (err) {
    console.error('Error reading count.json:', err);
    return {};
  }
}

// Save data safely to JSON file
function saveData(data) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('Error saving count.json:', err);
  }
}

// Default route
app.get('/', (req, res) => {
  res.send('👋 Welcome to the Counter API! Use /api/count/:key');
});

// Visitor counter API
app.get('/api/count/:key', (req, res) => {
  const key = req.params.key;

  // Load current counts
  const data = loadData();

  // Increment counter
  data[key] = (data[key] || 0) + 1;

  // Save updated counts
  saveData(data);

  // Return JSON response
  res.json({ key, value: data[key] });
});

// Optional: Reset counter for a key (use carefully)
app.delete('/api/count/:key', (req, res) => {
  const key = req.params.key;
  const data = loadData();

  if (data[key] !== undefined) {
    delete data[key];
    saveData(data);
    res.json({ key, value: 0, message: 'Counter reset' });
  } else {
    res.json({ key, value: 0, message: 'No counter found' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
