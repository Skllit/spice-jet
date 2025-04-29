import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Plane, Facebook, Twitter, Instagram, Phone, Mail, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-dark text-light py-5 mt-5">
      <Container>
        <Row>
          <Col md={4} className="mb-4 mb-md-0">
            <div className="d-flex align-items-center mb-3">
              <Plane size={24} className="text-primary me-2" />
              <h5 className="mb-0 fw-bold">SkyJet</h5>
            </div>
            <p className="text-muted">
              Book your flights with ease and enjoy a seamless travel experience with SkyJet.
              We offer competitive prices and excellent customer service.
            </p>
            <div className="d-flex mt-3">
              <a href="#" className="text-light me-3">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-light me-3">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-light">
                <Instagram size={20} />
              </a>
            </div>
          </Col>
          
          <Col md={2} sm={6} className="mb-4 mb-md-0">
            <h6 className="fw-bold mb-3">Quick Links</h6>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link to="/" className="text-muted text-decoration-none hover-underline">Home</Link>
              </li>
              <li className="mb-2">
                <Link to="/search" className="text-muted text-decoration-none hover-underline">Search Flights</Link>
              </li>
              <li className="mb-2">
                <Link to="/login" className="text-muted text-decoration-none hover-underline">Login</Link>
              </li>
              <li>
                <Link to="/register" className="text-muted text-decoration-none hover-underline">Register</Link>
              </li>
            </ul>
          </Col>
          
          <Col md={3} sm={6} className="mb-4 mb-md-0">
            <h6 className="fw-bold mb-3">Support</h6>
            <ul className="list-unstyled">
              <li className="mb-2">
                <a href="#" className="text-muted text-decoration-none hover-underline">Help Center</a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-muted text-decoration-none hover-underline">FAQs</a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-muted text-decoration-none hover-underline">Terms & Conditions</a>
              </li>
              <li>
                <a href="#" className="text-muted text-decoration-none hover-underline">Privacy Policy</a>
              </li>
            </ul>
          </Col>
          
          <Col md={3}>
            <h6 className="fw-bold mb-3">Contact Us</h6>
            <ul className="list-unstyled">
              <li className="mb-2 d-flex align-items-center">
                <Phone size={16} className="text-primary me-2" />
                <span className="text-muted">+1 (555) 123-4567</span>
              </li>
              <li className="mb-2 d-flex align-items-center">
                <Mail size={16} className="text-primary me-2" />
                <span className="text-muted">support@skyjet.com</span>
              </li>
              <li className="d-flex align-items-start">
                <MapPin size={16} className="text-primary me-2 mt-1" />
                <span className="text-muted">123 Aviation Way, Skyline Tower, NYC 10001</span>
              </li>
            </ul>
          </Col>
        </Row>
        
        <hr className="my-4 bg-secondary" />
        
        <div className="text-center text-muted">
          <small>&copy; {new Date().getFullYear()} SkyJet Airlines. All rights reserved.</small>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;