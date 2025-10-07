const express = require('express');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 10000;
const DATA_FILE = './count.json';

app.use(cors());

function loadData() {
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch {
    return {};
  }
}

function saveData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// Add this root route handler
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>Count API Server</title>
        <style>
            body { 
                font-family: Arial, sans-serif; 
                margin: 40px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
            }
            .container {
                max-width: 800px;
                margin: 0 auto;
                background: rgba(255,255,255,0.1);
                padding: 30px;
                border-radius: 10px;
                backdrop-filter: blur(10px);
            }
            .endpoint { 
                background: rgba(255,255,255,0.2); 
                padding: 20px; 
                margin: 20px 0; 
                border-radius: 5px;
            }
            code { 
                background: rgba(0,0,0,0.3); 
                padding: 10px 15px; 
                border-radius: 3px;
                display: inline-block;
                margin: 5px 0;
            }
            a {
                color: #ffeb3b;
                text-decoration: none;
            }
            a:hover {
                text-decoration: underline;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🚀 Count API Server</h1>
            <p>Server is running successfully on port ${PORT}!</p>
            
            <div class="endpoint">
                <h3>📊 Available Endpoint:</h3>
                <p><code>GET /api/count/:key</code></p>
                <p>Increments and returns the count for the specified key.</p>
                <p><strong>Example:</strong> 
                   <a href="/api/count/homepage" target="_blank">/api/count/homepage</a>
                </p>
                <p><strong>Try these:</strong></p>
                <ul>
                    <li><a href="/api/count/visits">/api/count/visits</a></li>
                    <li><a href="/api/count/users">/api/count/users</a></li>
                    <li><a href="/api/count/clicks">/api/count/clicks</a></li>
                </ul>
            </div>

            <div class="endpoint">
                <h3>🔧 How to use:</h3>
                <p>Make a GET request to any key:</p>
                <code>https://your-domain.com/api/count/any-key-name</code>
                <p>Each call will increment the counter for that specific key.</p>
            </div>
        </div>
    </body>
    </html>
  `);
});

app.get('/api/count/:key', (req, res) => {
  const key = req.params.key;
  const data = loadData();

  data[key] = (data[key] || 0) + 1;
  saveData(data);

  res.json({ 
    key, 
    value: data[key],
    message: `Counter for '${key}' incremented to ${data[key]}`
  });
});

// Optional: Add a route to get all counts
app.get('/api/counts', (req, res) => {
  const data = loadData();
  res.json(data);
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`📍 Visit http://localhost:${PORT} to view the dashboard`);
});
