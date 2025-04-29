import React from 'react';
import { Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Home, Search, Plane } from 'lucide-react';

const NotFound: React.FC = () => {
  return (
    <Container className="py-5 text-center">
      <div className="my-5">
        <Plane size={120} className="text-primary mb-4" />
        <h1 className="display-4 fw-bold mb-3">404</h1>
        <h2 className="fw-bold mb-3">Page Not Found</h2>
        <p className="lead mb-5">
          Looks like the page you're looking for has departed.
        </p>
        <div className="d-flex justify-content-center gap-3">
          <Button as={Link} to="/" variant="primary" className="px-4 py-2">
            <Home size={18} className="me-2" />
            Go Home
          </Button>
          <Button as={Link} to="/search" variant="outline-primary" className="px-4 py-2">
            <Search size={18} className="me-2" />
            Search Flights
          </Button>
        </div>
      </div>
    </Container>
  );
};

export default NotFound;