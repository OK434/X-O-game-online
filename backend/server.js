const express = require('express');
const cors = require('cors');
const http = require('http');
const app = express();
const server = http.createServer(app);
require('./config/db');
require("./game")(server);

app.use(cors({
  origin: ['http://localhost:5173',],
  credentials: true
}));
app.use(express.json());
app.use('/api', require('./routes/auth'));
app.use('/api', require('./routes/Scoreboard'));
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Server error" });
});

server.listen(1231, () => {
  console.log("Server running on port 1231");
});