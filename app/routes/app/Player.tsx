import format from 'format-duration';

import styles from './Player.module.scss';

import { Container } from '~/components/layout/Container';
import { usePlayer } from '~/hooks/usePlayer';

export function Player() {
  const [, state] = usePlayer();

  return (
    <div className={styles.player}>
      <Container className={styles.container}>
        <span className={styles.time}>
          {format(state?.position ?? 0)}
        </span>
        <div className={styles.bar}>
          <div
            style={{ width: `${state ? 100 / state.duration * state.position : 0}%` }}
            className={styles.progress}
          />
        </div>
        <span className={styles.time}>
          {format(state?.duration ?? 0)}
        </span>
      </Container>
    </div>
  );
}
