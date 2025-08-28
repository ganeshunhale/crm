// positionSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  OPEN_POSITION_API,
  PENDING_ORDER_API,
  CLOSED_ORDER_API,
} from "../API/ApiServices";

// ---- Thunks ----
export const fetchOpenPositions = createAsyncThunk(
  "positions/fetchOpen",
  async (demo_id) => {
    const res = await OPEN_POSITION_API(demo_id);
    return res?.data?.result || [];
  }
);

export const fetchPendingOrders = createAsyncThunk(
  "positions/fetchPending",
  async (demo_id) => {
    const res = await PENDING_ORDER_API(demo_id);
    return res?.data?.result || [];
  }
);

export const fetchClosedOrders = createAsyncThunk(
  "positions/fetchClosed",
  async (data) => {
    const res = await CLOSED_ORDER_API(data);
    return res?.data?.result || [];
  }
);

// ---- Slice ----
const positionSlice = createSlice({
  name: "positions",
  initialState: {
    open: [],
    pending: [],
    closed: [],
    loading: false,
    error: null,
  },
  reducers: {},

  extraReducers: (builder) => {
    builder
      // open
      .addCase(fetchOpenPositions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOpenPositions.fulfilled, (state, action) => {
        state.loading = false;
        state.open = action.payload;
      })
      .addCase(fetchOpenPositions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // pending
      .addCase(fetchPendingOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPendingOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.pending = action.payload;
      })
      .addCase(fetchPendingOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // closed
      .addCase(fetchClosedOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClosedOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.closed = action.payload;
      })
      .addCase(fetchClosedOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default positionSlice.reducer;
