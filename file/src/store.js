import { configureStore } from '@reduxjs/toolkit';
import blogReducer from './slice/blogSlice';
import webinarReducer from './slice/webinarSlice';
const store = configureStore({
  reducer: {
      blog: blogReducer,
      webinar:webinarReducer
  },
 
});

export default store;
