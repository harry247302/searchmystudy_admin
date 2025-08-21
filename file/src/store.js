import { configureStore } from '@reduxjs/toolkit';
import blogReducer from './slice/blogSlice';
import webinarReducer from './slice/webinarSlice';
import videoReducer from './slice/VideoSlice';
import authReducer from './slice/authSlice';
import serviceReducer from './slice/serviceSlice';
import counsellorReducer from './slice/counsellorSlice'
import abroadReducer from './slice/AbroadSlice'
import AbroadProvinceReducer from './slice/AbroadProvinceSlice'
import AbroadUniversityReducer from './slice/AbroadUniversitySlice'
import mbbsReducer from './slice/MbbsSlice'
const store = configureStore({
  reducer: {
      blog: blogReducer,
      webinar:webinarReducer,
      video:videoReducer,
      auth:authReducer,
      service:serviceReducer,
      counsellor:counsellorReducer,
      abroadStudy:abroadReducer,
      abroadProvince:AbroadProvinceReducer,
      abroadUniversity:AbroadUniversityReducer,
      mbbsStudy: mbbsReducer,
  },
 
});

export default store;
