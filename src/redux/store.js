import { configureStore, combineReducers } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist";
import authSlice from "./authSlice"
import tradePositionSlice from "./tradePositionSlice"
import snackbarReducer from "./snackbarslice";
import positionReducer from "./positionSlice";
import { createWebSocketMiddleware } from "./websocketMiddleware";

const authPersistConfig = {
  key: "auth",
  storage,
  whitelist: ['isLoggedIn', 'data'], // optional: only persist these fields
};

const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authSlice),
  tradeposition: tradePositionSlice,
  snackbar: snackbarReducer,
  positions: positionReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER], // ignore redux-persist internal actions
      },
    }).concat(createWebSocketMiddleware()),
});

export const persistor = persistStore(store);