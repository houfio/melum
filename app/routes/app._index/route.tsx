import { faPlay, faSquareCheck, faSquareXmark } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { count } from '@nanostores/i18n';
import { useStore } from '@nanostores/react';
import { clsx } from 'clsx';
import { useState } from 'react';
import {
  type ActionFunctionArgs,
  Form,
  type LoaderFunctionArgs,
  redirect,
  useLoaderData,
  useNavigation
} from 'react-router';
import { Table } from '~/components/Table';
import { Button } from '~/components/form/Button';
import type { Context } from '~/main';
import { startGame } from '~/stores/game';
import { i18n } from '~/stores/i18n';
import { getImage } from '~/utils/getImage';
import styles from './route.module.scss';

const messages = i18n('playlists', {
  start: count({
    one: 'Start with {count} playlist',
    many: 'Start with {count} playlists'
  }),
  select: 'Select the playlists that you want to include',
  selected: 'Selected',
  notSelected: 'Not selected'
});

export const clientLoader = async ({ request }: LoaderFunctionArgs, { sdk }: Context) => {
  const url = new URL(request.url);
  const offset = Number(url.searchParams.get('offset')) || 0;

  return sdk.currentUser.playlists.playlists(20, offset);
};

export const clientAction = async ({ request }: ActionFunctionArgs) => {
  const data = await request.formData();
  const playlists = data.getAll('playlist');

  startGame(playlists as string[]);

  return redirect('/app/play');
};

export default function AppIndex() {
  const loaderData = useLoaderData<typeof clientLoader>();
  const t = useStore(messages);
  const { state } = useNavigation();
  const [selected, setSelected] = useState<string[]>([]);

  return (
    <div className={styles.wrapper}>
      <Form method="post">
        {selected.map((id) => (
          <input key={id} name="playlist" type="hidden" value={id} />
        ))}
        <Button
          text={t.start(selected.length)}
          icon={faPlay}
          loading={state === 'loading'}
          disabled={!selected.length}
          type="submit"
        />
      </Form>
      {t.select}
      <Table
        data={loaderData}
        rowKey="id"
        columns={[
          {
            key: 'name',
            title: 'Name',
            render: (item) => (
              <div className={styles.playlist}>
                <div
                  style={{
                    backgroundImage: `url(${getImage(item.images, 'smallest')?.url})`
                  }}
                  className={styles.image}
                />
                <div className={styles.text}>
                  {item.name}
                  <span className={styles.subtle}>{item.owner.display_name}</span>
                </div>
              </div>
            )
          },
          {
            key: 'tracks',
            title: 'Tracks',
            render: (item) => <span className={styles.subtle}>{item.tracks?.total ?? '-'}</span>
          },
          {
            key: 'id',
            render: (item) => {
              const s = selected.includes(item.id);

              return (
                <span className={clsx(styles.selection, s && styles.selected)}>
                  <FontAwesomeIcon icon={s ? faSquareCheck : faSquareXmark} className={clsx(styles.icon)} />
                  {s ? t.selected : t.notSelected}
                </span>
              );
            }
          }
        ]}
        onClick={(item) =>
          setSelected(selected.includes(item.id) ? selected.filter((id) => id !== item.id) : [...selected, item.id])
        }
      />
    </div>
  );
}
