// src/pages/BookingConfirmation.tsx
import React, { useEffect } from 'react';
import { Container, Spinner, Alert, Card, Button } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { fetchFlights } from '../store/slices/flightsSlice';
import {
  fetchBookingById,
  setSelectedBooking
} from '../store/slices/bookingsSlice';

const BookingConfirmation: React.FC = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const {
    selectedBooking,
    loading: bookingLoading,
    error: bookingError
  } = useSelector((s: RootState) => s.bookings);

  const {
    flights,
    loading: flightsLoading,
    error: flightsError
  } = useSelector((s: RootState) => s.flights);

  useEffect(() => {
    if (bookingId) {
      dispatch(fetchBookingById(bookingId));
      dispatch(fetchFlights());
    }
    return () => {
      dispatch(setSelectedBooking(null));
    };
  }, [dispatch, bookingId]);

  if (bookingLoading || flightsLoading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" /> Loading…
      </Container>
    );
  }

  if (bookingError) {
    return (
      <Container className="py-5">
        <Alert variant="danger">{bookingError}</Alert>
      </Container>
    );
  }
  if (flightsError) {
    return (
      <Container className="py-5">
        <Alert variant="danger">{flightsError}</Alert>
      </Container>
    );
  }

  if (!selectedBooking) {
    return (
      <Container className="py-5">
        <Alert variant="warning">Booking not found.</Alert>
      </Container>
    );
  }

  const flight = flights.find(f => f.id === selectedBooking.flightId);
  if (!flight) {
    return (
      <Container className="py-5">
        <Alert variant="warning">Flight info unavailable.</Alert>
      </Container>
    );
  }

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  const formatTime = (d: string) =>
    new Date(d).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });

  return (
    <Container className="py-5">
      <Card className="p-4">
        <h2 className="mb-3">Booking Confirmed!</h2>
        <p>
          Your booking ID is <strong>{selectedBooking.id}</strong>
        </p>
        <hr />
        <h4>Flight Details</h4>
        <p>
          {flight.origin} → {flight.destination} on{' '}
          {formatDate(flight.departureDate)} at {formatTime(flight.departureDate)}
        </p>
        <h5>Passengers:</h5>
        <ul>
          {selectedBooking.passengers.map((p, i) => (
            <li key={i}>
              {p.name} (Seat {p.seatNumber})
            </li>
          ))}
        </ul>
        <Button variant="primary" onClick={() => navigate('/my-bookings')}>
          View My Bookings
        </Button>
      </Card>
    </Container>
  );
};

export default BookingConfirmation;
