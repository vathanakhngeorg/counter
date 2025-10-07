const express = require('express');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 10000;
const DATA_FILE = './count.json';

app.use(cors());
app.use(express.json());

// Load data from JSON file
function loadData() {
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch {
    return {};
  }
}

// Save data to JSON file
function saveData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// Default route for '/'
app.get('/', (req, res) => {
  res.send('👋 Welcome to the Counter API! Use /api/count/:key');
});

// Count API
app.get('/api/count/:key', (req, res) => {
  const key = req.params.key;
  const data = loadData();

  data[key] = (data[key] || 0) + 1;
  saveData(data);

  res.json({ key, value: data[key] });
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
