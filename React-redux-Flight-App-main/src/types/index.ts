export interface Flight {
  id: string;
  flightNumber: string;
  airline: string;
  origin: string;
  destination: string;
  departureDate: string;
  arrivalDate: string;
  duration: string;
  price: number;
  seatsAvailable: number;
  seatsTotal: number;
  aircraft: string;
}

export interface Passenger {
  name: string;
  passport: string;
  seatNumber: string;
}

export interface Booking {
  id: string;
  flightId: string;
  userId: string;
  passengers: Passenger[];
  bookingDate: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  totalPrice: number;
}

export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: 'admin' | 'user';
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface FlightsState {
  flights: Flight[];
  selectedFlight: Flight | null;
  loading: boolean;
  error: string | null;
}

export interface BookingsState {
  bookings: Booking[];
  selectedBooking: Booking | null;
  loading: boolean;
  error: string | null;
}

export interface AppState {
  auth: AuthState;
  flights: FlightsState;
  bookings: BookingsState;
}

export interface SearchFilters {
  origin?: string;
  destination?: string;
  departureDate?: string;
  returnDate?: string;
  passengers?: number;
}