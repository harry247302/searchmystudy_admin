import { configureStore } from '@reduxjs/toolkit';
import blogReducer from './slice/blogSlice';
import webinarReducer from './slice/webinarSlice';
import authReducer from './slice/authSlice';
const store = configureStore({
  reducer: {
      blog: blogReducer,
      webinar:webinarReducer,
      auth:authReducer

  },
 
});

export default store;
