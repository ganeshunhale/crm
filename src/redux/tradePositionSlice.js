import { createSlice } from "@reduxjs/toolkit";

const initialState = { 
    selectedSymbol:"",
 selectedSymbolData:{},
 allMandetorySymbols:[]
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
    updateMandetorySymbols:(state,action)=>{
      state.allMandetorySymbols = [
        ...new Set([...state.allMandetorySymbols, ...action.payload])
      ];
    }
    
  },
});

export const { selectedSymbolAction,updateTicksAction ,updateMandetorySymbols} = tradePositionSlice.actions;
export default tradePositionSlice.reducer;
