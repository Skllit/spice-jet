import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import API from '../../api/axios';
import { Booking, BookingsState } from '../../types';

const initialState: BookingsState = {
  bookings: [],
  selectedBooking: null,
  loading: false,
  error: null,
};

// Fetch all bookings for user
const fetchBookings = createAsyncThunk<Booking[], void, { rejectValue: string }>(
  'bookings/fetchBookings',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await API.get<Booking[]>('/bookings/mine');
      return data;
    } catch {
      return rejectWithValue('Failed to fetch your bookings.');
    }
  }
);

// Fetch all bookings for admin
const fetchAllBookings = createAsyncThunk<Booking[], void, { rejectValue: string }>(
  'bookings/fetchAllBookings',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await API.get<Booking[]>('/bookings');
      return data;
    } catch {
      return rejectWithValue('Failed to fetch all bookings.');
    }
  }
);

// Fetch booking by ID
const fetchBookingById = createAsyncThunk<Booking, string, { rejectValue: string }>(
  'bookings/fetchBookingById',
  async (bookingId, { rejectWithValue }) => {
    try {
      const { data } = await API.get<Booking>(`/bookings/${bookingId}`);
      return data;
    } catch {
      return rejectWithValue('Failed to fetch booking.');
    }
  }
);

// Create a booking
const createBooking = createAsyncThunk<Booking, Omit<Booking, 'id' | 'status' | 'bookingDate'>, { rejectValue: string }>(
  'bookings/createBooking',
  async (bookingData, { rejectWithValue }) => {
    try {
      const payload = {
        flight: bookingData.flightId,
        passengers: bookingData.passengers,
        totalPrice: bookingData.totalPrice
      };
      const { data } = await API.post<Booking>('/bookings', payload);
      return data;
    } catch {
      return rejectWithValue('Failed to create booking.');
    }
  }
);

// Cancel a booking
const cancelBooking = createAsyncThunk<Booking, string, { rejectValue: string }>(
  'bookings/cancelBooking',
  async (bookingId, { rejectWithValue }) => {
    try {
      const { data } = await API.put<Booking>(`/bookings/${bookingId}/cancel`);
      return data;
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
    clearBookingsError: (state) => {
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchBookings.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBookings.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.bookings = payload;
      })
      .addCase(fetchBookings.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload!;
      })

      .addCase(fetchAllBookings.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllBookings.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.bookings = payload;
      })
      .addCase(fetchAllBookings.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload!;
      })

      .addCase(fetchBookingById.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.selectedBooking = payload;
      })

      .addCase(createBooking.fulfilled, (state, { payload }) => {
        state.bookings.push(payload);
        state.selectedBooking = payload;
      })

      .addCase(cancelBooking.fulfilled, (state, { payload }) => {
        const idx = state.bookings.findIndex(b => b.id === payload.id);
        if (idx >= 0) state.bookings[idx] = payload;
        if (state.selectedBooking?.id === payload.id) {
          state.selectedBooking = payload;
        }
      });
  }
});

export const { setSelectedBooking, clearBookingsError } = bookingsSlice.actions;
export default bookingsSlice.reducer;

export {
  fetchBookings,
  fetchAllBookings,
  fetchBookingById,
  createBooking,
  cancelBooking
};
