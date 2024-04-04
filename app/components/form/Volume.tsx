import { faPause, faPlay } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import styles from './Volume.module.scss';

import { useAudio } from '~/hooks/useAudio';

export function Volume() {
  const { playing, volume, setVolume } = useAudio();

  return (
    <div className={styles.volume}>
      <FontAwesomeIcon
        icon={playing ? faPlay : faPause}
        fixedWidth={true}
        className={styles.icon}
      />
      <input
        type="range"
        min={0}
        max={1}
        step={.01}
        value={volume}
        className={styles.input}
        onChange={(e) => setVolume(e.target.valueAsNumber)}
      />
    </div>
  );
}
