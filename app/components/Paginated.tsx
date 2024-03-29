import { useFetcher } from '@remix-run/react';
import type { Page } from '@spotify/web-api-ts-sdk';
import type { ReactNode} from 'react';
import { useEffect , useState } from 'react';

import { Button } from '~/components/form/Button';

type Props<T> = {
  data: Page<T>,
  render: (data: T[]) => ReactNode
};

export function Paginated<T>({ data, render }: Props<T>) {
  const fetcher = useFetcher<Page<T>>();
  const [offset, setOffset] = useState(data.offset);
  const [items, setItems] = useState(data.items);

  useEffect(() => {
    setOffset(data.offset);
    setItems(data.items);
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
    <div>
      {render(items)}
      <fetcher.Form>
        <input name="offset" type="hidden" value={offset + data.limit}/>
        <Button text="Load more" type="submit" disabled={offset < 0}/>
      </fetcher.Form>
    </div>
  );
}
