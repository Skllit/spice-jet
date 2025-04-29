import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Card, Alert, Spinner } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { fetchFlights, setSelectedFlight, updateFlight } from '../../store/slices/flightsSlice';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Plane, ArrowLeft, Save } from 'lucide-react';

const AdminEditFlight: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  const { flights, selectedFlight, loading, error: flightError } = useSelector((state: RootState) => state.flights);
  
  const [flightNumber, setFlightNumber] = useState('');
  const [airline, setAirline] = useState('');
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [departureDate, setDepartureDate] = useState<Date | null>(null);
  const [arrivalDate, setArrivalDate] = useState<Date | null>(null);
  const [price, setPrice] = useState('');
  const [seatsAvailable, setSeatsAvailable] = useState('');
  const [seatsTotal, setSeatsTotal] = useState('');
  const [aircraft, setAircraft] = useState('');
  const [validated, setValidated] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  // Common cities for dropdown
  const cities = [
    'New York', 'London', 'Paris', 'Tokyo', 'Sydney', 
    'Dubai', 'Singapore', 'Hong Kong', 'Los Angeles', 'Frankfurt',
    'Toronto', 'Barcelona', 'Rome', 'Bangkok', 'Istanbul'
  ];
  
  // Common airlines
  const airlines = [
    'British Airways', 'Emirates', 'Lufthansa', 'Singapore Airlines',
    'Qatar Airways', 'Air France', 'American Airlines', 'United Airlines',
    'Delta Air Lines', 'Turkish Airlines'
  ];
  
  // Common aircraft types
  const aircraftTypes = [
    'Boeing 737', 'Boeing 747', 'Boeing 777', 'Boeing 787 Dreamliner',
    'Airbus A320', 'Airbus A330', 'Airbus A350', 'Airbus A380'
  ];
  
  useEffect(() => {
    // If flights not loaded, fetch them
    if (flights.length === 0) {
      dispatch(fetchFlights());
    }
  }, [dispatch, flights.length]);
  
  useEffect(() => {
    // Find the flight with the matching ID
    if (flights.length > 0 && id) {
      const flight = flights.find(f => f.id === id);
      if (flight) {
        dispatch(setSelectedFlight(flight));
      }
    }
    
    // Cleanup
    return () => {
      dispatch(setSelectedFlight(null));
    };
  }, [dispatch, flights, id]);
  
  useEffect(() => {
    // If we have a selected flight, populate the form
    if (selectedFlight) {
      setFlightNumber(selectedFlight.flightNumber);
      setAirline(selectedFlight.airline);
      setOrigin(selectedFlight.origin);
      setDestination(selectedFlight.destination);
      setDepartureDate(new Date(selectedFlight.departureDate));
      setArrivalDate(new Date(selectedFlight.arrivalDate));
      setPrice(selectedFlight.price.toString());
      setSeatsAvailable(selectedFlight.seatsAvailable.toString());
      setSeatsTotal(selectedFlight.seatsTotal.toString());
      setAircraft(selectedFlight.aircraft);
    }
  }, [selectedFlight]);
  
  const calculateDuration = () => {
    if (!departureDate || !arrivalDate) return '';
    
    const departure = new Date(departureDate);
    const arrival = new Date(arrivalDate);
    
    const durationMs = arrival.getTime() - departure.getTime();
    
    // Calculate hours and minutes
    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
  };
  
  const handleDepartureChange = (date: Date | null) => {
    setDepartureDate(date);
    if (date && arrivalDate && date >= arrivalDate) {
      // If departure date is after arrival, set arrival date to departure + 1 hour
      const newArrival = new Date(date);
      newArrival.setHours(newArrival.getHours() + 1);
      setArrivalDate(newArrival);
    }
  };
  
  const handleArrivalChange = (date: Date | null) => {
    if (date && departureDate && date <= departureDate) {
      setError('Arrival time must be after departure time');
      return;
    }
    
    setError(null);
    setArrivalDate(date);
  };
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    
    setValidated(true);
    setError(null);
    
    if (form.checkValidity() === false) {
      e.stopPropagation();
      return;
    }
    
    if (!departureDate || !arrivalDate) {
      setError('Please select both departure and arrival dates');
      return;
    }
    
    if (arrivalDate <= departureDate) {
      setError('Arrival time must be after departure time');
      return;
    }
    
    if (origin === destination) {
      setError('Origin and destination cannot be the same');
      return;
    }
    
    const availableSeats = parseInt(seatsAvailable);
    const totalSeats = parseInt(seatsTotal);
    
    if (availableSeats > totalSeats) {
      setError('Available seats cannot exceed total seats');
      return;
    }
    
    try {
      if (selectedFlight) {
        // Update flight with all required fields
        const updatedFlight = {
          ...selectedFlight,
          flightNumber,
          airline,
          origin,
          destination,
          departureDate: departureDate.toISOString(),
          arrivalDate: arrivalDate.toISOString(),
          duration: calculateDuration(),
          price: parseFloat(price),
          seatsAvailable: availableSeats,
          seatsTotal: totalSeats,
          aircraft
        };
        
        dispatch(updateFlight(updatedFlight));
        setSuccess(true);
        
        // Navigate back to flights list after a brief delay
        setTimeout(() => {
          navigate('/admin/flights');
        }, 1500);
      }
    } catch (err) {
      setError('An error occurred while updating the flight. Please try again.');
    }
  };
  
  if (loading && !selectedFlight) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">Loading flight information...</p>
      </Container>
    );
  }
  
  if (!selectedFlight && !loading) {
    return (
      <Container className="py-5">
        <Alert variant="danger">
          Flight not found. <Button variant="link" onClick={() => navigate('/admin/flights')}>Go back to flights</Button>
        </Alert>
      </Container>
    );
  }
  
  return (
    <Container className="py-5">
      <Button 
        variant="link" 
        className="text-decoration-none mb-4 ps-0" 
        onClick={() => navigate('/admin/flights')}
      >
        <ArrowLeft size={18} className="me-1" /> Back to Flights
      </Button>
      
      <Card className="border-0 shadow-sm">
        <Card.Body className="p-4">
          <div className="text-center mb-4">
            <div className="bg-primary-subtle p-3 rounded-circle d-inline-flex align-items-center justify-content-center mb-3">
              <Plane size={28} className="text-primary" />
            </div>
            <h2 className="fw-bold">Edit Flight</h2>
          </div>
          
          {error && (
            <Alert variant="danger" onClose={() => setError(null)} dismissible>
              {error}
            </Alert>
          )}
          
          {flightError && (
            <Alert variant="danger" dismissible>
              {flightError}
            </Alert>
          )}
          
          {success && (
            <Alert variant="success" onClose={() => setSuccess(false)} dismissible>
              Flight updated successfully! Redirecting to flight list...
            </Alert>
          )}
          
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Row className="mb-4">
              <Col md={6} className="mb-3 mb-md-0">
                <Form.Group controlId="flightNumber">
                  <Form.Label>Flight Number</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="e.g., BA-2490"
                    value={flightNumber}
                    onChange={(e) => setFlightNumber(e.target.value)}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Please provide a flight number.
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="airline">
                  <Form.Label>Airline</Form.Label>
                  <Form.Select
                    value={airline}
                    onChange={(e) => setAirline(e.target.value)}
                    required
                  >
                    <option value="">Select airline</option>
                    {airlines.map((a) => (
                      <option key={a} value={a}>
                        {a}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    Please select an airline.
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            
            <Row className="mb-4">
              <Col md={6} className="mb-3 mb-md-0">
                <Form.Group controlId="origin">
                  <Form.Label>Origin</Form.Label>
                  <Form.Select 
                    value={origin} 
                    onChange={(e) => setOrigin(e.target.value)}
                    required
                  >
                    <option value="">Select origin</option>
                    {cities.map((city) => (
                      <option key={`origin-${city}`} value={city}>
                        {city}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    Please select an origin.
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="destination">
                  <Form.Label>Destination</Form.Label>
                  <Form.Select 
                    value={destination} 
                    onChange={(e) => setDestination(e.target.value)}
                    required
                  >
                    <option value="">Select destination</option>
                    {cities
                      .filter((city) => city !== origin)
                      .map((city) => (
                        <option key={`dest-${city}`} value={city}>
                          {city}
                        </option>
                      ))
                    }
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    Please select a destination.
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            
            <Row className="mb-4">
              <Col md={6} className="mb-3 mb-md-0">
                <Form.Group controlId="departureDate">
                  <Form.Label>Departure Date & Time</Form.Label>
                  <DatePicker
                    selected={departureDate}
                    onChange={handleDepartureChange}
                    showTimeSelect
                    dateFormat="MMMM d, yyyy h:mm aa"
                    className="form-control"
                    placeholderText="Select departure date and time"
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Please select a departure date and time.
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="arrivalDate">
                  <Form.Label>Arrival Date & Time</Form.Label>
                  <DatePicker
                    selected={arrivalDate}
                    onChange={handleArrivalChange}
                    showTimeSelect
                    dateFormat="MMMM d, yyyy h:mm aa"
                    className="form-control"
                    placeholderText="Select arrival date and time"
                    minDate={departureDate || new Date()}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Please select an arrival date and time.
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            
            <Row className="mb-4">
              <Col md={3} className="mb-3 mb-md-0">
                <Form.Group controlId="price">
                  <Form.Label>Price ($)</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Enter price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    min="0"
                    step="0.01"
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Please provide a valid price.
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={3} className="mb-3 mb-md-0">
                <Form.Group controlId="seatsAvailable">
                  <Form.Label>Available Seats</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Available seats"
                    value={seatsAvailable}
                    onChange={(e) => setSeatsAvailable(e.target.value)}
                    min="0"
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Please provide available seats.
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={3} className="mb-3 mb-md-0">
                <Form.Group controlId="seatsTotal">
                  <Form.Label>Total Seats</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Total seats"
                    value={seatsTotal}
                    onChange={(e) => setSeatsTotal(e.target.value)}
                    min="1"
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Please provide total seats.
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group controlId="aircraft">
                  <Form.Label>Aircraft</Form.Label>
                  <Form.Select
                    value={aircraft}
                    onChange={(e) => setAircraft(e.target.value)}
                    required
                  >
                    <option value="">Select aircraft</option>
                    {aircraftTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    Please select an aircraft type.
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            
            <Row className="mb-3">
              <Col md={6} className="mb-3 mb-md-0">
                <Form.Group controlId="duration">
                  <Form.Label>Flight Duration</Form.Label>
                  <Form.Control
                    type="text"
                    value={calculateDuration()}
                    readOnly
                    disabled
                  />
                  <Form.Text className="text-muted">
                    Duration is calculated automatically
                  </Form.Text>
                </Form.Group>
              </Col>
            </Row>
            
            <div className="d-flex justify-content-end mt-4">
              <Button variant="outline-secondary" className="me-2" onClick={() => navigate('/admin/flights')}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                <Save size={18} className="me-2" />
                Update Flight
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AdminEditFlight;