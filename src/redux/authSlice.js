import { createSlice } from "@reduxjs/toolkit";

const initialState = { 
  isLoggedIn: false,
  data: null,  
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginAction: (state,action) => { 
      state.isLoggedIn = action.payload.isLoggedIn,
      state.data = action.payload.data
    },
    getAccessTokenAction:(state,action)=>{
state.data.refresh_token = action.payload.access_token
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.data = null;
    }
    
  },
});

export const { loginAction ,getAccessTokenAction,logout} = authSlice.actions;
export default authSlice.reducer;
