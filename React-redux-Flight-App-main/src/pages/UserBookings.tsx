import React, { useEffect, useState } from 'react';
import { Container, Spinner, Alert, Card, Button, Modal } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../src/store';
import { fetchFlights } from '../../src/store/slices/flightsSlice';
import { fetchBookings, cancelBooking } from '../../src/store/slices/bookingsSlice';
//import { Booking, Flight } from '../../src/types';
import { useNavigate } from 'react-router-dom';

const UserBookings: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { bookings, loading: bLoading, error: bError } = useSelector((s: RootState) => s.bookings);
  const { flights, loading: fLoading } = useSelector((s: RootState) => s.flights);
  const { user } = useSelector((s: RootState) => s.auth);

  const [showModal, setShowModal] = useState(false);
  const [toCancel, setToCancel] = useState<string | null>(null);

  useEffect(() => {
    if (!flights.length) dispatch(fetchFlights());
    if (user) dispatch(fetchBookings());
  }, [dispatch, user, flights.length]);

  const flightFor = (id: string) => flights.find(f => f.id === id);

  const confirmCancel = () => {
    if (toCancel) {
      dispatch(cancelBooking(toCancel));
      setShowModal(false);
    }
  };

  if (bLoading || fLoading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" /> Loading…
      </Container>
    );
  }

  if (bError) return <Alert variant="danger">{bError}</Alert>;

  return (
    <Container className="py-5">
      <h2 className="mb-4">My Bookings</h2>
      {bookings.length === 0 && <p>You have no bookings yet.</p>}

      {bookings.map(booking => {
        const flight = flightFor(booking.flightId);
        return (
          <Card key={booking.id} className="mb-3">
            <Card.Body>
              <h5>Booking #{booking.id}</h5>
              {flight && (
                <p>
                  {flight.origin} → {flight.destination} on {new Date(flight.departureDate).toLocaleDateString()}
                </p>
              )}
              <p>Status: {booking.status}</p>
              <Button variant="link" onClick={() => navigate(`/booking-confirmation/${booking.id}`)}>
                View
              </Button>
              {booking.status === 'confirmed' && (
                <Button
                  variant="danger"
                  onClick={() => {
                    setToCancel(booking.id);
                    setShowModal(true);
                  }}
                >
                  Cancel
                </Button>
              )}
            </Card.Body>
          </Card>
        );
      })}

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Cancellation</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to cancel this booking?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            No
          </Button>
          <Button variant="danger" onClick={confirmCancel}>
            Yes, Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default UserBookings;
