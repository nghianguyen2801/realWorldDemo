import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';

export interface UserState {
    email?: string,
    token?:string,
    username?: string,
    bio?: string,
    image?: string
  }

const initialState: UserState = {};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<UserState>) => {
        Object.assign(state, action.payload)
    },
    logout: (state) => {
      state = {};
    },
  }
});

export const { login, logout } = userSlice.actions;

export const getUser = (state: RootState) => state.user;

export default userSlice.reducer;
