require('dotenv').config();
const express = require('express');
const serverless = require("serverless-http");
const mongoose = require('mongoose');
const cors = require('cors');
const journalRouter = require('./routes/journal');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Replace with a default MongoDB local URI if not provided
const MONGO_URI =
  process.env.MONGODB_URI 
  mongoose
    .connect(MONGO_URI)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("MongoDB connection error:", err));

app.use('/api/journal', journalRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
module.exports.handler = serverless(app);
