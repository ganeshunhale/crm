// websocketMiddleware.js
import { 
  wsAddPosition, 
  wsUpdatePosition, 
  wsSyncPosition,
  fetchPendingOrders, 
  wsRemovePosition
} from './positionSlice';

const buyTypes = new Set([0, 2, 4, 6]);
const sellTypes = new Set([1, 3, 5, 7]);

// Helper function to map WebSocket data to Redux position format
const mapSocketToPosition = (data) => {
  return {
    symbol: data.Symbol,
    type: data.Action === "buy" ? "Buy" : "Sell",
    volume: data.Volume,
    open_price: data.OpenPrice,
    current_price: data.CurrentPrice,
    tp: data.TP ?? 0,
    sl: data.SL ?? 0,
    positionId: data.Position,
    posTime: data.Time ?? "-",
    contractSize: data.ContractSize ?? 100,
    profit: data.Profit ?? 0,
  };
};

// WebSocket middleware to handle position and ticks events
export const createWebSocketMiddleware = () => {
  return (store) => (next) => (action) => {
    // Handle WebSocket position events
    if (action.type === 'websocket/positionEvent') {
      const { data, demo_id } = action.payload;
      const { function: fn } = data;

      switch (fn) {
        case 'add':
          const newPosition = mapSocketToPosition(data);
          store.dispatch(wsAddPosition(newPosition));
          // Also refresh pending orders when a new position is added
          if (demo_id) {
            store.dispatch(fetchPendingOrders(demo_id));
          }
          break;

        case 'delete':
          store.dispatch(wsRemovePosition(data.Position,demo_id));
          break;

        case 'update':
          const updateData = {
            positionId: data.Position,
            type: data.Action,
            symbol: data.Symbol,
            open_price: data.OpenPrice,
            volume: data.Volume,
            contractSize: data.ContractSize,
            current_price: data.CurrentPrice,
            profit: data.Profit,
          };
          store.dispatch(wsUpdatePosition(updateData));
          break;

        // case 'sync':
        //   const syncData = {
        //     positionId: data.Position,
        //     type: data.Action,
        //     symbol: data.Symbol,
        //     open_price: data.OpenPrice,
        //     volume: data.Volume,
        //     contractSize: data.ContractSize,
        //     current_price: data.CurrentPrice,
        //     profit: data.Profit,
        //   };
        //   store.dispatch(wsSyncPosition(syncData));
        //   break;

        default:
          console.warn('Unhandled WebSocket position function:', fn);
      }
    }

    // Handle WebSocket ticks events for real-time price updates
    if (action.type === 'websocket/ticksEvent') {
      const { data } = action.payload;
      const { symbol, bid, ask } = data;

      if (!symbol) return next(action);

      const state = store.getState();
      const openPositions = state.positions.open;

      openPositions.forEach(position => {
        if(position.symbol === symbol){
          const updatedPosition = calculateProfit(position, bid, ask);
          if (updatedPosition.profit !== position.profit || updatedPosition.current_price !== position.current_price) {
            store.dispatch(wsUpdatePosition(updatedPosition));
          }
        } else if(position.convertedKey == symbol) {
            const type = position.type;
            let currentPrice;
            if (type === "Buy" || buyTypes.has(type)) currentPrice = bid;
            else if (type === "Sell" || sellTypes.has(type)) currentPrice = ask;

            let updatedRow = { ...position, "convertedValue": currentPrice };
            store.dispatch(wsUpdatePosition(updatedRow));
            // api.applyTransaction({ update: [updatedRow] });
        }
      });
    }

    return next(action);
  };
};

const calculateProfit = (position, bid, ask) => {
  const specialSymbols = new Set([
    "USDCAD", "USDCHF", "USDJPY", "USDHKD"
  ]);

  const type = position.type;
  const currentPrice = type === "Buy" ? bid : ask;
  const openPrice = parseFloat(position.open_price);
  const volume = parseFloat(position.volume);
  const contractSize = parseFloat(position.contractSize || 100);

  const signedVolume = type === "Sell" ? -volume : volume;
  let profit = (currentPrice - openPrice) * signedVolume * contractSize;

  if (specialSymbols.has(position.symbol.split(".")[0])) {
    profit = profit / currentPrice;
  }

  if (position.convertedKey) {
    if(position.convertedKey.slice(0, 3) == "USD") profit = profit / position.convertedValue
    else profit = profit * position.convertedValue
  }

  return {
    ...position,
    bid,
    ask,
    current_price: currentPrice,
    profit: Number(profit.toFixed(2))
  };
};

// Action creators for WebSocket events
export const websocketPositionEvent = (data, demo_id) => ({
  type: 'websocket/positionEvent',
  payload: { data, demo_id }
});

export const websocketTicksEvent = (data) => ({
  type: 'websocket/ticksEvent',
  payload: { data }
});
