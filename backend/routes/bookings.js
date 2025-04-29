// backend/routes/bookings.js
const r = require('express').Router();
const c = require('../controllers/bookings');
const { protect } = require('../middleware/auth');
const { admin }   = require('../middleware/admin');

r.get('/',       protect, admin, c.getAll);      // Admin fetch all bookings
r.get('/mine',   protect,       c.getUser);      // User fetch their own bookings
r.get('/:id',    protect,       c.getOne);       // Fetch a single booking by ID (new)
r.post('/',      protect,       c.create);       // Create a booking
r.put('/:id/cancel', protect,   c.cancel);       // Cancel a booking

module.exports = r;
