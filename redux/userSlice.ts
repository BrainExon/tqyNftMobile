import {createSlice} from '@reduxjs/toolkit';
interface UserState {
  user: {
    phone: string | null;
    role: string | null; // Define the type of role property
    userId: string | null; // Define the type of role property
  };
}
const initialState: UserState = {
  user: {
    phone: null,
    role: null,
    userId: null,
  },
};
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = {
        ...state.user,
        phone: action.payload.phone,
        role: action.payload.role,
        userId: action.payload.userId,
      };
    },
    clearUser: state => {
      state.user = {
        phone: null,
        role: null,
      };
    },
  },
});
export const getUserState = state => state.userSlice.user;
export const {setUser, clearUser} = userSlice.actions;
export default userSlice.reducer;
