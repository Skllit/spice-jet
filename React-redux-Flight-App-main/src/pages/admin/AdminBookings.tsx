import React, { useEffect, useState } from 'react';
import { Container, Spinner, Alert, Table, InputGroup, Form, Button, Modal } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { fetchAllBookings } from '../../store/slices/bookingsSlice';
import { fetchFlights } from '../../store/slices/flightsSlice';
import { Booking } from '../../types';

const AdminBookings: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { bookings, loading: bLoading, error: bError } = useSelector((s: RootState) => s.bookings);
  const { flights, loading: fLoading } = useSelector((s: RootState) => s.flights);

  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [detail, setDetail] = useState<Booking | null>(null);

  useEffect(() => {
    dispatch(fetchAllBookings());
    dispatch(fetchFlights());
  }, [dispatch]);

  const flightFor = (id: string) => flights.find(f => f.id === id);

  const filtered = bookings.filter(b => {
    const f = flightFor(b.flightId);
    return (
      b.id.includes(search) ||
      f?.flightNumber.toLowerCase().includes(search.toLowerCase()) ||
      f?.origin.toLowerCase().includes(search.toLowerCase()) ||
      f?.destination.toLowerCase().includes(search.toLowerCase())
    );
  });

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
      <h2 className="mb-4">All Bookings</h2>
      <InputGroup className="mb-3">
        <Form.Control
          placeholder="Search bookings..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </InputGroup>

      <Table hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Flight</th>
            <th>User</th>
            <th>Passengers</th>
            <th>Status</th>
            <th className="text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(b => {
            const f = flightFor(b.flightId);
            return (
              <tr key={b.id}>
                <td>{b.id}</td>
                <td>{f?.flightNumber}</td>
                <td>{b.userId}</td>
                <td>{b.passengers.length}</td>
                <td>{b.status}</td>
                <td className="text-center">
                  <Button variant="sm" onClick={() => { setDetail(b); setShowModal(true); }}>
                    Details
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Booking Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {detail && (
            <>
              <p><strong>ID:</strong> {detail.id}</p>
              <p><strong>Status:</strong> {detail.status}</p>
              <p><strong>Passengers:</strong></p>
              <ul>
                {detail.passengers.map((p, i) => (
                  <li key={i}>{p.name} — {p.seatNumber}</li>
                ))}
              </ul>
            </>
          )}
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default AdminBookings;
