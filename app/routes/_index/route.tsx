import { faGithub, faSpotify } from '@fortawesome/free-brands-svg-icons';
import { faWaveform } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useStore } from '@nanostores/react';
import type { ClientLoaderFunctionArgs } from '@remix-run/react';
import { Form, redirect } from '@remix-run/react';

import styles from './route.module.scss';

import { Button } from '~/components/form/Button';
import { i18n } from '~/stores/i18n';
import { getSpotify } from '~/utils/getSpotify';

const messages = i18n('home', {
  description: 'Guess what song is playing after only hearing a second of it! Uses the Spotify API to fetch playlists and play music.',
  login: 'Login with Spotify'
});

export const clientLoader = async ({ request }: ClientLoaderFunctionArgs) => {
  const sdk = await getSpotify(false);
  const url = new URL(request.url);

  if (!url.searchParams.has('code')) {
    return {};
  }

  await sdk.authenticate();

  return redirect('/app');
};

export const clientAction = async () => {
  const sdk = await getSpotify(false);

  await sdk.authenticate();

  return redirect('/app');
};

export default function Index() {
  const t = useStore(messages);

  return (
    <div className={styles.content}>
      <div className={styles.box}>
        <span className={styles.title}>
          <FontAwesomeIcon icon={faWaveform}/> Melum
        </span>
        {t.description}
        <Form method="post" className={styles.form}>
          <Button text={t.login} icon={faSpotify} type="submit"/>
        </Form>
      </div>
      <a href="https://github.com/houfio/melum" target="_blank" rel="noreferrer" className={styles.link}>
        <FontAwesomeIcon icon={faGithub}/> GitHub
      </a>
    </div>
  );
}
