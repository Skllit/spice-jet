// backend/routes/flights.js
const r = require('express').Router();
const c = require('../controllers/flights');
const { protect } = require('../middleware/auth');
const { admin }   = require('../middleware/admin');

r.get('/',         c.getAll);
r.get('/:id',      c.getOne);
r.post('/',        protect, admin, c.create);
r.put('/:id',      protect, admin, c.update);
r.delete('/:id',   protect, admin, c.remove);

module.exports = r;
