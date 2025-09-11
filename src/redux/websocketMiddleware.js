// websocketMiddleware.js
import { 
  wsAddPosition, 
  wsRemovePosition, 
  wsUpdatePosition, 
  wsSyncPosition,
  fetchPendingOrders 
} from './positionSlice';

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

        case 'remove':
          store.dispatch(wsRemovePosition(data.Position));
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

        case 'sync':
          const syncData = {
            positionId: data.Position,
            type: data.Action,
            symbol: data.Symbol,
            open_price: data.OpenPrice,
            volume: data.Volume,
            contractSize: data.ContractSize,
            current_price: data.CurrentPrice,
            profit: data.Profit,
          };
          store.dispatch(wsSyncPosition(syncData));
          break;

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

      // Find positions that need updating for this symbol
      const positionsToUpdate = openPositions.filter(position => position.symbol === symbol);

      if (positionsToUpdate.length > 0) {
        // Update each position individually to trigger proper re-renders
        positionsToUpdate.forEach(position => {
          const updatedPosition = calculateProfit(position, bid, ask);

          // Only update if profit or price actually changed
          if (updatedPosition.profit !== position.profit ||
              updatedPosition.current_price !== position.current_price) {
            console.log(`Dispatching wsUpdatePosition for ${position.symbol}:`, {
              oldProfit: position.profit,
              newProfit: updatedPosition.profit,
              oldPrice: position.current_price,
              newPrice: updatedPosition.current_price
            });
            store.dispatch(wsUpdatePosition(updatedPosition));
          }
        });
      }
    }

    return next(action);
  };
};

// Helper function to calculate profit based on ticks
const calculateProfit = (position, bid, ask) => {
  const specialSymbols = new Set([
    "USDCAD", "USDCHF", "USDJPY", "AUDCAD", "EURGBP", "EURJPY",
    "GBPAUD", "GBPCHF", "GBPJPY", "AUDCHF", "AUDJPY", "AUDNZD",
    "CADCHF", "CADJPY", "CHFJPY", "EURAUD", "EURCAD", "EURCHF",
    "EURNZD", "GBPCAD", "GBPNZD", "NZDCAD", "NZDCHF", "NZDJPY",
    "USDHKD"
  ]);

  const type = position.type;
  const currentPrice = type === "Buy" ? bid : ask;
  const openPrice = parseFloat(position.open_price);
  const volume = parseFloat(position.volume);
  const contractSize = parseFloat(position.contractSize || 100);

  const signedVolume = type === "Sell" ? -volume : volume;
  let profit = (currentPrice - openPrice) * signedVolume * contractSize;

  if (specialSymbols.has(position.symbol)) {
    profit = profit / currentPrice;
  }

  console.log(`Profit calculation for ${position.symbol}:`, {
    type,
    currentPrice,
    openPrice,
    volume,
    contractSize,
    signedVolume,
    profit: profit.toFixed(2),
    bid,
    ask
  });

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
