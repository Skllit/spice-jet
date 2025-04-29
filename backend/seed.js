// backend/seed.js
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Flight = require('./models/Flight');

// Helpers
const airlines = [
  'British Airways', 'Emirates', 'Lufthansa', 'Singapore Airlines',
  'Qatar Airways', 'Air France', 'American Airlines', 'United Airlines',
  'Delta Air Lines', 'Turkish Airlines'
];
const cities = [
  'New York', 'London', 'Paris', 'Tokyo', 'Sydney',
  'Dubai', 'Singapore', 'Hong Kong', 'Los Angeles', 'Frankfurt',
  'Toronto', 'Barcelona', 'Rome', 'Bangkok', 'Istanbul',
  'Amsterdam', 'San Francisco', 'Chicago', 'Seoul', 'Mumbai'
];
const aircraftTypes = [
  'Boeing 737', 'Boeing 747', 'Boeing 777', 'Boeing 787 Dreamliner',
  'Airbus A320', 'Airbus A330', 'Airbus A350', 'Airbus A380'
];

// Random utilities
const randomChoice = arr => arr[Math.floor(Math.random() * arr.length)];
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const pad = n => n.toString().padStart(4, '0');

(async function seed() {
  try {
    await connectDB();
    console.log('💥 Connected to Mongo—seeding flights...');

    // Remove existing
    await Flight.deleteMany({});
    console.log('🗑  Cleared old flights');

    const flights = [];
    for (let i = 0; i < 30; i++) {
      let origin, destination;
      // ensure origin != destination
      do {
        origin = randomChoice(cities);
        destination = randomChoice(cities);
      } while (origin === destination);

      // departure: random 1–60 days from now
      const dep = new Date();
      dep.setDate(dep.getDate() + randomInt(1, 60));
      dep.setHours(randomInt(0, 23), randomInt(0, 59), 0, 0);

      // duration 2–12 hours
      const durHours = randomInt(2, 12);
      const durMinutes = randomChoice([0, 15, 30, 45]);
      const arr = new Date(dep.getTime() + durHours * 3600000 + durMinutes * 60000);

      const durationStr = `${durHours}h ${durMinutes}m`;

      const seatsTotal = randomInt(100, 300);
      const seatsAvailable = randomInt(
        Math.floor(seatsTotal * 0.1),
        seatsTotal
      );

      const price = parseFloat((randomInt(50, 1000) + Math.random()).toFixed(2));

      const airline = randomChoice(airlines);
      // e.g. BA-0123
      const code = airline
        .split(' ')
        .map(w => w[0])
        .join('')
        .slice(0, 3)
        .toUpperCase();
      const flightNumber = `${code}-${pad(randomInt(1, 9999))}`;

      flights.push({
        flightNumber,
        airline,
        origin,
        destination,
        departureDate: dep.toISOString(),
        arrivalDate:   arr.toISOString(),
        duration:      durationStr,
        price,
        seatsAvailable,
        seatsTotal,
        aircraft: randomChoice(aircraftTypes),
      });
    }

    await Flight.insertMany(flights);
    console.log(`✅ Inserted ${flights.length} dummy flights.`);
  } catch (err) {
    console.error('❌ Seeding error:', err);
  } finally {
    mongoose.connection.close();
    console.log('🔌 Disconnected.');
    process.exit(0);
  }
})();
