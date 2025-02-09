import { useRouteLoaderData } from 'react-router';
import type { clientLoader } from '~/routes/app/route';

export function useProfile() {
  const data = useRouteLoaderData<typeof clientLoader>('app');

  if (!data) {
    throw new Error('App data not defined');
  }

  return data.profile;
}
