import { createSlice } from '@reduxjs/toolkit';


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
 
      if (!state.items.some(item => item.id === action.payload.id)) {
        state.items.push(action.payload);
       
        localStorage.setItem('eventNotifications', JSON.stringify(state.items));
      
        state.count = state.items.length;
      }
    },
    removeNotification: (state, action) => {
    
      state.items = state.items.filter(item => item.id !== action.payload);
     
      localStorage.setItem('eventNotifications', JSON.stringify(state.items));
    
      state.count = state.items.length;
    },
    clearAllNotifications: (state) => {
      
      state.items = [];
     
      localStorage.removeItem('eventNotifications');
     
      state.count = 0;
    }
  }
});


export const { addNotification, removeNotification, clearAllNotifications } = notificationsSlice.actions;


export const selectNotifications = (state) => state.notifications.items;
export const selectNotificationCount = (state) => state.notifications.count;


export default notificationsSlice.reducer;