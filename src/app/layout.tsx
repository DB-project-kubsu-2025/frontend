'use client';
import { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { makeStore } from '@/store';
import Providers from './Providers';
import '@/style/global.scss';
import '@/style/style.scss';

const store = makeStore();

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ru">
      <body>
        {/* Redux Provider должен быть самым верхним */}
        <Provider store={store}>
          <Providers>{children}</Providers>
        </Provider>
      </body>
    </html>
  );
}
