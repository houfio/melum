import { faRotate } from '@fortawesome/pro-regular-svg-icons';
import { useFetcher } from '@remix-run/react';
import type { Page } from '@spotify/web-api-ts-sdk';
import { clsx } from 'clsx';
import type { ReactNode} from 'react';
import { useEffect, useState } from 'react';

import styles from './Table.module.scss';

import { Button } from '~/components/form/Button';

type Props<T> = {
  data?: Page<T>,
  rowKey: keyof T,
  columns: {
    key: keyof T & string,
    title?: string,
    render?: (item: T) => ReactNode
  }[],
  onClick?: (item: T) => void
};

export function Table<T>({ data, rowKey, columns, onClick }: Props<T>) {
  const fetcher = useFetcher<Page<T>>();
  const [offset, setOffset] = useState(data?.offset ?? -1);
  const [items, setItems] = useState(data?.items ?? []);

  useEffect(() => {
    setOffset(data?.offset ?? -1);
    setItems(data?.items ?? []);
  }, [data]);

  useEffect(() => {
    if (!fetcher.data) {
      return;
    }

    const { items, offset, next } = fetcher.data;

    setOffset(next ? offset : -1);
    setItems((i) => [...i, ...items as T[]]);
  }, [fetcher.data]);

  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            {columns.map(({ key, title }) => (
              <th key={key} className={clsx(styles.head, !title && styles.shrink)}>
                {title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items.length ? items.map((item) => (
            <tr
              key={String(item[rowKey])}
              tabIndex={onClick ? 0 : undefined}
              className={clsx(onClick && styles.clickable)}
              onClick={() => onClick?.(item)}
              onKeyUp={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  onClick?.(item);
                }
              }}
            >
              {columns.map(({ key, render }) => (
                <td key={key} className={styles.item}>
                  {render?.(item) ?? String(item[key])}
                </td>
              ))}
            </tr>
          )) : (
            <tr>
              <td colSpan={columns.length}>
                empty
              </td>
            </tr>
          )}
          {offset >= 0 && (
            <tr>
              <td colSpan={columns.length} className={styles.item}>
                <fetcher.Form>
                  <input name="offset" type="hidden" value={offset + (data?.limit ?? 0)}/>
                  <Button
                    text="Load more"
                    icon={faRotate}
                    type="submit"
                    loading={fetcher.state === 'loading'}
                  />
                </fetcher.Form>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
