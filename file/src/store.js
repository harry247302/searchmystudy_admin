import { configureStore } from '@reduxjs/toolkit';
import blogReducer from './slice/blogSlice';
import webinarReducer from './slice/webinarSlice';
import videoReducer from './slice/VideoSlice';
import mediaReducer from './slice/MediaSlice';
import authReducer from './slice/authSlice';
import serviceReducer from './slice/serviceSlice';
import counsellorReducer from './slice/counsellorSlice'
import abroadReducer from './slice/AbroadSlice'
import AbroadProvinceReducer from './slice/AbroadProvinceSlice'
import AbroadUniversityReducer from './slice/AbroadUniversitySlice'
import abroadCourseReducer from './slice/AbroadCourseSlice'
import mbbsReducer from './slice/MbbsSlice'
import mbbsUniversityReducer from './slice/mbbsUniversity'
import mbbsCourseReducer from './slice/MbbsCourse'
import contactUsLeadReducer from './slice/contachUsLead'
const store = configureStore({
  reducer: {
      blog: blogReducer,
      webinar:webinarReducer,
      video:videoReducer,
      media:mediaReducer,
      auth:authReducer,
      service:serviceReducer,
      counsellor:counsellorReducer,
      abroadStudy:abroadReducer,
      abroadProvince:AbroadProvinceReducer,
      abroadUniversity:AbroadUniversityReducer,
      abroadCourse: abroadCourseReducer,
      mbbsStudy: mbbsReducer,
      mbbsUniversity:mbbsUniversityReducer, 
      mbbsCourse:mbbsCourseReducer, 
      contactUsLead:contactUsLeadReducer, 
  },
 
});

export default store;
