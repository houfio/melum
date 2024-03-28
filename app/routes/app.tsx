import { useLoaderData } from '@remix-run/react';

import { Avatar } from '~/components/Avatar';
import { getSpotify } from '~/utils/getSpotify';

export const clientLoader = async () => {
  const sdk = await getSpotify();

  return await sdk.currentUser.profile();
};

export default function App() {
  const profile = useLoaderData<typeof clientLoader>();

  return (
    <span>
      Hello, {profile.display_name}
      <Avatar profile={profile}/>
    </span>
  );
}
