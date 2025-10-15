'use client';
import { Provider } from 'react-redux';
import { makeStore } from './index';

const store = makeStore();

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  return <Provider store={store}>{children}</Provider>;
}
