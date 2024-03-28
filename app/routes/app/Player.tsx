import styles from './Player.module.scss';

import { Button } from '~/components/form/Button';
import { Container } from '~/components/layout/Container';

export function Player() {
  return (
    <div className={styles.player}>
      <Container className={styles.container}>
        <Button text="Play"/>
      </Container>
    </div>
  );
}
