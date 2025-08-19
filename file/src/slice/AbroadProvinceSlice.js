import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { createSlice } from '@reduxjs/toolkit';

export const fetchAbroadProvince = createAsyncThunk(
    'abroad/fetchAbroadProvince',
    async(__,{rejectWithValue})=>{
        try {
            const response = await axios.get("https://searchmystudy.com/api/admin/province");
      return response?.data
        } catch (error) {
            return rejectWithValue(
        error.response?.data?.message || 'Something went wrong'
      );
        }
    }
);

export const createAbroadProvince = createAsyncThunk(
  'abroad/createAbroadProvince',
  async (abroadData, thunkAPI) => {
    try {
      const response = await fetch("https://searchmystudy.com/api/admin/province", {
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

export const deleteAbroadProvince = createAsyncThunk(
  'abroad/deleteAbroadProvince',
    async (ids, { rejectWithValue }) => {
        if (!ids || ids.length === 0) {
        return rejectWithValue({ message: "No abroad study IDs provided" });
        }
        try {
        const response = await axios.delete(`https://searchmystudy.com/api/admin/countries`, {
          data:{ids}
        });
        return response.data;
        } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const updateAbroadProvince = createAsyncThunk(
  'abroad/updateAbroadProvince',  
    async ({ id, data }, thunkAPI) => {
        try {
        const response = await fetch(`https://searchmystudy.com/api/admin/province/${id}`, {
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

export const abroadProvinceSlice = createSlice({
    name:'abroadProvince',
    initialState:{
        abroadProvince:[],
        loading:false,
        error:false,
    },
    reducers:{},
    extraReducers:(builder)=>{
        builder.addCase(fetchAbroadProvince.pending,(state)=>{
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchAbroadProvince.fulfilled,(state,action)=>{
            state.abroadProvince = action.payload;
            state.loading = false;
        })
        .addCase(fetchAbroadProvince.rejected,(state,action)=>{
            state.loading = false;
            state.error = action.payload;
        })
    }
})