import React, { useEffect } from 'react';
import { Container, Spinner, Alert, Card, Button, ButtonGroup } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { jsPDF } from 'jspdf';
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

  if (bookingError) return (
    <Container className="py-5">
      <Alert variant="danger">{bookingError}</Alert>
    </Container>
  );
  if (flightsError) return (
    <Container className="py-5">
      <Alert variant="danger">{flightsError}</Alert>
    </Container>
  );

  if (!selectedBooking) return (
    <Container className="py-5">
      <Alert variant="warning">Booking not found.</Alert>
    </Container>
  );

  const flight = flights.find(f => f.id === selectedBooking.flightId);
  if (!flight) return (
    <Container className="py-5">
      <Alert variant="warning">Flight info unavailable.</Alert>
    </Container>
  );

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

  // 1) Download PDF via jsPDF
  const downloadReport = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Booking Confirmation', 20, 20);
    doc.setFontSize(12);
    doc.text(`Booking ID: ${selectedBooking.id}`, 20, 30);
    doc.text(`Flight: ${flight.origin} → ${flight.destination}`, 20, 40);
    doc.text(`Date: ${formatDate(flight.departureDate)}`, 20, 50);
    doc.text(`Time: ${formatTime(flight.departureDate)}`, 20, 60);
    doc.text('Passengers:', 20, 70);
    selectedBooking.passengers.forEach((p, i) => {
      doc.text(`${i + 1}. ${p.name} (Seat ${p.seatNumber})`, 25, 80 + i * 10);
    });
    doc.save(`Booking_${selectedBooking.id}.pdf`);
  };

  // 2) Share via Web Share API or fallback
  const shareBooking = () => {
    const shareData = {
      title: 'My Flight Booking',
      text: `Booking ${selectedBooking.id} on ${flight.origin}→${flight.destination}`,
      url: window.location.href
    };
    if (navigator.share) {
      navigator.share(shareData).catch(console.error);
    } else {
      navigator.clipboard.writeText(`${shareData.title}\n${shareData.text}\n${shareData.url}`);
      alert('Booking details copied to clipboard!');
    }
  };

  // 3) Print
  const printPage = () => window.print();

  return (
    <Container className="py-5">
      <Card className="p-4 mb-4">
        <h2 className="mb-3">Booking Confirmed!</h2>
        <p>Your booking ID is <strong>{selectedBooking.id}</strong></p>
        <hr />
        <h4>Flight Details</h4>
        <p>
          {flight.origin} → {flight.destination}<br/>
          {formatDate(flight.departureDate)} at {formatTime(flight.departureDate)}
        </p>
        <h5>Passengers:</h5>
        <ul>
          {selectedBooking.passengers.map((p, i) => (
            <li key={i}>{p.name} (Seat {p.seatNumber})</li>
          ))}
        </ul>
      </Card>

      {/* Buttons: Download, Share, Print */}
      <ButtonGroup className="mb-4">
        <Button variant="outline-primary" onClick={downloadReport}>
          Download Report
        </Button>
        <Button variant="outline-success" onClick={shareBooking}>
          Share
        </Button>
        <Button variant="outline-secondary" onClick={printPage}>
          Print
        </Button>
      </ButtonGroup>

      <div>
        <Button variant="primary" onClick={() => navigate('/my-bookings')}>
          View My Bookings
        </Button>
      </div>
    </Container>
  );
};

export default BookingConfirmation;
