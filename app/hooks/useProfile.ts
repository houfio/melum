import { useRouteLoaderData } from '@remix-run/react';

import type { clientLoader } from '~/routes/app/route';

export function useProfile() {
  const profile = useRouteLoaderData<typeof clientLoader>('routes/app');

  if (!profile) {
    throw new Error('Profile not defined');
  }

  return profile;
}
