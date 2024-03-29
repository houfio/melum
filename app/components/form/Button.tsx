import type { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faRotate } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useFetchers } from '@remix-run/react';
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
  const fetchers = useFetchers();

  function isState(s: string) {
    return state === s || fetchers.some((f) => f.state === s);
  }

  loading ||= (props.type === 'submit' && isState('submitting'));
  const disabled = props.disabled || loading || isState('loading');

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
