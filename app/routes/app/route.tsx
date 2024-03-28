import { Outlet, redirect, useLoaderData } from '@remix-run/react';

import styles from './route.module.scss';

import { usePlayer } from '~/hooks/usePlayer';
import { Header } from '~/routes/app/Header';
import { Player } from '~/routes/app/Player';
import { getSpotify } from '~/utils/getSpotify';

export const clientLoader = async () => {
  const sdk = await getSpotify();
  const token = await sdk.getAccessToken();

  if (!token) {
    throw redirect('/');
  }

  return {
    token: token.access_token,
    profile: await sdk.currentUser.profile()
  };
};

export default function App() {
  const { token } = useLoaderData<typeof clientLoader>();

  return (
    <usePlayer.Provider token={token}>
      <Header/>
      <main className={styles.main}>
        <Outlet/>
      </main>
      <Player/>
    </usePlayer.Provider>
  );
}
