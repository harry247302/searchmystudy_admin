import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { createSlice } from '@reduxjs/toolkit';

export const fetchMbbsCourse = createAsyncThunk(
  'mbbs/fetchMbbsCourse',
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

export const createMbbsCourse = createAsyncThunk(
    "mbbs/createMbbsCourse",
    async(data,thunkAPI)=>{
        try {
            const response = await axios.post("https://searchmystudy.com/api/admin/course",data)
            return response.data
        } catch (error) {
        return thunkAPI.rejectWithValue(error);
            
        }
    }
)

export const deleteMbbsCourse = createAsyncThunk(
  'mbbs/deleteMbbsCourse',
  async (ids, { rejectWithValue }) => {
    try {
      await axios.delete(`https://searchmystudy.com/api/admin/course`, {
        data: { ids }
      });
      return { ids }; // ✅ return the same ids
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateMbbsCourse = createAsyncThunk(
  'mbbs/updateMbbsCourse',  
   async ({ id, data }, thunkAPI) => {
    try {
        const response = await axios.put(`https://searchmystudy.com/api/admin/course/${id}`, data )
        return response?.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.message || 'Something went wrong');
    }
}

);

const mbbsCourseSlice = createSlice({
    name:'mbbsCourse',
    initialState:{
    loading:false,
    mbbsCourse:null,
    error:null
    },
    reducers:{},
    extraReducers:(builder)=>{
        builder.addCase(fetchMbbsCourse.pending,(state)=>{
            state.loading=true;
            state.error=null;
        })
        .addCase(fetchMbbsCourse.fulfilled,(state,action)=>{
            state.loading=false;
            state.mbbsCourse=action.payload;
        })
        .addCase(fetchMbbsCourse.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload;
        })
    }
})

export default mbbsCourseSlice.reducer;