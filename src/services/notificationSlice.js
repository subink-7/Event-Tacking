import { createSlice } from '@reduxjs/toolkit';

// Try to get initial notifications from localStorage
const getInitialNotifications = () => {
  try {
    const savedNotifications = localStorage.getItem('eventNotifications');
    return savedNotifications ? JSON.parse(savedNotifications) : [];
  } catch (error) {
    console.error('Error loading notifications from localStorage:', error);
    return [];
  }
};

const initialState = {
  items: getInitialNotifications(),
  count: getInitialNotifications().length
};

export const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification: (state, action) => {
      // Add notification if it doesn't already exist
      if (!state.items.some(item => item.id === action.payload.id)) {
        state.items.push(action.payload);
        // Update localStorage
        localStorage.setItem('eventNotifications', JSON.stringify(state.items));
        // Update count
        state.count = state.items.length;
      }
    },
    removeNotification: (state, action) => {
      // Remove notification by id
      state.items = state.items.filter(item => item.id !== action.payload);
      // Update localStorage
      localStorage.setItem('eventNotifications', JSON.stringify(state.items));
      // Update count
      state.count = state.items.length;
    },
    clearAllNotifications: (state) => {
      // Clear all notifications
      state.items = [];
      // Update localStorage
      localStorage.removeItem('eventNotifications');
      // Reset count
      state.count = 0;
    }
  }
});

// Export actions
export const { addNotification, removeNotification, clearAllNotifications } = notificationsSlice.actions;

// Export selectors
export const selectNotifications = (state) => state.notifications.items;
export const selectNotificationCount = (state) => state.notifications.count;

// Export reducer
export default notificationsSlice.reducer;