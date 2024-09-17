import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import userSlice from "./features/users/users"; // Ensure the import is correct
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // Use localStorage as the default

// Configuration for Redux Persist
const persistConfig = {
  key: 'root',
  storage,
};

// Combine reducers (if you have more reducers, add them here)
const rootReducer = combineReducers({
  auth: userSlice, // Updated to use 'auth' instead of 'userSlice'
});

// Create a persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure the store with the persisted reducer
export const store = configureStore({
  reducer: persistedReducer,
});

// Create a persistor
export const persistor = persistStore(store);
