import type { Track } from '@spotify/web-api-ts-sdk';
import { getImage } from '~/utils/getImage';
import styles from './TrackEntry.module.scss';

type Props = {
  track: Track;
  onClick?: () => void;
};

export function TrackEntry({ track, onClick }: Props) {
  const image = getImage(track.album.images, 'smallest');
  const Component = onClick ? 'button' : 'div';

  return (
    <Component key={track.id} className={styles.track} onClick={onClick}>
      <div style={{ backgroundImage: `url(${image?.url})` }} className={styles.image} />
      <div className={styles.info}>
        <span>{track.name}</span>
        <span>{track.artists.map((a) => a.name).join(', ')}</span>
        <span className={styles.subtle}>{track.album.name}</span>
      </div>
    </Component>
  );
}
