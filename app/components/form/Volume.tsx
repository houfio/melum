import { faPause, faPlay } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAudio } from '~/hooks/useAudio';
import styles from './Volume.module.scss';

export function Volume() {
  const { playing, volume, setVolume } = useAudio();

  return (
    <div className={styles.volume}>
      <FontAwesomeIcon icon={playing ? faPlay : faPause} fixedWidth={true} className={styles.icon} />
      <input
        type="range"
        min={0}
        max={1}
        step={0.01}
        value={volume}
        className={styles.input}
        onChange={(e) => setVolume(e.target.valueAsNumber)}
      />
    </div>
  );
}
