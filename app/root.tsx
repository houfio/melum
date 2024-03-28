import { Meta, type MetaFunction, Outlet, Scripts, ScrollRestoration } from '@remix-run/react';
import type { PropsWithChildren } from 'react';

import './root.scss';
import { usePlaybackSDK } from './hooks/usePlaybackSDK';

export const config = { runtime: 'edge' };

export const meta: MetaFunction = () => [
  { title: 'Melum' }
];

export function Layout({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <Meta/>
      </head>
      <body>
        {children}
        <ScrollRestoration/>
        <Scripts/>
      </body>
    </html>
  );
}

export default function App() {
  return (
    <usePlaybackSDK.Provider>
      <Outlet/>
    </usePlaybackSDK.Provider>
  );
}

export function HydrateFallback() {
  return (
    <span>
      Loading...
    </span>
  );
}
