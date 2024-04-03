import type { Track } from '@spotify/web-api-ts-sdk';

import styles from './TrackEntry.module.scss';

import { getImage } from '~/utils/getImage';

type Props = {
  track: Track,
  onClick?: () => void
};

export function TrackEntry({ track, onClick }: Props) {
  const image = getImage(track.album.images, 'smallest');

  return (
    <button
      key={track.id}
      className={styles.track}
      onClick={onClick}
    >
      <div
        style={{ backgroundImage: `url(${image?.url})` }}
        className={styles.image}
      />
      <div className={styles.info}>
        <span>
          {track.name}
        </span>
        <span>
          {track.artists.map((a) => a.name).join(', ')}
        </span>
        <span className={styles.subtle}>
          {track.album.name}
        </span>
      </div>
    </button>
  );
}
