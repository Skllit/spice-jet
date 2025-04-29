import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Plane, Shield, Clock, CreditCard, Star } from 'lucide-react';
import SearchForm from '../components/SearchForm';

const Home: React.FC = () => {
  // Sample destinations for promotional section
  const popularDestinations = [
    {
      id: 1,
      name: 'New York',
      image: 'https://images.pexels.com/photos/802024/pexels-photo-802024.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      price: 350
    },
    {
      id: 2,
      name: 'London',
      image: 'https://images.pexels.com/photos/460672/pexels-photo-460672.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      price: 420
    },
    {
      id: 3,
      name: 'Tokyo',
      image: 'https://images.pexels.com/photos/2506923/pexels-photo-2506923.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      price: 780
    }
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="bg-primary text-white py-5">
        <Container>
          <Row className="align-items-center">
            <Col lg={6} className="mb-5 mb-lg-0">
              <h1 className="display-4 fw-bold mb-3">Fly to Your Dream Destination</h1>
              <p className="lead mb-4">Book your flights with ease and enjoy competitive prices, flexible booking options, and excellent service.</p>
              <Button 
                as={Link} 
                to="/search" 
                variant="light" 
                size="lg" 
                className="text-primary fw-semibold me-3"
              >
                Explore Flights
              </Button>
              <Button 
                as={Link} 
                to="/register" 
                variant="outline-light" 
                size="lg"
              >
                Join Now
              </Button>
            </Col>
            <Col lg={6}>
              <div className="position-relative">
                <img 
                  src="https://images.pexels.com/photos/2026324/pexels-photo-2026324.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
                  alt="Airplane view" 
                  className="img-fluid rounded-3 shadow"
                />
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Search Form Section */}
      <section className="py-5">
        <Container>
          <div className="position-relative mt-n5">
            <SearchForm />
          </div>
        </Container>
      </section>

      {/* Popular Destinations Section */}
      <section className="py-5">
        <Container>
          <h2 className="fw-bold mb-4">Popular Destinations</h2>
          <Row>
            {popularDestinations.map((destination) => (
              <Col md={4} className="mb-4" key={destination.id}>
                <Card className="border-0 shadow-sm h-100 flight-card">
                  <div className="position-relative">
                    <Card.Img 
                      variant="top" 
                      src={destination.image} 
                      alt={destination.name} 
                      className="rounded-top" 
                      style={{ height: '200px', objectFit: 'cover' }}
                    />
                    <div className="position-absolute bottom-0 start-0 p-3 text-white">
                      <h4 className="mb-0 fw-bold">{destination.name}</h4>
                    </div>
                  </div>
                  <Card.Body className="d-flex flex-column">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <span className="text-muted">Starting from</span>
                      <span className="text-primary fw-bold fs-4">${destination.price}</span>
                    </div>
                    <Button 
                      as={Link} 
                      to={`/search?destination=${destination.name}`} 
                      variant="outline-primary" 
                      className="mt-auto"
                    >
                      Explore Flights
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Features Section */}
      <section className="py-5 bg-light">
        <Container>
          <h2 className="fw-bold text-center mb-5">Why Choose SkyJet?</h2>
          <Row className="g-4">
            <Col md={3} sm={6}>
              <div className="text-center">
                <div className="bg-white p-3 rounded-circle shadow-sm d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '80px', height: '80px' }}>
                  <Shield size={32} className="text-primary" />
                </div>
                <h5 className="fw-bold">Safe & Secure</h5>
                <p className="text-muted">Your safety is our top priority with the highest security standards.</p>
              </div>
            </Col>
            <Col md={3} sm={6}>
              <div className="text-center">
                <div className="bg-white p-3 rounded-circle shadow-sm d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '80px', height: '80px' }}>
                  <Clock size={32} className="text-primary" />
                </div>
                <h5 className="fw-bold">24/7 Support</h5>
                <p className="text-muted">Our customer service team is available around the clock to assist you.</p>
              </div>
            </Col>
            <Col md={3} sm={6}>
              <div className="text-center">
                <div className="bg-white p-3 rounded-circle shadow-sm d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '80px', height: '80px' }}>
                  <CreditCard size={32} className="text-primary" />
                </div>
                <h5 className="fw-bold">Easy Payments</h5>
                <p className="text-muted">Multiple secure payment options for your convenience.</p>
              </div>
            </Col>
            <Col md={3} sm={6}>
              <div className="text-center">
                <div className="bg-white p-3 rounded-circle shadow-sm d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '80px', height: '80px' }}>
                  <Star size={32} className="text-primary" />
                </div>
                <h5 className="fw-bold">Best Prices</h5>
                <p className="text-muted">Competitive prices and regular promotions for the best deals.</p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Call to Action */}
      <section className="py-5">
        <Container>
          <Row className="justify-content-center">
            <Col md={10} lg={8}>
              <div className="bg-primary text-white p-5 rounded-3 text-center">
                <h2 className="fw-bold mb-3">Ready to Take Off?</h2>
                <p className="lead mb-4">Sign up today and get exclusive access to special offers and promotions.</p>
                <Button 
                  as={Link} 
                  to="/register" 
                  variant="light" 
                  size="lg" 
                  className="text-primary fw-semibold px-4"
                >
                  Sign Up Now
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default Home;