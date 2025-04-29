import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Row, Col, Button } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { SearchFilters } from '../types';

interface SearchFormProps {
  onSearch?: (filters: SearchFilters) => void;
  compact?: boolean;
}

const SearchForm: React.FC<SearchFormProps> = ({ onSearch, compact = false }) => {
  const navigate = useNavigate();
  const [origin, setOrigin] = useState<string>('');
  const [destination, setDestination] = useState<string>('');
  const [departureDate, setDepartureDate] = useState<Date | null>(null);
  const [returnDate, setReturnDate] = useState<Date | null>(null);
  const [passengers, setPassengers] = useState<number>(1);
  const [tripType, setTripType] = useState<'oneway' | 'roundtrip'>('oneway');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const filters: SearchFilters = {
      origin,
      destination,
      departureDate: departureDate ? departureDate.toISOString() : undefined,
      returnDate: tripType === 'roundtrip' && returnDate ? returnDate.toISOString() : undefined,
      passengers,
    };
    
    if (onSearch) {
      onSearch(filters);
    } else {
      // Navigate to search page with query params
      const params = new URLSearchParams();
      if (origin) params.append('origin', origin);
      if (destination) params.append('destination', destination);
      if (departureDate) params.append('departureDate', departureDate.toISOString());
      if (tripType === 'roundtrip' && returnDate) params.append('returnDate', returnDate.toISOString());
      params.append('passengers', passengers.toString());
      
      navigate(`/search?${params.toString()}`);
    }
  };

  // Common cities for demo
  const popularCities = [
    'New York', 'London', 'Tokyo', 'Paris', 'Dubai',
    'Singapore', 'Hong Kong', 'Sydney', 'Los Angeles', 'Frankfurt'
  ];

  return (
    <Form onSubmit={handleSubmit} className={`bg-white rounded-3 p-4 shadow ${compact ? '' : 'mb-5'}`}>
      <Row className="mb-3">
        <Col xs={12} className="mb-3">
          <div className="d-flex">
            <Form.Check
              type="radio"
              id="oneway"
              label="One Way"
              name="tripType"
              checked={tripType === 'oneway'}
              onChange={() => setTripType('oneway')}
              className="me-4"
            />
            <Form.Check
              type="radio"
              id="roundtrip"
              label="Round Trip"
              name="tripType"
              checked={tripType === 'roundtrip'}
              onChange={() => setTripType('roundtrip')}
            />
          </div>
        </Col>
      </Row>

      <Row className={compact ? 'g-2' : 'g-3'}>
        <Col md={compact ? 6 : 3} xs={12}>
          <Form.Group>
            <Form.Label>From</Form.Label>
            <Form.Select 
              value={origin} 
              onChange={(e) => setOrigin(e.target.value)}
              required
            >
              <option value="">Select origin</option>
              {popularCities.map((city) => (
                <option key={`origin-${city}`} value={city}>{city}</option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
        
        <Col md={compact ? 6 : 3} xs={12}>
          <Form.Group>
            <Form.Label>To</Form.Label>
            <Form.Select 
              value={destination} 
              onChange={(e) => setDestination(e.target.value)}
              required
            >
              <option value="">Select destination</option>
              {popularCities
                .filter(city => city !== origin)
                .map((city) => (
                  <option key={`dest-${city}`} value={city}>{city}</option>
                ))
              }
            </Form.Select>
          </Form.Group>
        </Col>
        
        <Col md={compact ? 6 : 2} xs={tripType === 'roundtrip' ? 6 : 12}>
          <Form.Group>
            <Form.Label>Departure</Form.Label>
            <DatePicker
              selected={departureDate}
              onChange={setDepartureDate}
              minDate={new Date()}
              dateFormat="MMM d, yyyy"
              className="form-control"
              placeholderText="Select date"
              required
            />
          </Form.Group>
        </Col>
        
        {tripType === 'roundtrip' && (
          <Col md={compact ? 6 : 2} xs={6}>
            <Form.Group>
              <Form.Label>Return</Form.Label>
              <DatePicker
                selected={returnDate}
                onChange={setReturnDate}
                minDate={departureDate || new Date()}
                dateFormat="MMM d, yyyy"
                className="form-control"
                placeholderText="Select date"
                required={tripType === 'roundtrip'}
              />
            </Form.Group>
          </Col>
        )}
        
        <Col md={compact ? 6 : 1} xs={6}>
          <Form.Group>
            <Form.Label>Passengers</Form.Label>
            <Form.Select 
              value={passengers} 
              onChange={(e) => setPassengers(parseInt(e.target.value))}
            >
              {[1, 2, 3, 4, 5, 6].map((num) => (
                <option key={num} value={num}>{num}</option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
        
        <Col md={compact ? 6 : 1} xs={6} className={`d-flex align-items-${compact ? 'center' : 'end'}`}>
          <Button 
            variant="primary" 
            type="submit" 
            className={`w-100 ${compact ? 'mt-2' : 'mt-auto'}`}
          >
            Search
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default SearchForm;