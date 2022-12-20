import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

export interface UserState {
  email?: string;
  token?: string;
  username?: string;
  bio?: string;
  image?: string;
}

const initialState: { logedIn: boolean; user: UserState } = {
  logedIn: false,
  user: {},
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<UserState>) => {
      Object.assign(state, { logedIn: true, user: action.payload });
    },
    logout: (state) => {
      Object.assign(state, { logedIn: false, user: {} });
    },
  },
});

export const { login, logout } = userSlice.actions;

export const getUser = (state: RootState) => state.user.user;

export default userSlice.reducer;
