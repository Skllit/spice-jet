import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from './store';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import FlightSearch from './pages/FlightSearch';
import FlightDetails from './pages/FlightDetails';
import BookingProcess from './pages/BookingProcess';
import BookingConfirmation from './pages/BookingConfirmation';
import UserBookings from './pages/UserBookings';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminFlights from './pages/admin/AdminFlights';
import AdminBookings from './pages/admin/AdminBookings';
import AdminAddFlight from './pages/admin/AdminAddFlight';
import AdminEditFlight from './pages/admin/AdminEditFlight';
import NotFound from './pages/NotFound';

// Protected route component for user routes
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// Admin route component for admin-only routes
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  
  if (!isAuthenticated || user?.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

function App() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />
      <main className="flex-grow-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/search" element={<FlightSearch />} />
          <Route path="/flights/:id" element={<FlightDetails />} />
          
          {/* Protected User Routes */}
          <Route 
            path="/booking/:flightId" 
            element={
              <ProtectedRoute>
                <BookingProcess />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/booking-confirmation/:bookingId" 
            element={
              <ProtectedRoute>
                <BookingConfirmation />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/my-bookings" 
            element={
              <ProtectedRoute>
                <UserBookings />
              </ProtectedRoute>
            } 
          />
          
          {/* Admin Routes */}
          <Route 
            path="/admin" 
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            } 
          />
          <Route 
            path="/admin/flights" 
            element={
              <AdminRoute>
                <AdminFlights />
              </AdminRoute>
            } 
          />
          <Route 
            path="/admin/bookings" 
            element={
              <AdminRoute>
                <AdminBookings />
              </AdminRoute>
            } 
          />
          <Route 
            path="/admin/flights/add" 
            element={
              <AdminRoute>
                <AdminAddFlight />
              </AdminRoute>
            } 
          />
          <Route 
            path="/admin/flights/edit/:id" 
            element={
              <AdminRoute>
                <AdminEditFlight />
              </AdminRoute>
            } 
          />
          
          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;