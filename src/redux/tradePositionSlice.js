import { createSlice } from "@reduxjs/toolkit";

const initialState = { 
    selectedSymbol:"",
 selectedSymbolData:{}
};

const tradePositionSlice = createSlice({
  name: "tradeposition",
  initialState,
  reducers: {
    selectedSymbolAction : (state,action)=>{
        console.log("symbol selected...")
    state.selectedSymbol =action.payload
    },
    updateTicksAction: (state,action) => { 
        console.log("tick updatecalled...")
      state.selectedSymbolData = action.payload
    },

    
  },
});

export const { selectedSymbolAction,updateTicksAction } = tradePositionSlice.actions;
export default tradePositionSlice.reducer;
