import { PayloadAction, createSlice } from '@reduxjs/toolkit'

export const pageNotificationSlice = createSlice({
  name: 'pageNotification',
  initialState: {
    show: false,
    message: "",
    type: "bg-error" 
  } as PageNotification,
  reducers: {
    updateNotification: (state : PageNotification, action : PayloadAction<PageNotification>) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state = action.payload;
      return state;
    },
    closeNotification: (state : PageNotification) => {
      state.show = false;
      return state;
    }
  }
});

// Action creators are generated for each case reducer function
export const { closeNotification, updateNotification } = pageNotificationSlice.actions

export default pageNotificationSlice.reducer;