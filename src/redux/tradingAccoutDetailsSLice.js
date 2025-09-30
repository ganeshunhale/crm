import { createSlice } from "@reduxjs/toolkit";

const initialState = {};

const tradePositionSlice = createSlice({
  name: "tradingAccountDetails",
  initialState,
  reducers: {
    addTradingAccountDetails: (state, action) => {
      for (const obj of action.payload) {
        for (const [id, account] of Object.entries(obj)) {
          state[id] = account;
        }
      }
    },
    updateTradingAccountDetails: (state, action) => {
      if(!action.payload?.result?.login_id) return;
      state[action.payload?.result?.login_id] = action.payload.result;
    },
  },
});

export const { addTradingAccountDetails, updateTradingAccountDetails } = tradePositionSlice.actions;

export default tradePositionSlice.reducer;
