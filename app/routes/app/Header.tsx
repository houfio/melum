import {
  faArrowLeftFromArc,
  faArrowRightFromBracket,
  faArrowRightToArc,
  faWaveform,
  faXmark
} from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useStore } from '@nanostores/react';
import { Form, Link, useMatches } from 'react-router';
import { Avatar } from '~/components/Avatar';
import { Button } from '~/components/form/Button';
import { Volume } from '~/components/form/Volume';
import { Container } from '~/components/layout/Container';
import { useProfile } from '~/hooks/useProfile';
import { $currentGame, stopGame } from '~/stores/game';
import { i18n } from '~/stores/i18n';
import styles from './Header.module.scss';

const messages = i18n('header', {
  logout: 'Logout',
  leave: 'Leave game',
  resume: 'Resume game',
  stop: 'Stop game'
});

export function Header() {
  const t = useStore(messages);
  const profile = useProfile();
  const matches = useMatches();
  const currentGame = useStore($currentGame);

  const inGame = matches.some((m) => m.handle && typeof m.handle === 'object' && 'game' in m.handle && m.handle.game);

  return (
    <header className={styles.header}>
      <Container className={styles.container}>
        <FontAwesomeIcon icon={faWaveform} />
        Melum
        <div className={styles.spacer} />
        {currentGame && (
          <>
            <Button
              as={Link}
              to={inGame ? '/app' : '/app/play'}
              text={inGame ? t.leave : t.resume}
              icon={inGame ? faArrowLeftFromArc : faArrowRightToArc}
            />
            <Button as={Link} to="/app" text={t.stop} icon={faXmark} withText={false} onClick={() => stopGame()} />
            <Volume />
          </>
        )}
        <Form action="/logout">
          <Button text={t.logout} icon={faArrowRightFromBracket} type="submit" />
        </Form>
        <Avatar profile={profile} />
      </Container>
    </header>
  );
}
