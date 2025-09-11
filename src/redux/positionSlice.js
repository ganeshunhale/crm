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
  reducers: {
    addOpenPosition: (state, action) => {
      state.open.push(action.payload);
    },
    deleteOpenPosition: (state, action) => {
      state.open = state.open.filter(
        (pos) => pos.positionId !== action.payload
      );
    },
    // WebSocket real-time actions
    wsAddPosition: (state, action) => {
      const newPosition = action.payload;
      // Check if position already exists to avoid duplicates
      const existingIndex = state.open.findIndex(
        (pos) => pos.positionId === newPosition.positionId
      );
      if (existingIndex === -1) {
        state.open.push(newPosition);
      }
    },
    wsRemovePosition: (state, action) => {
      const positionId = action.payload;
      state.open = state.open.filter(
        (pos) => pos.positionId !== positionId
      );
    },
    wsUpdatePosition: (state, action) => {
      const updatedPosition = action.payload;
      const index = state.open.findIndex(
        (pos) => pos.positionId === updatedPosition.positionId
      );
      if (index !== -1) {
        // Update existing position with new data, ensuring we trigger re-renders
        state.open[index] = {
          ...state.open[index],
          ...updatedPosition,
          // Add timestamp to ensure re-render
          lastUpdated: Date.now()
        };
      }
    },
    wsSyncPosition: (state, action) => {
      const syncData = action.payload;
      const index = state.open.findIndex(
        (pos) => pos.positionId === syncData.positionId
      );
      if (index !== -1) {
        // Sync position with server data
        state.open[index] = { ...state.open[index], ...syncData };
      } else {
        // If position doesn't exist, add it
        state.open.push(syncData);
      }
    },
    // Bulk update for initial WebSocket sync
    wsSetPositions: (state, action) => {
      state.open = action.payload;
    },

  },

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
export const {
  addOpenPosition,
  deleteOpenPosition,
  wsAddPosition,
  wsRemovePosition,
  wsUpdatePosition,
  wsSyncPosition,
  wsSetPositions,
} = positionSlice.actions;

export default positionSlice.reducer;
