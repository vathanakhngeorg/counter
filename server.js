// ===============================
// VISITOR COUNTER - FILE BASED
// ===============================
const express = require("express");
const fs = require("fs");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

// Path to your count file
const countFile = path.join(__dirname, "count.json");

// Ensure count.json exists
if (!fs.existsSync(countFile)) {
  fs.writeFileSync(countFile, JSON.stringify({ visits: 0 }, null, 2));
  console.log("✅ count.json created");
}

// ====== API ROUTE ======
app.get("/api/visits", (req, res) => {
  // Read the count from file
  const data = JSON.parse(fs.readFileSync(countFile, "utf8"));
  data.visits += 1;

  // Save the new count
  fs.writeFileSync(countFile, JSON.stringify(data, null, 2));

  res.json({ totalVisits: data.visits });
});

// ====== SERVE STATIC FRONTEND ======
app.use(express.static("public"));

// ====== START SERVER ======
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
