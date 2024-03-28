import { clsx } from 'clsx';
import type { ComponentPropsWithoutRef } from 'react';

import styles from './Container.module.scss';

export function Container(props: ComponentPropsWithoutRef<'div'>) {
  return (
    <div {...props} className={clsx(styles.container, props.className)}/>
  );
}
