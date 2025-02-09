import { getSpotify } from '~/utils/getSpotify';
import type { DataStrategyMatch, Params } from 'react-router';

type Context = Record<string, unknown>;
type MiddlewareFn = (
  args: { request: Request; params: Params<string> },
  context: Context
) => Promise<void>;
type BuildContextFn = (match: DataStrategyMatch['route'], context: Context) => Promise<void>;

export async function resolveWithContext(matches: DataStrategyMatch[], buildContext: BuildContextFn) {
  const context = {};

  for (const match of matches) {
    await buildContext(match.route, context);
  }

  const results = await Promise.all(matches.map((match) => match.resolve((handler) => handler(context))));

  return results.reduce(
    (acc, result, i) =>
      Object.assign(acc, {
        [matches[i].route.id]: result
      }),
    {}
  );
}

export function hasMiddleware(handle?: unknown): handle is { middleware: MiddlewareFn } {
  return (
    typeof handle === 'object' && handle !== null && 'middleware' in handle && typeof handle.middleware === 'function'
  );
}

export const middleware: MiddlewareFn = async (_, context) => {
  context.sdk = await getSpotify();
};
