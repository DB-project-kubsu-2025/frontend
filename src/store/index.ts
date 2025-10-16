import { configureStore, combineReducers } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import sidebarOpenReducer from './sidebarOpenSlice';

const rootReducer = combineReducers({
  userData: userReducer,
  sidebarOpen: sidebarOpenReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export const makeStore = () => {
  return configureStore({
    reducer: rootReducer,
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type AppDispatch = AppStore['dispatch'];
