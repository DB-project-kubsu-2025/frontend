import { configureStore, combineReducers } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import sidebarOpenReducer from './sidebarOpenSlice';
import dictsReducer from './dictsSlice';

const rootReducer = combineReducers({
  userData: userReducer,
  sidebarOpen: sidebarOpenReducer,
  dicts: dictsReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export const makeStore = () => {
  return configureStore({
    reducer: rootReducer,
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type AppDispatch = AppStore['dispatch'];
