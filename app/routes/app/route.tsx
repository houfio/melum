import { useRef } from 'react';
import { Outlet, redirect } from 'react-router';
import { Container } from '~/components/layout/Container';
import { useAudio } from '~/hooks/useAudio';
import type { Context } from '~/main';
import { Header } from '~/routes/app/Header';
import { middleware } from '~/utils/middleware';
import styles from './route.module.scss';

export const clientLoader = async (_: unknown, { sdk }: Context) => {
  const token = await sdk.getAccessToken();

  if (!token) {
    throw redirect('/');
  }

  return {
    profile: await sdk.currentUser.profile()
  };
};

export const shouldRevalidate = () => false;

export const handle = { middleware };

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
