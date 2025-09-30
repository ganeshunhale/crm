import { createSlice } from "@reduxjs/toolkit";

const eqSet = (xs, ys) => xs.size === ys.size && [...xs].every((x) => ys.has(x));

const initialState = { 
  selectedSymbol:"",
  selectedSymbolData:{},
  allMandetorySymbols:[],

  marketWatchSymbols: [],
  positionSymbols: [],
};

const tradePositionSlice = createSlice({
  name: "tradeposition",
  initialState,
  reducers: {
    selectedSymbolAction : (state,action)=>{
      state.selectedSymbol =action.payload
    },
    updateTicksAction: (state,action) => { 
      state.selectedSymbolData = state.selectedSymbolData.symbol==action.payload.symbol?{...state.selectedSymbolData,...action.payload}:action.payload
    },
    updateMarketWatchSymbols: (state, action) => {
      const newSet = new Set(action.payload);
      const oldSet = new Set(state.marketWatchSymbols);

      if (!eqSet(oldSet, newSet)) {
        state.marketWatchSymbols = [...newSet];
        state.allMandetorySymbols = [ ...new Set([...state.marketWatchSymbols, ...state.positionSymbols]) ];
      }
    },
    updatePositionSymbols: (state, action) => {
      const newSet = new Set(action.payload);
      const oldSet = new Set(state.positionSymbols);

      if (!eqSet(oldSet, newSet)) {
        state.positionSymbols = [...newSet];
        state.allMandetorySymbols = [ ...new Set([...state.marketWatchSymbols, ...state.positionSymbols]) ];
      }
    }
  },
});

export const { selectedSymbolAction,updateTicksAction ,updateMarketWatchSymbols, updatePositionSymbols} = tradePositionSlice.actions;
export default tradePositionSlice.reducer;
