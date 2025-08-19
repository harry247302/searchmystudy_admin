import { configureStore } from '@reduxjs/toolkit';
import blogReducer from './slice/blogSlice';
import webinarReducer from './slice/webinarSlice';
import authReducer from './slice/authSlice';
import serviceReducer from './slice/serviceSlice';
import counsellorReducer from './slice/counsellorSlice'
import abroadReducer from './slice/AbroadSlice'
const store = configureStore({
  reducer: {
      blog: blogReducer,
      webinar:webinarReducer,
      auth:authReducer,
      service:serviceReducer,
      counsellor:counsellorReducer,
      abroadStudy:abroadReducer
  },
 
});

export default store;
