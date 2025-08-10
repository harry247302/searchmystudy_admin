import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchWebinar = createAsyncThunk(
  'webinar/fetchWebinar',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('https://searchmystudy.com/api/admin/webinar');
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Something went wrong'
      );
    }
  }
);

const webinarSlice = createSlice({
  name: 'webinar',
  initialState: {
    webinars: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWebinar.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWebinar.fulfilled, (state, action) => {
        state.loading = false;
        state.webinars = action.payload;
      })
      .addCase(fetchWebinar.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default webinarSlice.reducer;
