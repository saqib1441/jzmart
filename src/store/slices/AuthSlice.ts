import { createSlice } from "@reduxjs/toolkit";

export type TempDataType = {
  name?: string;
  email: string;
  password?: string;
  purpose: string;
};

type InitialStateType = {
  tempData: Partial<TempDataType>;
  isLoggedIn: boolean;
};

const initialState: InitialStateType = {
  tempData: {
    name: "",
    email: "",
    password: "",
    purpose: "",
  },
  isLoggedIn: false,
};

const AuthSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setTempData: (state, action) => {
      state.tempData = action.payload;
    },
    clearTempData: (state) => {
      state.tempData = {};
    },
    setIsLoggedIn: (state, action) => {
      state.isLoggedIn = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setTempData, clearTempData, setIsLoggedIn } = AuthSlice.actions;

export default AuthSlice.reducer;
