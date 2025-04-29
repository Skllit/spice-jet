// src/pages/FlightSearch.tsx
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Container, Row, Col,
  Card, Form, Spinner
} from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import {
  searchFlights,
  fetchFlights
} from '../store/slices/flightsSlice';
import FlightCard from '../components/FlightCard';
import SearchForm from '../components/SearchForm';
import { Flight, SearchFilters } from '../types';
import { SlidersHorizontal } from 'lucide-react';

const FlightSearch: React.FC = () => {
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const { flights, loading, error } = useSelector((s: RootState) => s.flights);

  const [filteredFlights, setFilteredFlights] = useState<Flight[]>([]);
  const [availableAirlines, setAvailableAirlines] = useState<string[]>([]);
  const [filterAirlines, setFilterAirlines] = useState<string[]>([]);
  const [filterPrice, setFilterPrice] = useState<[number, number]>([0, 0]);
  const [sortOption, setSortOption] = useState<'price-asc'|'price-desc'|'duration-asc'|'departure-asc'>('price-asc');

  // Initial load or URL-change
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const filters: SearchFilters = {};
    if (params.get('origin'))      filters.origin = params.get('origin')!;
    if (params.get('destination')) filters.destination = params.get('destination')!;
    if (params.get('departureDate')) filters.departureDate = params.get('departureDate')!;
    if (params.get('passengers'))  filters.passengers = Number(params.get('passengers'));
    
    if (filters.origin && filters.destination) {
      dispatch(searchFlights(filters));
    } else {
      dispatch(fetchFlights());
    }
  }, [dispatch, location.search]);

  // Build filter options once flights arrive
  useEffect(() => {
    if (!flights.length) return;
    const airlines = Array.from(new Set(flights.map(f => f.airline)));
    setAvailableAirlines(airlines);
    setFilterAirlines(airlines);

    const prices = flights.map(f => f.price);
    setFilterPrice([Math.min(...prices), Math.max(...prices)]);
  }, [flights]);

  // Apply filters & sort
  useEffect(() => {
    let results = flights
      .filter(f => filterAirlines.includes(f.airline))
      .filter(f => f.price >= filterPrice[0] && f.price <= filterPrice[1]);

    switch (sortOption) {
      case 'price-asc':
        results.sort((a,b) => a.price - b.price); break;
      case 'price-desc':
        results.sort((a,b) => b.price - a.price); break;
      case 'duration-asc':
        results.sort((a,b) => {
          const [ah, am] = a.duration.split('h ').map(n => parseInt(n));
          const [bh, bm] = b.duration.split('h ').map(n => parseInt(n));
          return ah*60+am - (bh*60+bm);
        });
        break;
      case 'departure-asc':
        results.sort((a,b) => 
          new Date(a.departureDate).getTime() - new Date(b.departureDate).getTime()
        );
        break;
    }

    setFilteredFlights(results);
  }, [flights, filterAirlines, filterPrice, sortOption]);

  const handleSearch = (filters: SearchFilters) => {
    dispatch(searchFlights(filters));
  };

  const toggleAirlineFilter = (airline: string) => {
    setFilterAirlines(prev => 
      prev.includes(airline) 
        ? prev.filter(a => a !== airline)
        : [...prev, airline]
    );
  };

  const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterPrice([filterPrice[0], Number(e.target.value)]);
  };

  return (
    <Container className="py-5">
      <SearchForm onSearch={handleSearch} />

      <Row className="mt-4">
        {/* Sidebar Filters */}
        <Col lg={3} className="mb-4">
          <Card className="p-3">
            <div className="d-flex align-items-center mb-3">
              <SlidersHorizontal className="me-2" /> Filters
            </div>

            <Form.Group className="mb-3">
              <Form.Label>Max Price: ${filterPrice[1]}</Form.Label>
              <Form.Range
                min={0}
                max={filterPrice[1]}
                value={filterPrice[1]}
                onChange={handleMaxPriceChange}
              />
            </Form.Group>

            <div>
              <h6>Airlines</h6>
              {availableAirlines.map(airline => (
                <Form.Check
                  key={airline}                     // ← unique key
                  type="checkbox"
                  label={airline}
                  checked={filterAirlines.includes(airline)}
                  onChange={() => toggleAirlineFilter(airline)}
                  className="mb-1"
                />
              ))}
            </div>
          </Card>
        </Col>

        {/* Results */}
        <Col lg={9}>
          <Card className="mb-3 p-2">
            <div className="d-flex justify-content-between">
              <div>{filteredFlights.length} Flights</div>
              <Form.Select
                style={{ width: 180 }}
                value={sortOption}
                onChange={e => setSortOption(e.target.value as any)}
              >
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">High to Low</option>
                <option value="duration-asc">Duration: Shortest</option>
                <option value="departure-asc">Departure: Earliest</option>
              </Form.Select>
            </div>
          </Card>

          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" />
            </div>
          ) : error ? (
            <div className="alert alert-danger">{error}</div>
          ) : filteredFlights.length === 0 ? (
            <div className="text-center py-5">No flights found</div>
          ) : (
            filteredFlights.map(flight => (
              <>
              {filteredFlights.map(flight => (
                <FlightCard key={flight.id} flight={flight} />
              ))}</>
              
            
            ))
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default FlightSearch;
