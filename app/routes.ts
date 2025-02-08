import { type RouteConfig, index, route } from '@react-router/dev/routes';

export default [
  index('routes/_index/route.tsx'),
  route('app', 'routes/app/route.tsx', [
    index('routes/app._index/route.tsx'),
    route('play', 'routes/app.play/route.tsx')
  ]),
  route('logout', 'routes/logout.ts')
] satisfies RouteConfig;
