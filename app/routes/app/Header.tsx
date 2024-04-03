import { faArrowRightFromBracket, faPause, faPlay, faWaveform } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useStore } from '@nanostores/react';
import { Form } from '@remix-run/react';

import styles from './Header.module.scss';

import { Avatar } from '~/components/Avatar';
import { Button } from '~/components/form/Button';
import { Container } from '~/components/layout/Container';
import { useAudio } from '~/hooks/useAudio';
import { useProfile } from '~/hooks/useProfile';
import { i18n } from '~/stores/i18n';

const messages = i18n('header', {
  logout: 'Logout'
});

export function Header() {
  const t = useStore(messages);
  const profile = useProfile();
  const { playing, volume, setVolume } = useAudio();

  return (
    <header className={styles.header}>
      <Container className={styles.container}>
        <FontAwesomeIcon icon={faWaveform}/>
        Melum
        <div className={styles.spacer}/>
        <FontAwesomeIcon icon={playing ? faPlay : faPause}/>
        <input
          type="range"
          min={0}
          max={1}
          step={.01}
          value={volume}
          onChange={(e) => setVolume(e.target.valueAsNumber)}
        />
        <Form action="/logout">
          <Button text={t.logout} icon={faArrowRightFromBracket} type="submit"/>
        </Form>
        <Avatar profile={profile}/>
      </Container>
    </header>
  );
}
