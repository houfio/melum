import { Outlet } from '@remix-run/react';

import { Header } from '~/routes/app/Header';
import { getSpotify } from '~/utils/getSpotify';

export const clientLoader = async () => {
  const sdk = await getSpotify();

  return await sdk.currentUser.profile();
};

export default function App() {
  return (
    <>
      <Header/>
      <main>
        <Outlet/>
      </main>
    </>
  );
}
