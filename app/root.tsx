import {
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration
} from '@remix-run/react';
import 'modern-normalize';

import './root.scss';

export const config = { runtime: 'edge' };

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <Meta/>
      </head>
      <body>
        <Outlet/>
        <ScrollRestoration/>
        <Scripts/>
      </body>
    </html>
  );
}

export function HydrateFallback() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <Meta/>
      </head>
      <body>
        Loading...
        <Scripts/>
      </body>
    </html>
  );
}
