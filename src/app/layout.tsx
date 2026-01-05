import { ReactNode } from 'react';
import Providers from './Providers';
import PopupProvider from '@/components/Popup';
import MidnightChecker from '@/components/MidnightChecker';

import '@/style/global.scss';
import '@/style/style.scss';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ru">
      <body>
        <Providers>
          <PopupProvider>
            {children}
            <MidnightChecker />
          </PopupProvider>
        </Providers>
      </body>
    </html>
  );
}
