import type { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { clsx } from 'clsx';
import type { ComponentPropsWithoutRef } from 'react';

import styles from './Button.module.scss';

import type { Breakpoint} from '~/types';

type Props = {
  text: string,
  icon?: IconProp,
  withText?: false | Breakpoint
};

export function Button({ text, icon, withText = 'phone', ...props }: Props & ComponentPropsWithoutRef<'button'>) {
  return (
    <button
      {...props}
      title={text}
      className={clsx(
        styles.button,
        withText && styles[`text-${withText}`],
        props.className
      )}
    >
      {icon && (
        <FontAwesomeIcon icon={icon} className={styles.icon}/>
      )}
      <span className={styles.text}>
        {text}
      </span>
    </button>
  );
}
