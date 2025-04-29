// backend/models/Flight.js
const mongoose = require('mongoose');

const FlightSchema = new mongoose.Schema({
  flightNumber:   String,
  airline:        String,
  origin:         String,
  destination:    String,
  departureDate:  Date,
  arrivalDate:    Date,
  duration:       String,
  price:          Number,
  seatsAvailable: Number,
  seatsTotal:     Number,
  aircraft:       String,
}, { timestamps: true });

module.exports = mongoose.model('Flight', FlightSchema);
