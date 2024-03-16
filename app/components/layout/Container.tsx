import type { ComponentPropsWithoutRef } from 'react';

import styles from './Container.module.scss';

export function Container(props: ComponentPropsWithoutRef<'div'>) {
  return (
    <div className={styles.container} {...props}/>
  );
}
