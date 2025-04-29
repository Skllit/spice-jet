// src/pages/FlightSearch.tsx
import React, { useEffect, useState } from 'react';
import {
  Container,
  Card,
  Form,
  Row,
  Col,
  Button,
  Spinner,
  Alert
} from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { fetchFlights, searchFlights } from '../store/slices/flightsSlice';
import FlightCard from '../components/FlightCard';
import { Flight, SearchFilters } from '../types';

const FlightSearch: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { flights, loading, error } = useSelector((s: RootState) => s.flights);

  // --- Search form state ---
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [passengers, setPassengers] = useState(1);

  // --- Sidebar filters state ---
  const [availableAirlines, setAvailableAirlines] = useState<string[]>([]);
  const [filterAirlines, setFilterAirlines] = useState<string[]>([]);
  const [filterPrice, setFilterPrice] = useState<[number, number]>([0, 0]);

  // --- Results to render ---
  const [results, setResults] = useState<Flight[]>([]);

  // Fetch all flights on mount
  useEffect(() => {
    dispatch(fetchFlights());
  }, [dispatch]);

  // When flights arrive, initialize sidebar filters & results
  useEffect(() => {
    if (!flights.length) return;

    // Build airline list
    const airlines = Array.from(new Set(flights.map(f => f.airline)));
    setAvailableAirlines(airlines);
    setFilterAirlines(airlines);

    // Build price range
    const prices = flights.map(f => f.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    setFilterPrice([minPrice, maxPrice]);

    // Show all by default
    setResults(flights);
  }, [flights]);

  // Whenever **any** filter changes, re-compute `results`
  useEffect(() => {
    let temp = flights
      // Sidebar filters
      .filter(f => filterAirlines.includes(f.airline))
      .filter(f => f.price >= filterPrice[0] && f.price <= filterPrice[1]);

    // Search form filters
    if (origin)        temp = temp.filter(f => f.origin === origin);
    if (destination)   temp = temp.filter(f => f.destination === destination);
    if (departureDate) temp = temp.filter(
      f => f.departureDate.slice(0,10) === departureDate
    );

    setResults(temp);
  }, [
    flights,
    filterAirlines,
    filterPrice,
    origin,
    destination,
    departureDate
  ]);

  // Trigger backend search (origin/dest) — updates `flights`
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const filters: SearchFilters = {
      origin,
      destination,
      departureDate,
      passengers
    };
    dispatch(searchFlights(filters));
  };

  // Sidebar interactions
  const toggleAirline = (airline: string) => {
    setFilterAirlines(prev =>
      prev.includes(airline)
        ? prev.filter(a => a !== airline)
        : [...prev, airline]
    );
  };
  const handleMaxPriceChange = (val: number) => {
    setFilterPrice([filterPrice[0], val]);
  };

  // Build dropdown options
  const origins = Array.from(new Set(flights.map(f => f.origin)));
  const destinations = Array.from(new Set(flights.map(f => f.destination)));

  return (
    <Container className="py-5">
      {/* — Search Form — */}
      <Card className="p-4 mb-4">
        <Form onSubmit={handleSearch}>
          <Row className="g-3">
            <Col md>
              <Form.Label>Origin</Form.Label>
              <Form.Select
                value={origin}
                onChange={e => setOrigin(e.target.value)}
                required
              >
                <option value="">Select origin</option>
                {origins.map(o => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </Form.Select>
            </Col>

            <Col md>
              <Form.Label>Destination</Form.Label>
              <Form.Select
                value={destination}
                onChange={e => setDestination(e.target.value)}
                required
              >
                <option value="">Select destination</option>
                {destinations.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </Form.Select>
            </Col>

            <Col md>
              <Form.Label>Departure Date</Form.Label>
              <Form.Control
                type="date"
                value={departureDate}
                onChange={e => setDepartureDate(e.target.value)}
                required
              />
            </Col>

            <Col md>
              <Form.Label>Passengers</Form.Label>
              <Form.Control
                type="number"
                min={1}
                value={passengers}
                onChange={e => setPassengers(Number(e.target.value))}
              />
            </Col>

            <Col md="auto" className="d-flex align-items-end">
              <Button type="submit">Search</Button>
            </Col>
          </Row>
        </Form>
      </Card>

      <Row>
        {/* — Sidebar Filters — */}
        <Col lg={3} className="mb-4">
          <Card className="p-3">
            <h6>Max Price: ${filterPrice[1]}</h6>
            <Form.Range
              min={0}
              max={filterPrice[1]}
              value={filterPrice[1]}
              onChange={e => handleMaxPriceChange(Number(e.target.value))}
            />

            <hr />

            <h6>Airlines</h6>
            {availableAirlines.map(a => (
              <Form.Check
                key={a}
                type="checkbox"
                label={a}
                checked={filterAirlines.includes(a)}
                onChange={() => toggleAirline(a)}
                className="mb-1"
              />
            ))}
          </Card>
        </Col>

        {/* — Flight Results — */}
        <Col lg={9}>
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" />
            </div>
          ) : error ? (
            <Alert variant="danger">{error}</Alert>
          ) : results.length === 0 ? (
            <div className="text-center py-5">No flights found.</div>
          ) : (
            results.map(flight => (
              <FlightCard key={flight.id} flight={flight} />
            ))
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default FlightSearch;
