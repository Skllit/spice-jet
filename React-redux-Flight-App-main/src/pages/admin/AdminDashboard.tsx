import React, { useEffect } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { fetchFlights } from '../../store/slices/flightsSlice';
import { fetchAllBookings } from '../../store/slices/bookingsSlice';


const AdminDashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { flights } = useSelector((s: RootState) => s.flights);
  const { bookings } = useSelector((s: RootState) => s.bookings);

  useEffect(() => {
    dispatch(fetchFlights());
    dispatch(fetchAllBookings());
  }, [dispatch]);

  const totalFlights = flights.length;
  const totalBookings = bookings.length;
  const confirmed = bookings.filter(b => b.status === 'confirmed').length;
  const cancelled = bookings.filter(b => b.status === 'cancelled').length;
  const revenue = bookings
    .filter(b => b.status === 'confirmed')
    .reduce((sum, b) => sum + b.totalPrice, 0);

  const totalSeats = flights.reduce((sum, f) => sum + f.seatsTotal, 0);
  const bookedSeats = flights.reduce((sum, f) => sum + (f.seatsTotal - f.seatsAvailable), 0);
  const utilization = totalSeats ? Math.round((bookedSeats / totalSeats) * 100) : 0;

  return (
    <Container className="py-5">
      <h2 className="mb-4">Admin Dashboard</h2>
      <Row className="g-4">
        <Col md={4}>
          <Card className="p-3 text-center">
            <h5>Total Flights</h5>
            <h2>{totalFlights}</h2>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="p-3 text-center">
            <h5>Total Bookings</h5>
            <h2>{totalBookings}</h2>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="p-3 text-center">
            <h5>Revenue</h5>
            <h2>${revenue.toFixed(2)}</h2>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="p-3 text-center">
            <h5>Confirmed</h5>
            <h2>{confirmed}</h2>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="p-3 text-center">
            <h5>Cancelled</h5>
            <h2>{cancelled}</h2>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="p-3 text-center">
            <h5>Seat Utilization</h5>
            <h2>{utilization}%</h2>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminDashboard;
