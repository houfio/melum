import type { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faRotate } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { clsx } from 'clsx';
import type { ComponentPropsWithoutRef } from 'react';
import { useNavigation } from 'react-router';

import styles from './Button.module.scss';

import type { Breakpoint } from '~/types';

type Props = {
  text: string,
  icon?: IconProp,
  withText?: false | Breakpoint,
  loading?: boolean
};

export function Button({ text, icon, withText = 'phone', loading, ...props }: Props & ComponentPropsWithoutRef<'button'>) {
  const { state } = useNavigation();

  loading ||= (props.type === 'submit' && state === 'submitting');
  const disabled = props.disabled || loading || state === 'loading';

  return (
    <button
      {...props}
      title={text}
      className={clsx(
        styles.button,
        withText && styles[`text-${withText}`],
        props.className
      )}
      disabled={disabled}
    >
      <div className={clsx(loading && styles.loading)}>
        {icon && (
          <FontAwesomeIcon icon={icon} className={styles.icon}/>
        )}
        <span className={styles.text}>
          {text}
        </span>
      </div>
      {loading && (
        <FontAwesomeIcon icon={faRotate} spin={true} className={styles.spinner}/>
      )}
    </button>
  );
}
