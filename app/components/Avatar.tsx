import type { UserProfile } from '@spotify/web-api-ts-sdk';

import styles from './Avatar.module.scss';

import { getImage } from '~/utils/getImage';

type Props = {
  profile: UserProfile
};

export function Avatar({ profile }: Props) {
  return (
    <div className={styles.avatar}>
      <img src={getImage(profile.images, 'smallest')?.url} alt={profile.display_name} className={styles.image}/>
    </div>
  );
}
