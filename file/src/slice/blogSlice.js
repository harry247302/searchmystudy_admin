import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { createSlice } from '@reduxjs/toolkit';

export const fetchBlog = createAsyncThunk(
  'blog/fetchBlog',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("https://searchmystudy.com/api/admin/Blog");
      return response.data; // returned data will be available in fulfilled reducer
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Something went wrong'
      );
    }
  }
);

const blogSlice = createSlice({
  name: 'blog',
  initialState: {
    blogs: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBlog.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBlog.fulfilled, (state, action) => {
        state.loading = false;
        state.blogs = action.payload;
      })
      .addCase(fetchBlog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default blogSlice.reducer;
