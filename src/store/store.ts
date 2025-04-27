// store.ts
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import localforage from "@/utils/storage";
import authReducer from "./slices/AuthSlice";
import ApiSlice from "./slices/ApiSlice";

const rootReducer = combineReducers({
  auth: authReducer,
  [ApiSlice.reducerPath]: ApiSlice.reducer,
});

const persistConfig = {
  key: "root",
  storage: localforage,
  whitelist: ["auth", "authApi"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(ApiSlice.middleware),
});

export const persistor = persistStore(store);

// For TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
