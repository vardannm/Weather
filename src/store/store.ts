import { configureStore } from '@reduxjs/toolkit';
import weatherReducer from './weatherSlice.ts'; 

export const store = configureStore({
  reducer: {
    weather: weatherReducer, 
  },
});

// Types for Redux hooks and state
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
