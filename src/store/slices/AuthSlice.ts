import { createSlice } from "@reduxjs/toolkit";

export type TempDataType = {
  name?: string;
  email: string;
  password?: string;
  purpose: string;
};

type InitialStateType = {
  tempData: Partial<TempDataType>;
};

const initialState: InitialStateType = {
  tempData: {
    name: "",
    email: "",
    password: "",
    purpose: "",
  },
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
  },
});

// Action creators are generated for each case reducer function
export const { setTempData, clearTempData } = AuthSlice.actions;

export default AuthSlice.reducer;
