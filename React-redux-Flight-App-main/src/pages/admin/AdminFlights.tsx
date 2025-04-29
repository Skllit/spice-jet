import React, { useEffect, useState } from 'react';
import { Container, Table, Button, InputGroup, Form, Badge, Spinner } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { AppDispatch, RootState } from '../../store';
import { fetchFlights, deleteFlight } from '../../store/slices/flightsSlice';
import { Flight } from '../../types';
import { Plus, Search, Edit, Trash2, AlertTriangle } from 'lucide-react';

const AdminFlights: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  
  const { flights, loading, error } = useSelector((state: RootState) => state.flights);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [flightToDelete, setFlightToDelete] = useState<Flight | null>(null);
  
  useEffect(() => {
    dispatch(fetchFlights());
  }, [dispatch]);
  
  const filteredFlights = flights.filter(
    (flight) =>
      flight.flightNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      flight.airline.toLowerCase().includes(searchTerm.toLowerCase()) ||
      flight.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
      flight.destination.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleAddNew = () => {
    navigate('/admin/flights/add');
  };
  
  const handleEdit = (id: string) => {
    navigate(`/admin/flights/edit/${id}`);
  };
  
  const handleDeleteClick = (flight: Flight) => {
    setFlightToDelete(flight);
    setShowDeleteModal(true);
  };
  
  const confirmDelete = () => {
    if (flightToDelete) {
      dispatch(deleteFlight(flightToDelete.id));
      setShowDeleteModal(false);
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };
  
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  
  if (loading && flights.length === 0) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">Loading flights...</p>
      </Container>
    );
  }
  
  return (
    <Container className="py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold mb-0">Manage Flights</h2>
        <Button 
          variant="primary" 
          onClick={handleAddNew}
          className="d-flex align-items-center"
        >
          <Plus size={18} className="me-2" />
          Add New Flight
        </Button>
      </div>
      
      {error && (
        <div className="alert alert-danger mb-4">{error}</div>
      )}
      
      <div className="mb-4">
        <InputGroup>
          <InputGroup.Text>
            <Search size={18} />
          </InputGroup.Text>
          <Form.Control
            placeholder="Search by flight number, airline, origin, or destination"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </InputGroup>
      </div>
      
      <div className="table-responsive">
        <Table hover className="border bg-white">
          <thead className="bg-light">
            <tr>
              <th>Flight #</th>
              <th>Airline</th>
              <th>Route</th>
              <th>Date</th>
              <th>Time</th>
              <th>Price</th>
              <th>Seats</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredFlights.length > 0 ? (
              filteredFlights.map((flight) => (
                <tr key={flight.id}>
                  <td>{flight.flightNumber}</td>
                  <td>{flight.airline}</td>
                  <td>{flight.origin} → {flight.destination}</td>
                  <td>{formatDate(flight.departureDate)}</td>
                  <td>
                    {formatTime(flight.departureDate)} - {formatTime(flight.arrivalDate)}
                  </td>
                  <td>${flight.price}</td>
                  <td>
                    <Badge bg={
                      flight.seatsAvailable === 0 ? 'danger' :
                      flight.seatsAvailable < flight.seatsTotal * 0.2 ? 'warning' : 'success'
                    }>
                      {flight.seatsAvailable}/{flight.seatsTotal}
                    </Badge>
                  </td>
                  <td>
                    <div className="d-flex justify-content-center gap-2">
                      <Button 
                        variant="outline-primary" 
                        size="sm"
                        onClick={() => handleEdit(flight.id)}
                      >
                        <Edit size={16} />
                      </Button>
                      <Button 
                        variant="outline-danger" 
                        size="sm"
                        onClick={() => handleDeleteClick(flight)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="text-center py-4">
                  {searchTerm ? 'No flights match your search criteria' : 'No flights available'}
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>
      
      {/* Delete Confirmation Modal */}
      {showDeleteModal && flightToDelete && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title text-danger">
                  <AlertTriangle size={18} className="me-2" />
                  Delete Flight
                </h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowDeleteModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to delete flight <strong>{flightToDelete.flightNumber}</strong> from <strong>{flightToDelete.origin}</strong> to <strong>{flightToDelete.destination}</strong>?</p>
                <p className="text-danger"><strong>Warning:</strong> This action cannot be undone!</p>
              </div>
              <div className="modal-footer">
                <Button variant="outline-secondary" onClick={() => setShowDeleteModal(false)}>
                  Cancel
                </Button>
                <Button variant="danger" onClick={confirmDelete}>
                  Delete Flight
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Container>
  );
};

export default AdminFlights;