import { clsx } from 'clsx';
import type { ComponentPropsWithoutRef } from 'react';

import styles from './Button.module.scss';

type Props = {
  text: string
};

export function Button({ text, ...props }: Props & ComponentPropsWithoutRef<'button'>) {
  return (
    <button
      {...props}
      title={text}
      className={clsx(styles.button, props.className)}
    >
      {text}
    </button>
  );
}
