import { configureStore } from '@reduxjs/toolkit';
import notificationsReducer from './services/notificationSlice.js';

export const store = configureStore({
  reducer: {
    notifications: notificationsReducer,
    // Add other reducers here as needed
  }
});