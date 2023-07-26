import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { RootState } from '../../app/store';

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    _id: "",
    name: "",
    avatar: {
      url: "",
      top: 0,
      left: 0
    },
    profession: "",
    bookmark: [], //Array of ids / object
    email: "",
    likesCount: 0,
    followersCount: 0,
    postsCount: 0,
    dislikesCount: 0,
    follows: [], //Array of ids / object
    isAdmin: false,
    date: "",
    isValidated: false,
    isCertified: false,
    about: "",
    contacts: [],
    notifications: []
  } as User,
  reducers: {
    updateData: (state : User, action : PayloadAction<User>) => {
      state = {...action.payload};
      return state;
    },
    updateUserNotification: (state : User, action : PayloadAction<UserNotification[]>) => {
      state.notifications = action.payload;
      return state;
    },
    logOutAction: (state: User) => {
      state = {
        _id: "",
        name: "",
        avatar: {
          url: "",
          top: 0,
          left: 0
        },
        profession: "",
        bookmark: [], //Array of ids / object
        email: "",
        likesCount: 0,
        followersCount: 0,
        postsCount: 0,
        dislikesCount: 0,
        follows: [], //Array of ids / object
        isAdmin: false,
        date: "",
        isValidated: false,
        isCertified: false,
        about: "",
        contacts: [],
        notifications: []
      }
      return state;
    }
  }
});

// Action creators are generated for each case reducer function
export const { updateData, updateUserNotification, logOutAction } = userSlice.actions
// Other code such as selectors can use the imported `RootState` type
export const selectUserData = (state: RootState) => state.userData
export default userSlice.reducer;