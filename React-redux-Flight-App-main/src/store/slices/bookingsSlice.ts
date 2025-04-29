// src/store/slices/bookingsSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import API from '../../api/axios';
import { Booking, BookingsState } from '../../types';

// The raw shape from Mongo:
type RawBooking = Omit<Booking, 'id' | 'flightId'> & {
  _id: string;
  flight: string;        // this is the ObjectId of the flight
};

const initialState: BookingsState = {
  bookings: [],
  selectedBooking: null,
  loading: false,
  error: null,
};

// Fetch current user’s bookings
export const fetchBookings = createAsyncThunk<Booking[], void, { rejectValue: string }>(
  'bookings/fetchBookings',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await API.get<RawBooking[]>('/bookings/mine');
      return data.map(({ _id, flight, ...rest }) => ({
        id: _id,
        flightId: flight,
        ...rest
      }));
    } catch {
      return rejectWithValue('Failed to fetch your bookings.');
    }
  }
);

// Fetch all bookings (admin)
export const fetchAllBookings = createAsyncThunk<Booking[], void, { rejectValue: string }>(
  'bookings/fetchAllBookings',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await API.get<RawBooking[]>('/bookings');
      return data.map(({ _id, flight, ...rest }) => ({
        id: _id,
        flightId: flight,
        ...rest
      }));
    } catch {
      return rejectWithValue('Failed to fetch all bookings.');
    }
  }
);

// Fetch a single booking by ID
export const fetchBookingById = createAsyncThunk<Booking, string, { rejectValue: string }>(
  'bookings/fetchBookingById',
  async (bookingId, { rejectWithValue }) => {
    try {
      const { data } = await API.get<RawBooking>(`/bookings/${bookingId}`);
      const { _id, flight, ...rest } = data;
      return { id: _id, flightId: flight, ...rest };
    } catch {
      return rejectWithValue('Failed to fetch booking.');
    }
  }
);

// Create a booking
export const createBooking = createAsyncThunk<
  Booking,
  Omit<Booking, 'id' | 'status' | 'bookingDate'>,
  { rejectValue: string }
>(
  'bookings/createBooking',
  async ({ flightId, passengers, totalPrice }, { rejectWithValue }) => {
    try {
      const payload = { flight: flightId, passengers, totalPrice };
      const { data } = await API.post<RawBooking>('/bookings', payload);
      const { _id, flight, ...rest } = data;
      return { id: _id, flightId: flight, ...rest };
    } catch {
      return rejectWithValue('Failed to create booking.');
    }
  }
);

// Cancel a booking
export const cancelBooking = createAsyncThunk<Booking, string, { rejectValue: string }>(
  'bookings/cancelBooking',
  async (bookingId, { rejectWithValue }) => {
    try {
      const { data } = await API.put<RawBooking>(`/bookings/${bookingId}/cancel`);
      const { _id, flight, ...rest } = data;
      return { id: _id, flightId: flight, ...rest };
    } catch {
      return rejectWithValue('Failed to cancel booking.');
    }
  }
);

const bookingsSlice = createSlice({
  name: 'bookings',
  initialState,
  reducers: {
    setSelectedBooking: (state, action: PayloadAction<Booking | null>) => {
      state.selectedBooking = action.payload;
    },
    clearBookingsError: state => {
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchBookings.pending,   state => { state.loading = true;  state.error = null; })
      .addCase(fetchBookings.fulfilled, (state, { payload }) => {
        state.loading = false; state.bookings = payload;
      })
      .addCase(fetchBookings.rejected,  (state, { payload }) => {
        state.loading = false; state.error = payload!;
      })

      .addCase(fetchAllBookings.pending,   state => { state.loading = true;  state.error = null; })
      .addCase(fetchAllBookings.fulfilled, (state, { payload }) => {
        state.loading = false; state.bookings = payload;
      })
      .addCase(fetchAllBookings.rejected,  (state, { payload }) => {
        state.loading = false; state.error = payload!;
      })

      .addCase(fetchBookingById.pending,   state => { state.loading = true;  state.error = null; })
      .addCase(fetchBookingById.fulfilled, (state, { payload }) => {
        state.loading = false; state.selectedBooking = payload;
      })
      .addCase(fetchBookingById.rejected,  (state, { payload }) => {
        state.loading = false; state.error = payload!;
      })

      .addCase(createBooking.pending,   state => { state.loading = true;  state.error = null; })
      .addCase(createBooking.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.bookings.push(payload);
        state.selectedBooking = payload;
      })
      .addCase(createBooking.rejected,  (state, { payload }) => {
        state.loading = false; state.error = payload!;
      })

      .addCase(cancelBooking.pending,   state => { state.loading = true;  state.error = null; })
      .addCase(cancelBooking.fulfilled, (state, { payload }) => {
        state.loading = false;
        const idx = state.bookings.findIndex(b => b.id === payload.id);
        if (idx >= 0) state.bookings[idx] = payload;
        if (state.selectedBooking?.id === payload.id) {
          state.selectedBooking = payload;
        }
      })
      .addCase(cancelBooking.rejected,  (state, { payload }) => {
        state.loading = false; state.error = payload!;
      });
  }
});

export const { setSelectedBooking, clearBookingsError } = bookingsSlice.actions;
export default bookingsSlice.reducer;
