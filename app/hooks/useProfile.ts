import { useRouteLoaderData } from '@remix-run/react';

import type { clientLoader } from '~/routes/app/route';

export function useProfile() {
  const data = useRouteLoaderData<typeof clientLoader>('routes/app');

  if (!data) {
    throw new Error('App data not defined');
  }

  return data.profile;
}
