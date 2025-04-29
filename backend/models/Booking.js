// backend/models/Booking.js
const mongoose = require('mongoose');

const PassengerSchema = new mongoose.Schema({
  name:       String,
  passport:   String,
  seatNumber: String,
});

const BookingSchema = new mongoose.Schema({
  flight:   { type: mongoose.Schema.Types.ObjectId, ref:'Flight' },
  user:     { type: mongoose.Schema.Types.ObjectId, ref:'User' },
  passengers:[PassengerSchema],
  bookingDate: { type: Date, default: Date.now },
  status:      { type: String, enum:['pending','confirmed','cancelled'], default:'confirmed' },
  totalPrice:  Number,
}, { timestamps: true });

module.exports = mongoose.model('Booking', BookingSchema);
