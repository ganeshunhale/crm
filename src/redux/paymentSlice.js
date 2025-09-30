import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
    GET_TRANSACTION_HISTORY_API
} from "../API/ApiServices";

export const fetchTransactionHistory = createAsyncThunk(
    "payments/fetchHistory",
    async (params) => {
        const res = await GET_TRANSACTION_HISTORY_API(params);
        return res?.data?.result || [];
    }
);

// ---- Slice ----
const paymentSlice = createSlice({
    name: "payments",
    initialState: {
        transactionHistory: [],
        loading: false,
        error: null,
    },
    reducers: {
        // addOpenPosition: (state, action) => {
        //   state.open.push(action.payload);
        // },
    },

    extraReducers: (builder) => {
        builder
            // Get Transactions
            .addCase(fetchTransactionHistory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTransactionHistory.fulfilled, (state, action) => {
                state.loading = false;
                state.transactionHistory = action.payload;
            })
            .addCase(fetchTransactionHistory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
    },
});
export const {
    //   addOpenPosition,

} = paymentSlice.actions;

export default paymentSlice.reducer;