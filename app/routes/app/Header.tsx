import { faWaveform } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Form } from '@remix-run/react';

import styles from './Header.module.scss';

import { Avatar } from '~/components/Avatar';
import { Button } from '~/components/form/Button';
import { Container } from '~/components/layout/Container';
import { useProfile } from '~/hooks/useProfile';

export function Header() {
  const profile = useProfile();

  return (
    <Container>
      <header className={styles.header}>
        <FontAwesomeIcon icon={faWaveform}/>
        Melum
        <div className={styles.spacer}/>
        <Form action="/logout">
          <Button text="Logout" type="submit"/>
        </Form>
        <Avatar profile={profile}/>
      </header>
    </Container>
  );
}
