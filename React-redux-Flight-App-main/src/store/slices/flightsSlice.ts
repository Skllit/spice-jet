// src/store/slices/flightsSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { Flight, FlightsState, SearchFilters } from '../../types';

const API_URL = 'http://localhost:5000/api';

// The raw shape coming back from Mongo:
type RawFlight = Omit<Flight, 'id'> & { _id: string };

const initialState: FlightsState = {
  flights: [],
  selectedFlight: null,
  loading: false,
  error: null,
};

export const fetchFlights = createAsyncThunk<Flight[], void, { rejectValue: string }>(
  'flights/fetchFlights',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get<RawFlight[]>(`${API_URL}/flights`);
      return data.map(({ _id, ...rest }) => ({ id: _id, ...rest }));
    } catch {
      return rejectWithValue('Failed to fetch flights.');
    }
  }
);

export const searchFlights = createAsyncThunk<Flight[], SearchFilters, { rejectValue: string }>(
  'flights/searchFlights',
  async (filters, { rejectWithValue }) => {
    try {
      let qs = '';
      if (filters.origin)      qs += `origin=${filters.origin}&`;
      if (filters.destination) qs += `destination=${filters.destination}&`;
      const { data } = await axios.get<RawFlight[]>(`${API_URL}/flights?${qs}`);
      let flights = data.map(({ _id, ...rest }) => ({ id: _id, ...rest }));

      if (filters.departureDate) {
        const sd = new Date(filters.departureDate).toISOString().split('T')[0];
        flights = flights.filter(
          f => new Date(f.departureDate).toISOString().split('T')[0] === sd
        );
      }
      return flights;
    } catch {
      return rejectWithValue('Search failed.');
    }
  }
);

export const addFlight = createAsyncThunk<Flight, Omit<Flight, 'id'>, { rejectValue: string }>(
  'flights/addFlight',
  async (flightData, { rejectWithValue }) => {
    try {
      const { data } = await axios.post<RawFlight>(`${API_URL}/flights`, flightData);
      const { _id, ...rest } = data;
      return { id: _id, ...rest };
    } catch {
      return rejectWithValue('Failed to add flight.');
    }
  }
);

export const updateFlight = createAsyncThunk<Flight, Flight, { rejectValue: string }>(
  'flights/updateFlight',
  async (flightData, { rejectWithValue }) => {
    try {
      const { data } = await axios.put<RawFlight>(`${API_URL}/flights/${flightData.id}`, flightData);
      const { _id, ...rest } = data;
      return { id: _id, ...rest };
    } catch {
      return rejectWithValue('Failed to update flight.');
    }
  }
);

export const deleteFlight = createAsyncThunk<string, string, { rejectValue: string }>(
  'flights/deleteFlight',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/flights/${id}`);
      return id;
    } catch {
      return rejectWithValue('Failed to delete flight.');
    }
  }
);

const flightsSlice = createSlice({
  name: 'flights',
  initialState,
  reducers: {
    setSelectedFlight: (state, action: PayloadAction<Flight | null>) => {
      state.selectedFlight = action.payload;
    },
    clearFlightsError: state => {
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchFlights.pending,   state => { state.loading = true;  state.error = null; })
      .addCase(fetchFlights.fulfilled, (state, { payload }) => {
        state.loading = false; state.flights = payload;
      })
      .addCase(fetchFlights.rejected,  (state, { payload }) => {
        state.loading = false; state.error = payload!;
      })

      .addCase(searchFlights.pending,   state => { state.loading = true;  state.error = null; })
      .addCase(searchFlights.fulfilled, (state, { payload }) => {
        state.loading = false; state.flights = payload;
      })
      .addCase(searchFlights.rejected,  (state, { payload }) => {
        state.loading = false; state.error = payload!;
      })

      .addCase(addFlight.fulfilled,     (state, { payload }) => {
        state.flights.push(payload);
      })

      .addCase(updateFlight.fulfilled,  (state, { payload }) => {
        const idx = state.flights.findIndex(f => f.id === payload.id);
        if (idx >= 0) state.flights[idx] = payload;
        if (state.selectedFlight?.id === payload.id) {
          state.selectedFlight = payload;
        }
      })

      .addCase(deleteFlight.fulfilled,  (state, { payload }) => {
        state.flights = state.flights.filter(f => f.id !== payload);
        if (state.selectedFlight?.id === payload) {
          state.selectedFlight = null;
        }
      });
  }
});

export const { setSelectedFlight, clearFlightsError } = flightsSlice.actions;
export default flightsSlice.reducer;
