import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { GET_ACCOUNT_DETAILS } from "../API/ApiServices";

const initialState = {
  isLoggedIn: false,
  data: null,
  activeId: null,
  accountType: null,
  subAccounts: [],
  subAccountsErrors: null,
  subAccountsLoading: false,
  subAccountsDemo: [],
  subAccountsDemoErrors: null,
  subAccountsDemoLoading: false
};

// ---- Thunks ----
export const fetchAccountDetails = createAsyncThunk(
  "auth/account-details",
  async (type) => {
    const res = await GET_ACCOUNT_DETAILS(type);
    return res?.data?.result || [];
  }
);
export const fetchAccountDemoDetails = createAsyncThunk(
  "auth/account-demo-details",
  async () => {
    const res = await GET_ACCOUNT_DETAILS();
    return res?.data?.result || [];
  }
);


// ----Slice -----
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginAction: (state, action) => {
      state.isLoggedIn = action.payload.isLoggedIn;
      state.data = action.payload.data;
      const activeId = action.payload.data?.data?.active_id || null;
      state.activeId = activeId;

      const realIds = Array.from(state.data?.client_MT5_id?.real_ids || []);
      const demoIds = Array.from(state.data?.client_MT5_id?.demo_ids || []);

      if (realIds.includes(activeId)) {
        state.accountType = 'Real';
      } else if (demoIds.includes(activeId)) {
        state.accountType = 'Demo';
      } else {
        state.accountType = null;
      }
    },

    getAccessTokenAction: (state, action) => {
      state.data.refresh_token = action.payload.access_token;
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.data = null;
      state.activeId = null;
      state.accountType = null;
    },
    updateBalance: (state, action) => {
      // expects payload: { balance: number }
      if (state.data && typeof action.payload.balance === 'number') {
        state.data.balance = action.payload.balance;
      }
    },
    updateActiveId: (state, action) => {
      const id = action.payload;
      state.activeId = action.payload;
      if (state.data?.data) state.data.data.active_id = action.payload;
      console.log({ dd: state.data })
      const realIds = Array.from(state.data?.client_MT5_id?.real_ids || []);
      const demoIds = Array.from(state.data?.client_MT5_id?.demo_ids || []);

      console.log({ realIds: state.data?.client_MT5_id?.real_ids, realIdsss: realIds, id })
      if (realIds.includes(id)) {
        state.accountType = 'Real';
      } else if (demoIds.includes(id)) {
        state.accountType = 'Demo';
      } else {
        state.accountType = null;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAccountDetails.pending, (state) => {
        state.subAccountsLoading = true;
        state.subAccountsErrors = null;
      })
      .addCase(fetchAccountDetails.fulfilled, (state, action) => {
        state.subAccountsLoading = false;
        state.subAccounts = action.payload;
      })
      .addCase(fetchAccountDetails.rejected, (state, action) => {
        state.subAccountsLoading = false;
        state.subAccountsErrors = action.error.message;
      })
      // Demo Accounts
      .addCase(fetchAccountDemoDetails.pending, (state) => {
        state.subAccountsDemoLoading = true;
        state.subAccountsDemoErrors = null;
      })
      .addCase(fetchAccountDemoDetails.fulfilled, (state, action) => {
        state.subAccountsDemoLoading = false;
        state.subAccountsDemo = action.payload;
      })
      .addCase(fetchAccountDemoDetails.rejected, (state, action) => {
        state.subAccountsLoading = false;
        state.subAccountsErrors = action.error.message;
      })
  }
});

export const { loginAction, getAccessTokenAction, logout, updateBalance, updateActiveId } = authSlice.actions;
export default authSlice.reducer;
