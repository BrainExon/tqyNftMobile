import {createSlice} from '@reduxjs/toolkit';

interface UserState {
  user: {
    phone: string | null; // Define the type of phone property
  };
}

const initialState: UserState = {
  user: {
    phone: null,
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
      };
      //console.log(`[userSlice] state: ${JSON.stringify(state)}`);
    },
    clearUser: state => {
      state.user = {
        phone: null,
      };
    },
  },
});

export const {setUser, clearUser} = userSlice.actions;
export default userSlice.reducer;
