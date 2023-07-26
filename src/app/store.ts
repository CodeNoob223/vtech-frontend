import { configureStore } from '@reduxjs/toolkit';
import userReducer from "../features/userData/userSlice";
import pageNotificationReducer from '../features/pageNotification/pageNotificationSlice';

const store = configureStore({
  reducer: {
    userData: userReducer,
    pageNotification: pageNotificationReducer
  }
});

export default store;
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch


