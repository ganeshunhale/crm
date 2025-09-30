// snackbarSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  open: false,
  message: "",
  severity: "success", // "success" | "error" | "warning" | "info"
  backgroundColor:'rgba(127, 132, 138, 0.5)'
};

const snackbarSlice = createSlice({
  name: "snackbar",
  initialState,
  reducers: {
    showSnackbar: (state, action) => {
      state.open = true;
      state.message = action.payload.message;
      state.severity = action.payload.severity || "success";
      state.backgroundColor = action.payload.backgroundColor || "rgba(127, 132, 138, 0.5)"
      state.position = action.payload.position ||  {vertical: "bottom", horizontal: "right"}
    },
    hideSnackbar: (state) => {
      state.open = false;
      state.message = "";
    },
  },
});

export const { showSnackbar, hideSnackbar } = snackbarSlice.actions;
export default snackbarSlice.reducer;
