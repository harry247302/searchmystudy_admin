import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { createSlice } from '@reduxjs/toolkit';

export const fetchAbroadCourse = createAsyncThunk(
  'abroad/fetchAbroadCourse',
    async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("https://searchmystudy.com/api/admin/course");
      // console.log(response?.data,"++++++++++++==");
      
      return response.data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Something went wrong'
      );
    }
    }
);

export const deleteStudyCourse = createAsyncThunk(
  'abroad/deleteStudyCourse',
    async (ids, { rejectWithValue }) => {
      console.log(ids);
      
        if (!ids || ids.length === 0) {
        return rejectWithValue({ message: "No Course IDs provided" });
        }
        try {
        const response = await axios.delete(`https://searchmystudy.com/api/admin/course`, {
          data:{ids}
        });
        return response.data;
        } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const createAbroadCourse = createAsyncThunk(
  'abroad/createAbroadCourse',
  async (abroadData, thunkAPI) => {
    try {
      const response = await fetch("https://searchmystudy.com/api/admin/course", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(abroadData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return thunkAPI.rejectWithValue(errorData);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message || 'Something went wrong');
    }
  }
);

export const updateStudyCourse = createAsyncThunk(
  'abroad/updateStudyCourse',  
    async ({ id, data }, thunkAPI) => {
        try {
        const response = await fetch(`https://searchmystudy.com/api/admin/course/${id}`, {
            method: 'PUT',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
    
        if (!response.ok) {
            const errorData = await response.json();
            return thunkAPI.rejectWithValue(errorData);
        }
    
        const updatedData = await response.json();
        return updatedData;
        } catch (error) {
        return thunkAPI.rejectWithValue(error.message || 'Something went wrong');
        }
    }
);

export const abroadCourseSlice = createSlice({
  name: 'abroad',
    initialState: {
        AbroadCourses: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAbroadCourse.pending, (state) => {
            state.loading = true;
            state.error = null;
            })
            .addCase(fetchAbroadCourse.fulfilled, (state, action) => {
            state.studyAbroad = action.payload;
            state.loading = false;
            })
            .addCase(fetchAbroadCourse.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || 'Failed to fetch abroad study data';
            })
            .addCase(deleteStudyCourse.pending, (state) => {
            state.loading = true;
            state.error = null;
            })
            .addCase(deleteStudyCourse.fulfilled, (state, action) => {
            state.studyAbroad = state.studyAbroad.filter(item => !action.payload.ids.includes(item._id));
            state.loading = false;
            })
            .addCase(deleteStudyCourse.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || 'Failed to delete abroad study data';
            })
            .addCase(createAbroadCourse.pending, (state) => {
            state.loading = true;
            state.error = null;
            })
            .addCase(createAbroadCourse.fulfilled, (state, action) => {
            state.studyAbroad.push(action.payload);
            state.loading = false;
            })
            .addCase(createAbroadCourse.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || 'Failed to create abroad study data';
            });
        }
});

export default abroadCourseSlice.reducer;