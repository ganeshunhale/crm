// positionSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  OPEN_POSITION_API,
  PENDING_ORDER_API,
  CLOSED_ORDER_API,
  GET_NEW_SELECTED_TYPES_SYMBOLS_API,
  GET_INSTRUMENTS_PROFIT_CURRENCY_API,
} from "../API/ApiServices";

let cachedProfitCurrencies = {};

try {
  const saved = localStorage.getItem("cachedProfitCurrencies");
  if (saved) cachedProfitCurrencies = JSON.parse(saved);
} catch (err) {
  console.error("Failed to parse cachedProfitCurrencies from localStorage:", err);
}

// ---- Thunks ----
export const fetchOpenPositions = createAsyncThunk(
  "positions/fetchOpen",
  async (demo_id) => {
    try {
      const res = await OPEN_POSITION_API(demo_id);

    const positions = await Promise.all(
      (res?.data?.result || []).map(async (item) => {
        if(item.symbol.includes("USD")) return item
        let convertedRes = {}

        if (cachedProfitCurrencies[item.symbol]) convertedRes = cachedProfitCurrencies[item.symbol];
        else {
          const { data } = await GET_INSTRUMENTS_PROFIT_CURRENCY_API(item.symbol);

          const { profitCurrency, bid = 0, ask = 0 } = data.result;

          if (!profitCurrency) {
            console.error("No instrument found for quote:", profitCurrency);
            return item;
          }
          cachedProfitCurrencies[item.symbol] = { profitCurrency, bid, ask };
          localStorage.setItem("cachedProfitCurrencies", JSON.stringify(cachedProfitCurrencies));
          convertedRes = cachedProfitCurrencies[item.symbol];
        }

        const { profitCurrency, bid = 0, ask = 0 } = convertedRes;
        return { ...item, convertedKey: profitCurrency, convertedValue : (item.type == "Buy" ? bid : ask) ?? 0 };
      })
    );

    return positions
    } catch (error) {
      console.error("Error fetching open positions:", error);
      return [];
    }
  }
);

export const fetchPendingOrders = createAsyncThunk(
  "positions/fetchPending", async (demo_id) => {
    const res = await PENDING_ORDER_API(demo_id);
    return res?.data?.result || [];
  }
);

export const fetchClosedOrders = createAsyncThunk(
  "positions/fetchClosed",
  async ({data,query}) => {
    const res = await CLOSED_ORDER_API({data,query});
    return res?.data?.result || [];
  }
);

let debounceTimer = null;

export const wsRemovePosition = (positionId, demo_id) => (dispatch) => {
  // remove from state immediately
  dispatch(positionSlice.actions.wsRemoveOpenPosition(positionId));

  // debounce fetchClosedOrders
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    const now = new Date();
    const oneDay = 24 * 60 * 60 * 1000;
    const from = new Date(now.getTime() - oneDay).toISOString();
    const to = new Date(now.getTime() + oneDay).toISOString();

    const payload = { event: "get-deals", data: { from, to, client_id: demo_id } };
    dispatch(fetchClosedOrders({data:payload}));
  }, 1000);
};
// ---- Slice ----
const positionSlice = createSlice({
  name: "positions",
  initialState: {
    staticOpen: [],
    open: [],
    pending: [],
    closed: [],
    pagination:{},
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
        state.staticOpen.push(newPosition)
      }
      state.pending = state.pending.filter(
        (order) => order.positionId !== newPosition.positionId
      );
    },
    wsRemoveOpenPosition: (state, action) => {
      const positionId = action.payload;
      state.open = state.open.filter(
        (pos) => pos.positionId !== positionId
      );
      state.staticOpen = state.staticOpen.filter(
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
        state.staticOpen = action.payload
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
        state.closed = action.payload.data;
        state.pagination = action.payload?.pagination?.[0] || [];
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
  wsUpdatePosition,
  wsSyncPosition,
  wsSetPositions,
} = positionSlice.actions;

export default positionSlice.reducer;
