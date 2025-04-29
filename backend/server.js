// backend/server.js
require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const connectDB = require('./config/db');

connectDB();
const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth',     require('./routes/auth'));
app.use('/api/flights',  require('./routes/flights'));
app.use('/api/bookings', require('./routes/bookings'));

app.use((err, _, res, next) => {
  console.error(err);
  res.status(500).json({ message:'Server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server on port ${PORT}`));
