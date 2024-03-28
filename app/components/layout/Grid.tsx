import { clsx } from 'clsx';
import type { ComponentPropsWithoutRef } from 'react';

import styles from './Grid.module.scss';

import type { Breakpoints } from '~/types';
import { mapStyles } from '~/utils/mapStyles';

type Props = {
  columns?: Breakpoints<number>,
  gaps?: Breakpoints<number>
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
