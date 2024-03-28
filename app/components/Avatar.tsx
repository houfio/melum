import type { UserProfile } from '@spotify/web-api-ts-sdk';

import styles from './Avatar.module.scss';

type Props = {
  profile: UserProfile
};

export function Avatar({ profile }: Props) {
  const image = profile.images.toSorted((a, b) => a.width - b.width)[0];

  return (
    <div className={styles.avatar}>
      <img src={image?.url} alt={profile.display_name} className={styles.image}/>
    </div>
  );
}
