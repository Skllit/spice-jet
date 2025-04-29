import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Container, Nav, NavDropdown, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { logout } from '../../store/slices/authSlice';
import { Plane } from 'lucide-react';

const Header: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <Navbar bg="white" expand="lg" className="shadow-sm py-2">
      <Container>
        <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
          <Plane size={28} className="text-primary me-2" />
          <span className="fw-bold text-primary">SkyJet</span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/" className="mx-1">Home</Nav.Link>
            <Nav.Link as={Link} to="/search" className="mx-1">Search Flights</Nav.Link>
            {isAuthenticated && user?.role === 'user' && (
              <Nav.Link as={Link} to="/my-bookings" className="mx-1">My Bookings</Nav.Link>
            )}
            {isAuthenticated && user?.role === 'admin' && (
              <NavDropdown title="Admin" id="admin-dropdown" className="mx-1">
                <NavDropdown.Item as={Link} to="/admin">Dashboard</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/admin/flights">Manage Flights</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/admin/bookings">View Bookings</NavDropdown.Item>
              </NavDropdown>
            )}
          </Nav>
          <Nav>
            {!isAuthenticated ? (
              <>
                <Button 
                  as={Link} 
                  to="/login" 
                  variant="outline-primary" 
                  className="me-2"
                >
                  Login
                </Button>
                <Button 
                  as={Link} 
                  to="/register" 
                  variant="primary"
                >
                  Register
                </Button>
              </>
            ) : (
              <NavDropdown 
                title={user?.name || 'User'} 
                id="user-dropdown" 
                align="end"
              >
                {user?.role === 'admin' ? (
                  <NavDropdown.Item as={Link} to="/admin">Admin Panel</NavDropdown.Item>
                ) : (
                  <NavDropdown.Item as={Link} to="/my-bookings">My Bookings</NavDropdown.Item>
                )}
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
              </NavDropdown>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;