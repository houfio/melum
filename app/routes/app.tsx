import { useLoaderData } from '@remix-run/react';

import { getSpotify } from '~/utils/getSpotify';

export const clientLoader = async () => {
  const sdk = await getSpotify();

  return await sdk.currentUser.profile();
};

export default function App() {
  const { display_name } = useLoaderData<typeof clientLoader>();

  return (
    <span>
      Hello, {display_name}
    </span>
  );
}
