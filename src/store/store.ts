import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import userReducer from './userSlice';

// Persist Config
const persistConfig = {
    key: 'root',
    storage,
};

// Combine Reducers
const rootReducer = combineReducers({
    user: persistReducer(persistConfig, userReducer),
});

// Create Store
export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false, // Required for redux-persist
        }),
});

// Persistor
export const persistor = persistStore(store);

// Infer types for dispatch and state
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
