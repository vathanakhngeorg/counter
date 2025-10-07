const express = require("express");
const fs = require("fs");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

const countFile = path.join(__dirname, "count.json");

// Ensure file exists
if (!fs.existsSync(countFile)) {
  fs.writeFileSync(countFile, JSON.stringify({ homepage: 0 }, null, 2));
  console.log("✅ count.json created");
}

// API route for counting
app.get("/api/visits", (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(countFile, "utf8"));
    data.visits += 1;
    fs.writeFileSync(countFile, JSON.stringify(data, null, 2));
    res.json({ totalVisits: data.visits });
  } catch (error) {
    console.error("Error updating count:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Serve frontend
app.use(express.static(path.join(__dirname, "public")));

// Render root route (homepage)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Start server
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
