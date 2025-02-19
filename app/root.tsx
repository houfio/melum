import '~/root.scss';
import { useStore } from '@nanostores/react';
import type { PropsWithChildren } from 'react';
import { Links, Meta, type MetaFunction, Outlet, Scripts, ScrollRestoration } from 'react-router';
import { $locale } from '~/stores/i18n';
import { $settings } from '~/stores/settings';

export const meta: MetaFunction = () => [{ title: 'Melum' }];

export function Layout({ children }: PropsWithChildren) {
  const { theme } = useStore($settings);
  const locale = useStore($locale);

  return (
    <html lang={locale} className={theme !== 'auto' ? theme : undefined}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function HydrateFallback() {
  return <span>Loading...</span>;
}
