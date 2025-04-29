import React, { useState, useEffect } from 'react';
import { Container, Button, Spinner, Alert, Form, Row, Col, Card } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../src/store';
import { fetchFlights, setSelectedFlight } from '../../src/store/slices/flightsSlice';
import { createBooking } from '../../src/store/slices/bookingsSlice';
import { Passenger } from '../../src/types';

const BookingProcess: React.FC = () => {
  const { flightId } = useParams<{ flightId: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { flights, selectedFlight, loading: flightLoading } = useSelector((s: RootState) => s.flights);
  const { user } = useSelector((s: RootState) => s.auth);
  const { loading: bookingLoading, error: bookingError, selectedBooking } = useSelector((s: RootState) => s.bookings);

  const [step, setStep] = useState(1);
  const [passengers, setPassengers] = useState<Passenger[]>([{ name: '', passport: '', seatNumber: '' }]);
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCVV, setCardCVV] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (!flights.length) dispatch(fetchFlights());
  }, [dispatch, flights.length]);

  useEffect(() => {
    if (flights.length && flightId) {
      const f = flights.find(f => f.id === flightId);
      if (f) dispatch(setSelectedFlight(f));
    }
    if (user?.email) setContactEmail(user.email);
    return () => { dispatch(setSelectedFlight(null)); };
  }, [dispatch, flights, flightId, user]);

  useEffect(() => {
    if (selectedBooking) {
      navigate(`/booking-confirmation/${selectedBooking.id}`);
    }
  }, [selectedBooking, navigate]);

  const nextStep = () => {
    setFormError(null);
    if (step === 1) {
      // validate passenger & contact
      if (passengers.some(p => !p.name || !p.passport || !p.seatNumber)) {
        return setFormError('Fill all passenger fields');
      }
      if (!contactEmail || !contactPhone) {
        return setFormError('Provide contact info');
      }
      setStep(2);
    } else {
      // validate payment & terms
      if (!cardNumber || !cardName || !cardExpiry || !cardCVV) {
        return setFormError('Fill all payment fields');
      }
      if (!termsAccepted) {
        return setFormError('Accept terms');
      }
      // dispatch booking
      if (user && selectedFlight) {
        dispatch(createBooking({
          flightId: selectedFlight.id,
          userId: user.id,
          passengers,
          totalPrice: selectedFlight.price * passengers.length
        }));
      }
    }
  };

  const prevStep = () => {
    setFormError(null);
    setStep(s => Math.max(1, s - 1));
  };

  const updatePassenger = (i: number, field: keyof Passenger, val: string) => {
    setPassengers(ps => {
      const copy = [...ps];
      copy[i] = { ...copy[i], [field]: val };
      return copy;
    });
  };

  const addPassenger = () => {
    if (passengers.length < 5) setPassengers(ps => [...ps, { name: '', passport: '', seatNumber: '' }]);
  };
  const removePassenger = (i: number) => {
    if (passengers.length > 1) setPassengers(ps => ps.filter((_, idx) => idx !== i));
  };

  if (flightLoading || !selectedFlight) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" /> Loading flight…
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <h2 className="mb-4">Booking: {selectedFlight.flightNumber}</h2>

      {formError && <Alert variant="danger">{formError}</Alert>}
      {bookingError && <Alert variant="danger">{bookingError}</Alert>}

      {step === 1 ? (
        <Card className="p-4 mb-4">
          <h4>Step 1: Passenger & Contact</h4>
          {passengers.map((p, i) => (
            <Row key={i} className="mb-3">
              <Col>
                <Form.Control
                  placeholder="Name"
                  value={p.name}
                  onChange={e => updatePassenger(i, 'name', e.target.value)}
                />
              </Col>
              <Col>
                <Form.Control
                  placeholder="Passport #"
                  value={p.passport}
                  onChange={e => updatePassenger(i, 'passport', e.target.value)}
                />
              </Col>
              <Col>
                <Form.Control
                  placeholder="Seat #"
                  value={p.seatNumber}
                  onChange={e => updatePassenger(i, 'seatNumber', e.target.value)}
                />
              </Col>
              {i > 0 && (
                <Col xs="auto">
                  <Button variant="outline-danger" onClick={() => removePassenger(i)}>
                    &times;
                  </Button>
                </Col>
              )}
            </Row>
          ))}
          {passengers.length < 5 && (
            <Button variant="link" onClick={addPassenger}>
              + Add Passenger
            </Button>
          )}

          <Form.Group className="mb-3">
            <Form.Label>Contact Email</Form.Label>
            <Form.Control
              type="email"
              value={contactEmail}
              onChange={e => setContactEmail(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Contact Phone</Form.Label>
            <Form.Control
              type="tel"
              value={contactPhone}
              onChange={e => setContactPhone(e.target.value)}
            />
          </Form.Group>
        </Card>
      ) : (
        <Card className="p-4 mb-4">
          <h4>Step 2: Payment</h4>
          <Form.Group className="mb-3">
            <Form.Label>Card Number</Form.Label>
            <Form.Control
              value={cardNumber}
              onChange={e => setCardNumber(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Name on Card</Form.Label>
            <Form.Control
              value={cardName}
              onChange={e => setCardName(e.target.value)}
            />
          </Form.Group>
          <Row>
            <Col>
              <Form.Group className="mb-3">
                <Form.Label>Expiry</Form.Label>
                <Form.Control
                  placeholder="MM/YY"
                  value={cardExpiry}
                  onChange={e => setCardExpiry(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group className="mb-3">
                <Form.Label>CVV</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="CVV"
                  value={cardCVV}
                  onChange={e => setCardCVV(e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>
          <Form.Check
            type="checkbox"
            label="I accept Terms & Conditions"
            checked={termsAccepted}
            onChange={e => setTermsAccepted(e.target.checked)}
          />
        </Card>
      )}

      <div className="d-flex justify-content-between">
        {step > 1 && (
          <Button variant="secondary" onClick={prevStep} disabled={bookingLoading}>
            Back
          </Button>
        )}
        <Button variant="primary" onClick={nextStep} disabled={bookingLoading}>
          {step === 1 ? 'Next' : bookingLoading ? <Spinner size="sm" /> : 'Confirm & Pay'}
        </Button>
      </div>
    </Container>
  );
};

export default BookingProcess;
