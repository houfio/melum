import { useRouteLoaderData } from 'react-router';
import type { clientLoader } from '~/routes/app/route';

export function useProfile() {
  const data = useRouteLoaderData<typeof clientLoader>('routes/app/route');

  if (!data) {
    throw new Error('App data not defined');
  }

  return data.profile;
}
