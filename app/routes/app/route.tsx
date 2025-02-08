import { useRef } from 'react';
import { Outlet, redirect } from 'react-router';
import { Container } from '~/components/layout/Container';
import { useAudio } from '~/hooks/useAudio';
import { Header } from '~/routes/app/Header';
import { getSpotify } from '~/utils/getSpotify';
import styles from './route.module.scss';

export const clientLoader = async () => {
  const sdk = await getSpotify();
  const token = await sdk.getAccessToken();

  if (!token) {
    throw redirect('/');
  }

  return {
    profile: await sdk.currentUser.profile()
  };
};

export const shouldRevalidate = () => false;

export default function App() {
  const ref = useRef<HTMLAudioElement>(null);

  return (
    <useAudio.Provider audioRef={ref}>
      {/* biome-ignore lint/a11y/useMediaCaption: <explanation> */}
      <audio ref={ref} />
      <Header />
      <main className={styles.main}>
        <Container>
          <Outlet />
        </Container>
      </main>
    </useAudio.Provider>
  );
}
