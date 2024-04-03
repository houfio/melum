import { faArrowRightFromBracket, faWaveform } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useStore } from '@nanostores/react';
import { Form } from '@remix-run/react';

import styles from './Header.module.scss';

import { Avatar } from '~/components/Avatar';
import { Button } from '~/components/form/Button';
import { Volume } from '~/components/form/Volume';
import { Container } from '~/components/layout/Container';
import { useProfile } from '~/hooks/useProfile';
import { i18n } from '~/stores/i18n';

const messages = i18n('header', {
  logout: 'Logout'
});

export function Header() {
  const t = useStore(messages);
  const profile = useProfile();

  return (
    <header className={styles.header}>
      <Container className={styles.container}>
        <FontAwesomeIcon icon={faWaveform}/>
        Melum
        <div className={styles.spacer}/>
        <Volume/>
        <Form action="/logout">
          <Button text={t.logout} icon={faArrowRightFromBracket} type="submit"/>
        </Form>
        <Avatar profile={profile}/>
      </Container>
    </header>
  );
}
