import { clsx } from 'clsx';
import type { ComponentPropsWithoutRef } from 'react';

import styles from './Grid.module.scss';

import { mapStyles } from '~/utils/mapStyles';

type Props = {
  columns?: Record<string, number>,
  gaps?: Record<string, number>
};

export function Grid({ columns = {}, gaps = {}, ...props }: Props & ComponentPropsWithoutRef<'div'>) {
  return (
    <div
      {...props}
      className={clsx(
        styles.grid,
        mapStyles(styles, columns, 'columns-$key-$value'),
        mapStyles(styles, gaps, 'gaps-$key-$value'),
        props.className
      )}
    />
  );
}
