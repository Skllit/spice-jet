// src/store/slices/bookingsSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import API from '../../api/axios';
import { Booking, BookingsState } from '../../types';

// Mongoose returns _id; we map it to id for our Redux state.
type RawBooking = Omit<Booking, 'id'> & { _id: string };

const initialState: BookingsState = {
  bookings: [],
  selectedBooking: null,
  loading: false,
  error: null,
};

// — fetch bookings for the current user
export const fetchBookings = createAsyncThunk<Booking[], void, { rejectValue: string }>(
  'bookings/fetchBookings',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await API.get<RawBooking[]>('/bookings/mine');
      return data.map(({ _id, ...rest }) => ({ id: _id, ...rest }));
    } catch {
      return rejectWithValue('Failed to fetch your bookings.');
    }
  }
);

// — fetch all bookings (admin)
export const fetchAllBookings = createAsyncThunk<Booking[], void, { rejectValue: string }>(
  'bookings/fetchAllBookings',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await API.get<RawBooking[]>('/bookings');
      return data.map(({ _id, ...rest }) => ({ id: _id, ...rest }));
    } catch {
      return rejectWithValue('Failed to fetch all bookings.');
    }
  }
);

// — fetch a single booking by ID
export const fetchBookingById = createAsyncThunk<Booking, string, { rejectValue: string }>(
  'bookings/fetchBookingById',
  async (bookingId, { rejectWithValue }) => {
    try {
      const { data } = await API.get<RawBooking>(`/bookings/${bookingId}`);
      const { _id, ...rest } = data;
      return { id: _id, ...rest };
    } catch {
      return rejectWithValue('Failed to fetch booking.');
    }
  }
);

// — create a new booking
export const createBooking = createAsyncThunk<
  Booking,
  Omit<Booking, 'id' | 'status' | 'bookingDate'>,
  { rejectValue: string }
>(
  'bookings/createBooking',
  async (bookingData, { rejectWithValue }) => {
    try {
      const payload = {
        flight: bookingData.flightId,
        passengers: bookingData.passengers,
        totalPrice: bookingData.totalPrice,
      };
      const { data } = await API.post<RawBooking>('/bookings', payload);
      const { _id, ...rest } = data;
      return { id: _id, ...rest };
    } catch {
      return rejectWithValue('Failed to create booking.');
    }
  }
);

// — cancel an existing booking
export const cancelBooking = createAsyncThunk<Booking, string, { rejectValue: string }>(
  'bookings/cancelBooking',
  async (bookingId, { rejectWithValue }) => {
    try {
      const { data } = await API.put<RawBooking>(`/bookings/${bookingId}/cancel`);
      const { _id, ...rest } = data;
      return { id: _id, ...rest };
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
      // fetchBookings
      .addCase(fetchBookings.pending, state => { state.loading = true; state.error = null; })
      .addCase(fetchBookings.fulfilled, (state, { payload }) => {
        state.loading = false; state.bookings = payload;
      })
      .addCase(fetchBookings.rejected, (state, { payload }) => {
        state.loading = false; state.error = payload!;
      })

      // fetchAllBookings
      .addCase(fetchAllBookings.pending, state => { state.loading = true; state.error = null; })
      .addCase(fetchAllBookings.fulfilled, (state, { payload }) => {
        state.loading = false; state.bookings = payload;
      })
      .addCase(fetchAllBookings.rejected, (state, { payload }) => {
        state.loading = false; state.error = payload!;
      })

      // fetchBookingById
      .addCase(fetchBookingById.pending, state => { state.loading = true; state.error = null; })
      .addCase(fetchBookingById.fulfilled, (state, { payload }) => {
        state.loading = false; state.selectedBooking = payload;
      })
      .addCase(fetchBookingById.rejected, (state, { payload }) => {
        state.loading = false; state.error = payload!;
      })

      // createBooking
      .addCase(createBooking.pending, state => { state.loading = true; state.error = null; })
      .addCase(createBooking.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.bookings.push(payload);
        state.selectedBooking = payload;
      })
      .addCase(createBooking.rejected, (state, { payload }) => {
        state.loading = false; state.error = payload!;
      })

      // cancelBooking
      .addCase(cancelBooking.pending, state => { state.loading = true; state.error = null; })
      .addCase(cancelBooking.fulfilled, (state, { payload }) => {
        state.loading = false;
        const idx = state.bookings.findIndex(b => b.id === payload.id);
        if (idx >= 0) state.bookings[idx] = payload;
        if (state.selectedBooking?.id === payload.id) {
          state.selectedBooking = payload;
        }
      })
      .addCase(cancelBooking.rejected, (state, { payload }) => {
        state.loading = false; state.error = payload!;
      });
  }
});

export const { setSelectedBooking, clearBookingsError } = bookingsSlice.actions;
export default bookingsSlice.reducer;
