import React from 'react';
import { Card, Badge, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Plane, Clock, Calendar } from 'lucide-react';
import { Flight } from '../types';

interface FlightCardProps {
  flight: Flight;
  showBookButton?: boolean;
}

const FlightCard: React.FC<FlightCardProps> = ({ flight, showBookButton = true }) => {
  const navigate = useNavigate();
  
  const departureTime = new Date(flight.departureDate).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
  
  const arrivalTime = new Date(flight.arrivalDate).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
  
  const departureDate = new Date(flight.departureDate).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  const handleViewDetails = () => {
    navigate(`/flights/${flight.id}`);
  };

  const handleBookNow = () => {
    navigate(`/booking/${flight.id}`);
  };

  const availabilityStatus = () => {
    const percentage = (flight.seatsAvailable / flight.seatsTotal) * 100;
    
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
    <Card className="mb-4 flight-card border-0 shadow-sm">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div>
            <h5 className="mb-1">{flight.airline}</h5>
            <div className="text-muted small">Flight {flight.flightNumber}</div>
          </div>
          <Badge bg={variant}>{text}</Badge>
        </div>

        <div className="d-flex align-items-center my-3">
          <div className="text-center">
            <div className="fw-bold fs-5">{departureTime}</div>
            <div className="text-muted small">{flight.origin}</div>
          </div>
          
          <div className="flex-grow-1 mx-3 position-relative">
            <div className="d-flex align-items-center justify-content-center">
              <div className="border-top border-2 w-100"></div>
              <Plane className="mx-2 text-primary" size={20} />
              <div className="border-top border-2 w-100"></div>
            </div>
            <div className="text-center small text-muted mt-1">{flight.duration}</div>
          </div>
          
          <div className="text-center">
            <div className="fw-bold fs-5">{arrivalTime}</div>
            <div className="text-muted small">{flight.destination}</div>
          </div>
        </div>

        <div className="d-flex justify-content-between align-items-center mt-3">
          <div>
            <div className="d-flex align-items-center text-muted small mb-2">
              <Calendar size={16} className="me-1" />
              <span>{departureDate}</span>
            </div>
            <div className="d-flex align-items-center text-muted small">
              <Clock size={16} className="me-1" />
              <span>{flight.duration}</span>
            </div>
          </div>
          
          <div className="text-end">
            <div className="fw-bold fs-4 text-primary">${flight.price}</div>
            <div className="mt-2 d-flex">
              <Button 
                variant="outline-primary" 
                size="sm" 
                className="me-2"
                onClick={handleViewDetails}
              >
                Details
              </Button>
              
              {showBookButton && (
                <Button 
                  variant="primary" 
                  size="sm"
                  onClick={handleBookNow}
                  disabled={flight.seatsAvailable === 0}
                >
                  Book Now
                </Button>
              )}
            </div>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default FlightCard;