import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

// Create Counsellor
export const createCounsellor = createAsyncThunk(
    'counsellor/createCounsellor',
    async(data,thunkAPI) => {
        try {
            console.log("Sending Counsellor data", data);
            const response = await axios.post("https://searchmystudy.com/api/admin/CreateCounsellor",data);

            return response.data;
            
        } catch (error) {
            console.log("Fetch error", error.message);
            return thunkAPI.rejectWithValue(error.message)
        }
    }
);

// fetch Counsellors
export const fetchCounsellor = createAsyncThunk(
    'counsellor/fetchCounsellor',
    async (_,{rejectWithValue}) => {
        try {
            const response = await axios.get("https://searchmystudy.com/api/admin/Counsellor/all");
            return response?.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Something went wrong"
            );
        }
    }
);

// Delete Counsellor
export const deleteCounsellor = createAsyncThunk(
    'counsellor/deleteCounsellor',
    async(id,{ rejectWithValue })=>{
        try {
            const response = await axios.delete(`https://searchmystudy.com/api/admin/DeleteCounsellors/${id}`)
            fetchCounsellor();
            return response?.data;
        } catch (error) {
            return rejectWithValue(error?.response?.data || error.message)
        }
    }
);
// update Counsellor
export const updateCounsellor = createAsyncThunk(
    'counsellor/updateCounsellor',
    async({id,data},{ rejectWithValue })=>{
        try {
            const response = await axios.delete(`https://searchmystudy.com/api/admin/UpdateCounsellors/${id}`,data)
            fetchCounsellor()
            return response?.data;
        } catch (error) {
            return rejectWithValue(error?.response?.data || error.message)
        }
    }
);

const counsellorSlice = createSlice({
    name:'counsellor',
    initialState:{
        counsellors:[],
        error:null,
        loading:null,
    },
    reducers:{},
    extraReducers: (builder)=>{
        builder.addCase(fetchCounsellor.pending, (state)=>{
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchCounsellor.fulfilled, (state,action)=>{
            state.loading = false;
            state.counsellors = action.payload;
        })
        .addCase(fetchCounsellor.rejected,(state,action)=>{
            state.loading = false;
            state.error = action.payload;
        });
    },
});

export default counsellorSlice.reducer;