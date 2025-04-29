import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { login, clearError } from '../store/slices/authSlice';
import { Plane, Lock, Mail } from 'lucide-react';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validated, setValidated] = useState(false);
  
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  
  useEffect(() => {
    // Redirect if already logged in
    if (isAuthenticated) {
      if (user?.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    }
    
    // Clear previous errors
    dispatch(clearError());
  }, [isAuthenticated, navigate, dispatch, user]);
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }
    
    dispatch(login({ email, password }));
  };

  // Demo account quick login buttons
  const loginAsDemo = (userType: 'admin' | 'user') => {
    if (userType === 'admin') {
      setEmail('admin@airlines.com');
      setPassword('admin123');
      dispatch(login({ email: 'admin@airlines.com', password: 'admin123' }));
    } else {
      setEmail('john@example.com');
      setPassword('user123');
      dispatch(login({ email: 'john@example.com', password: 'user123' }));
    }
  };
  
  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="border-0 shadow-sm">
            <Card.Body className="p-5">
              <div className="text-center mb-4">
                <Plane size={48} className="text-primary mb-3" />
                <h2 className="fw-bold">Welcome Back</h2>
                <p className="text-muted">Sign in to your SkyJet account</p>
              </div>
              
              {error && (
                <Alert variant="danger" onClose={() => dispatch(clearError())} dismissible>
                  {error}
                </Alert>
              )}
              
              <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="email">
                  <Form.Label>Email Address</Form.Label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <Mail size={18} />
                    </span>
                    <Form.Control
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      Please provide a valid email.
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>
                
                <Form.Group className="mb-4" controlId="password">
                  <Form.Label>Password</Form.Label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <Lock size={18} />
                    </span>
                    <Form.Control
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                    />
                    <Form.Control.Feedback type="invalid">
                      Password must be at least 6 characters.
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>
                
                <Button
                  variant="primary"
                  type="submit"
                  className="w-100 py-2 mb-3"
                  disabled={loading}
                >
                  {loading ? 'Signing in...' : 'Sign In'}
                </Button>
                
                <div className="text-center mb-3">
                  <small className="text-muted">Don't have an account? </small>
                  <Link to="/register" className="text-decoration-none">Register</Link>
                </div>
                
                <div className="border-top pt-3 mt-3">
                  <p className="text-center text-muted small mb-2">Quick login for demo purposes:</p>
                  <div className="d-flex gap-2">
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      className="w-50"
                      onClick={() => loginAsDemo('user')}
                      disabled={loading}
                    >
                      Login as User
                    </Button>
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      className="w-50"
                      onClick={() => loginAsDemo('admin')}
                      disabled={loading}
                    >
                      Login as Admin
                    </Button>
                  </div>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;