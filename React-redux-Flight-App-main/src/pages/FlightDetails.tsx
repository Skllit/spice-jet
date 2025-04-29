import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Badge, ListGroup, Spinner } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { fetchFlights, setSelectedFlight } from '../store/slices/flightsSlice';
import { Plane, Clock, Calendar, MapPin, Users, Info, ArrowLeft } from 'lucide-react';

const FlightDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  
  const { flights, selectedFlight, loading } = useSelector((state: RootState) => state.flights);
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  
  useEffect(() => {
    // If we don't have flights loaded or the selected flight doesn't match the ID
    if (flights.length === 0 || (selectedFlight?.id !== id)) {
      dispatch(fetchFlights());
    }
  }, [dispatch, flights.length, selectedFlight, id]);
  
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
  
  const handleBookNow = () => {
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      navigate(`/booking/${id}`);
    }
  };
  
  const handleBack = () => {
    navigate('/search');
  };
  
  // Format dates for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };
  
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  
  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">Loading flight details...</p>
      </Container>
    );
  }
  
  if (!selectedFlight) {
    return (
      <Container className="py-5 text-center">
        <div className="alert alert-warning">
          Flight not found. <Button variant="link" onClick={handleBack}>Go back to search</Button>
        </div>
      </Container>
    );
  }
  
  const availabilityStatus = () => {
    const percentage = (selectedFlight.seatsAvailable / selectedFlight.seatsTotal) * 100;
    
    if (percentage < 10) {
      return { text: 'Almost Full', variant: 'danger' };
    } else if (percentage < 30) {
      return { text: 'Filling Fast', variant: 'warning' };
    } else {
      return { text: 'Available', variant: 'success' };
    }
  };
  
  const { text, variant } = availabilityStatus();
  
  return (
    <Container className="py-5">
      <Button 
        variant="link" 
        className="text-decoration-none mb-4 ps-0" 
        onClick={handleBack}
      >
        <ArrowLeft size={18} className="me-1" /> Back to Search Results
      </Button>
      
      <Row>
        <Col lg={8}>
          <Card className="border-0 shadow-sm mb-4">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-start mb-4">
                <div>
                  <div className="d-flex align-items-center mb-2">
                    <h3 className="fw-bold mb-0">{selectedFlight.airline}</h3>
                    <Badge bg={variant} className="ms-3">{text}</Badge>
                  </div>
                  <p className="text-muted mb-0">Flight {selectedFlight.flightNumber} · {selectedFlight.aircraft}</p>
                </div>
                <div className="text-end">
                  <h3 className="text-primary fw-bold mb-0">${selectedFlight.price}</h3>
                  <p className="text-muted small">per passenger</p>
                </div>
              </div>
              
              <hr className="my-4" />
              
              <div className="d-flex align-items-center my-4">
                <div className="text-center">
                  <div className="fw-bold fs-4">{formatTime(selectedFlight.departureDate)}</div>
                  <div className="text-muted">{selectedFlight.origin}</div>
                  <div className="small text-muted mt-1">
                    {formatDate(selectedFlight.departureDate)}
                  </div>
                </div>
                
                <div className="flex-grow-1 mx-4 px-4 position-relative">
                  <div className="d-flex align-items-center justify-content-center">
                    <div className="border-top border-2 w-100"></div>
                    <div className="bg-white px-2 position-absolute">
                      <Plane className="text-primary" size={24} />
                    </div>
                  </div>
                  <div className="text-center mt-2">
                    <span className="badge bg-light text-dark border">
                      <Clock size={14} className="me-1" />
                      {selectedFlight.duration}
                    </span>
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="fw-bold fs-4">{formatTime(selectedFlight.arrivalDate)}</div>
                  <div className="text-muted">{selectedFlight.destination}</div>
                  <div className="small text-muted mt-1">
                    {formatDate(selectedFlight.arrivalDate)}
                  </div>
                </div>
              </div>
              
              <hr className="my-4" />
              
              <Row className="text-center g-0">
                <Col md={4} className="p-3 border-end">
                  <div className="d-flex flex-column align-items-center">
                    <Calendar size={20} className="text-primary mb-2" />
                    <h6 className="fw-bold mb-1">Date</h6>
                    <p className="mb-0 text-muted">
                      {formatDate(selectedFlight.departureDate)}
                    </p>
                  </div>
                </Col>
                <Col md={4} className="p-3 border-end">
                  <div className="d-flex flex-column align-items-center">
                    <Clock size={20} className="text-primary mb-2" />
                    <h6 className="fw-bold mb-1">Duration</h6>
                    <p className="mb-0 text-muted">{selectedFlight.duration}</p>
                  </div>
                </Col>
                <Col md={4} className="p-3">
                  <div className="d-flex flex-column align-items-center">
                    <Users size={20} className="text-primary mb-2" />
                    <h6 className="fw-bold mb-1">Availability</h6>
                    <p className="mb-0 text-muted">
                      {selectedFlight.seatsAvailable} seats
                    </p>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
          
          <Card className="border-0 shadow-sm mb-4">
            <Card.Header className="bg-white py-3 border-0">
              <h5 className="mb-0">
                <MapPin size={18} className="me-2" />
                Flight Route
              </h5>
            </Card.Header>
            <Card.Body>
              <div className="d-flex align-items-start">
                <div style={{ minWidth: '80px' }} className="text-center">
                  <div className="fw-bold">{formatTime(selectedFlight.departureDate)}</div>
                  <div className="small text-muted">Departure</div>
                </div>
                <div className="ms-3">
                  <h6 className="fw-bold mb-1">{selectedFlight.origin} Airport (ORG)</h6>
                  <p className="text-muted mb-0">
                    Terminal 2, Gate B23 (For demonstration purposes)
                  </p>
                </div>
              </div>
              
              <div className="d-flex align-items-center my-3">
                <div style={{ minWidth: '80px' }} className="text-center">
                  <Plane size={18} className="text-primary" />
                </div>
                <div className="ms-3 border-start ps-3 py-2 text-muted">
                  {selectedFlight.duration} flight time
                </div>
              </div>
              
              <div className="d-flex align-items-start">
                <div style={{ minWidth: '80px' }} className="text-center">
                  <div className="fw-bold">{formatTime(selectedFlight.arrivalDate)}</div>
                  <div className="small text-muted">Arrival</div>
                </div>
                <div className="ms-3">
                  <h6 className="fw-bold mb-1">{selectedFlight.destination} Airport (DST)</h6>
                  <p className="text-muted mb-0">
                    Terminal 1, Gate A12 (For demonstration purposes)
                  </p>
                </div>
              </div>
            </Card.Body>
          </Card>
          
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-white py-3 border-0">
              <h5 className="mb-0">
                <Info size={18} className="me-2" />
                Flight Information
              </h5>
            </Card.Header>
            <ListGroup variant="flush">
              <ListGroup.Item className="py-3">
                <Row>
                  <Col md={4} className="fw-bold">Aircraft</Col>
                  <Col md={8}>{selectedFlight.aircraft}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item className="py-3">
                <Row>
                  <Col md={4} className="fw-bold">Flight Class</Col>
                  <Col md={8}>Economy (For demonstration purposes)</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item className="py-3">
                <Row>
                  <Col md={4} className="fw-bold">Baggage Allowance</Col>
                  <Col md={8}>1 x 23kg Checked baggage + 7kg Cabin baggage (For demonstration)</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item className="py-3">
                <Row>
                  <Col md={4} className="fw-bold">In-flight Services</Col>
                  <Col md={8}>Complimentary meals and entertainment (For demonstration)</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item className="py-3">
                <Row>
                  <Col md={4} className="fw-bold">Refund Policy</Col>
                  <Col md={8}>Refundable with fees (For demonstration purposes)</Col>
                </Row>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
        
        <Col lg={4}>
          <div className="sticky-top" style={{ top: '20px' }}>
            <Card className="border-0 shadow-sm mb-4">
              <Card.Header className="bg-white py-3 border-0">
                <h5 className="mb-0">Price Summary</h5>
              </Card.Header>
              <Card.Body>
                <div className="d-flex justify-content-between mb-2">
                  <span>Base fare</span>
                  <span>${selectedFlight.price - 50}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Taxes and fees</span>
                  <span>$50</span>
                </div>
                <hr />
                <div className="d-flex justify-content-between mb-3">
                  <span className="fw-bold">Total per passenger</span>
                  <span className="fw-bold">${selectedFlight.price}</span>
                </div>
                <Button 
                  variant="primary" 
                  className="w-100 py-2"
                  onClick={handleBookNow}
                  disabled={selectedFlight.seatsAvailable === 0}
                >
                  {selectedFlight.seatsAvailable === 0 ? 'Sold Out' : 'Book Now'}
                </Button>
                {!isAuthenticated && (
                  <div className="text-center mt-2 small text-muted">
                    You'll need to log in to complete your booking
                  </div>
                )}
              </Card.Body>
            </Card>
            
            <Card className="border-0 shadow-sm">
              <Card.Body>
                <h6 className="fw-bold mb-3">Need Help?</h6>
                <p className="text-muted small mb-0">
                  If you have questions about this flight or need assistance with booking, please contact our support team at <a href="mailto:support@skyjet.com">support@skyjet.com</a> or call us at <a href="tel:+15551234567">+1 (555) 123-4567</a>.
                </p>
              </Card.Body>
            </Card>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default FlightDetails;