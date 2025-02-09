import '~/root.scss';
import type { SpotifyApi } from '@spotify/web-api-ts-sdk';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router';
import Index, { clientAction as indexAction, clientLoader as indexLoader } from '~/routes/_index/route';
import AppIndex, { clientAction as appIndexAction, clientLoader as appIndexLoader } from '~/routes/app._index/route';
import Play, {
  clientLoader as playLoader,
  handle as playHandle,
  shouldRevalidate as playRevalidate
} from '~/routes/app.play/route';
import App, {
  clientLoader as appLoader,
  handle as appHandle,
  shouldRevalidate as appRevalidate
} from '~/routes/app/route';
import { clientLoader as logoutLoader, handle as logoutHandle } from '~/routes/logout';
import { hasMiddleware, resolveWithContext } from '~/utils/middleware';

export type Context = {
  sdk: SpotifyApi;
};

const root = document.getElementById('root');
const router = createBrowserRouter(
  [
    {
      index: true,
      element: <Index />,
      loader: indexLoader,
      action: indexAction
    },
    {
      id: 'app',
      path: 'app',
      element: <App />,
      loader: appLoader,
      shouldRevalidate: appRevalidate,
      handle: appHandle,
      children: [
        {
          index: true,
          element: <AppIndex />,
          loader: appIndexLoader,
          action: appIndexAction
        },
        {
          path: 'play',
          element: <Play />,
          loader: playLoader,
          shouldRevalidate: playRevalidate,
          handle: playHandle
        }
      ]
    },
    {
      path: 'logout',
      loader: logoutLoader,
      handle: logoutHandle
    }
  ],
  {
    dataStrategy: ({ request, params, matches }) =>
      resolveWithContext(matches, async (route, context) => {
        if (hasMiddleware(route.handle)) {
          await route.handle.middleware({ request, params }, context);
        }
      })
  }
);

if (root) {
  createRoot(root).render(<RouterProvider router={router} />);
}
