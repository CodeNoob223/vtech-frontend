import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { v4 as uuidv4 } from 'uuid';

export const pageNotificationSlice = createSlice({  
  name: 'pageNotification',
  initialState: [] as PageNotification[],
  reducers: {
    updateNotification: (state : PageNotification[], action : PayloadAction<PageNotification>) => {
      const newNotif : PageNotification = {
        id: uuidv4(),
        show: action.payload.show,
        type: action.payload.type,
        message: action.payload.message
      }
      state.push(newNotif);
      return state;
    },
    closeNotification: (state : PageNotification[], action : PayloadAction<string>) => {
      state = state.filter(notif => action.payload !== notif.id);
      return state;
    }
  }
});

// Action creators are generated for each case reducer function
export const { closeNotification, updateNotification } = pageNotificationSlice.actions

export default pageNotificationSlice.reducer;