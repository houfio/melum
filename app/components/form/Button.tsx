import type { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faRotate } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { clsx } from 'clsx';
import type { ComponentPropsWithoutRef, ElementType } from 'react';
import { useNavigation } from 'react-router';

import styles from './Button.module.scss';

import type { Breakpoint } from '~/types';

type Props<T> = {
  as?: T,
  text: string,
  chip?: string,
  icon?: IconProp,
  withText?: false | Breakpoint,
  loading?: boolean
};

export function Button<T extends ElementType = 'button'>({
  as,
  text,
  chip,
  icon,
  withText = 'phone',
  loading,
  ...props
}: Props<T> & ComponentPropsWithoutRef<T>) {
  const { state } = useNavigation();

  loading ||= (props.type === 'submit' && state === 'submitting');
  const disabled = props.disabled || loading || state === 'loading';
  const Component = as ?? 'button';

  return (
    <Component
      {...props}
      title={text}
      className={clsx(
        styles.button,
        disabled && styles.disabled,
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
        {chip && (
          <span className={styles.chip}>
            {chip}
          </span>
        )}
      </div>
      {loading && (
        <FontAwesomeIcon icon={faRotate} spin={true} className={styles.spinner}/>
      )}
    </Component>
  );
}
