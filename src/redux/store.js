import { configureStore ,combineReducers } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore , FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER} from "redux-persist";
import authSlice from "./authSlice"
import tradePositionSlice from "./tradePositionSlice"

const authPersistConfig = {
  key: "auth",
  storage,
  whitelist: ['isLoggedIn', 'data'], // optional: only persist these fields
};

const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authSlice),
  tradeposition:tradePositionSlice
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER], // ignore redux-persist internal actions
      },
    }),
});

export const persistor = persistStore(store);