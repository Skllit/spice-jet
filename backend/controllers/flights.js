// backend/controllers/flights.js
const Flight = require('../models/Flight');

exports.getAll = async (req, res) => {
  const flights = await Flight.find();
  res.json(flights);
};

exports.getOne = async (req, res) => {
  const flight = await Flight.findById(req.params.id);
  if (!flight) return res.status(404).json({ message:'Not found' });
  res.json(flight);
};

exports.create = async (req, res) => {
  const flight = await Flight.create(req.body);
  res.status(201).json(flight);
};

exports.update = async (req, res) => {
  const flight = await Flight.findByIdAndUpdate(req.params.id, req.body, { new:true });
  if (!flight) return res.status(404).json({ message:'Not found' });
  res.json(flight);
};

exports.remove = async (req, res) => {
  await Flight.findByIdAndDelete(req.params.id);
  res.json({ id:req.params.id });
};
