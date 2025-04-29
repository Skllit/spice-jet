// backend/controllers/bookings.js
const Booking = require('../models/Booking');
const Flight  = require('../models/Flight');

exports.getUser = async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id }).populate('flight');
  res.json(bookings);
};

exports.getAll = async (_, res) => {
  const bookings = await Booking.find().populate('flight user');
  res.json(bookings);
};

exports.getOne = async (req, res) => {
    try {
      const booking = await Booking.findById(req.params.id);
      if (!booking) return res.status(404).json({ message: 'Booking not found.' });
      res.json(booking);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error.' });
    }
  };
exports.create = async (req, res) => {
  const { flight: flightId, passengers, totalPrice } = req.body;
  const booking = await Booking.create({
    flight: flightId, user: req.user._id, passengers, totalPrice
  });
  // decrement seats
  await Flight.findByIdAndUpdate(flightId, {
    $inc: { seatsAvailable: -passengers.length }
  });
  res.status(201).json(booking);
};

exports.cancel = async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) return res.status(404).json({ message:'Not found' });
  booking.status = 'cancelled';
  await booking.save();
  // restore seats
  await Flight.findByIdAndUpdate(booking.flight, {
    $inc: { seatsAvailable: booking.passengers.length }
  });
  res.json(booking);
};
