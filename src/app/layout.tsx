'use client';
import { ReactNode } from 'react';
import Providers from './Providers';
import '@/style/global.scss';
import '@/style/style.scss';


export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ru">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
