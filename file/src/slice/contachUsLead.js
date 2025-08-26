import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { createSlice } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';

export const fetchContactUsLead = createAsyncThunk(
  'lead/fetchContactUsLead',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("https://searchmystudy.com/api/admin/contactlead");
      console.log(response);
      
      toast.success("Fetch Lead Successfully")
      return response.data; // returned data will be available in fulfilled reducer
      
    } catch (error) {
        toast.error("Failed to fetch lead")
      return rejectWithValue(
        error.response?.data?.message || 'Something went wrong'
      );
    }
  }
);

export const createContactUsLead = createAsyncThunk(
    'lead/createContactUsLead',
    async(data,thunkAPI)=>{
        try {
            const response = await axios.post("https://searchmystudy.com/api/admin/contactlead",data);
            toast.success("Lead created successfully")
            return response.data
        } catch (error) {
            toast.error("Failed to create lead")
            return thunkAPI.rejectWithValue(error)
        }
    }
);

export const updateContactUsLead = createAsyncThunk(
    "lead/updateContactUsLead",
    async({id,data},rejectWithValue)=>{
        try {
            const response = await axios.put(`https://searchmystudy.com/api/admin/contactlead/${id}`,data);
            toast.success("Update Lead Successfully")
            return response?.data
        } catch (error) {
            toast.error("Failed to update lead")   
         return rejectWithValue(error)
        }
    }
);

export const deleteContactUsLead = createAsyncThunk(
    "lead/deleteContactUsLead",
    async(ids,{rejectWithValue})=>{
         if (!ids || ids.length === 0) {
      return rejectWithValue({ message: "No blog IDs provided" });
    }
    try {
        const response = await axios.delete("https://searchmystudy.com/api/admin/contactlead",{data:{ids}});
        toast.success("Delete lead Successfully");
        return response?.data;
    } catch (error) {
        toast.error("Failed to delete lead")
        return rejectWithValue(error);
    }
    }
);

const contactUsleadSlice = createSlice({
    name:"contactUsLead",
    initialState:{
        contactUsLeads:null,
    loading:false,
    error:null,
    },
    reducers:{},
    extraReducers:(builder)=>{
        builder.addCase(fetchContactUsLead.pending,(state)=>{
            state.loading=true;
            state.error=null;
        })
        .addCase(fetchContactUsLead.fulfilled,(state,action)=>{
            state.loading=false;
            state.contactUsLeads=action.payload;
        })
        .addCase(fetchContactUsLead.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload;
        })
    }
})

export default contactUsleadSlice.reducer;