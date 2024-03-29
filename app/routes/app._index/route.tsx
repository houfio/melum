import { faSquareCheck, faSquareXmark } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { ClientLoaderFunctionArgs } from '@remix-run/react';
import { useLoaderData } from '@remix-run/react';
import { clsx } from 'clsx';
import { useState } from 'react';

import styles from './route.module.scss';

import { Table } from '~/components/Table';
import { usePlayer } from '~/hooks/usePlayer';
import { getImage } from '~/utils/getImage';
import { getSpotify } from '~/utils/getSpotify';

export const clientLoader = async ({ request }: ClientLoaderFunctionArgs) => {
  const url = new URL(request.url);
  const offset = Number(url.searchParams.get('offset')) || 0;
  const sdk = await getSpotify();

  return sdk.currentUser.playlists.playlists(20, offset);
};

export default function AppIndex() {
  const playlists = useLoaderData<typeof clientLoader>();
  const [, , deviceId] = usePlayer();
  const [selected, setSelected] = useState<string[]>([]);

  return (
    <>
      Select the playlists that you want to include
      {deviceId && (
        <Table
          data={playlists}
          rowKey="id"
          columns={[{
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
                  <span className={styles.owner}>
                    {item.owner.display_name}
                  </span>
                </div>
              </div>
            )
          }, {
            key: 'tracks',
            title: 'Tracks',
            render: (item) => item.tracks?.total ?? '-'
          }, {
            key: 'id',
            render: (item) => {
              const s = selected.includes(item.uri);

              return (
                <span className={clsx(styles.selection, s && styles.selected)}>
                  <FontAwesomeIcon
                    icon={s ? faSquareCheck : faSquareXmark}
                    className={clsx(styles.icon)}
                  />
                  {s ? 'Selected' : 'Not selected'}
                </span>
              );
            }
          }]}
          onClick={(item) => {
            const s = selected.includes(item.uri);

            setSelected(s ? selected.filter((uri) => uri !== item.uri) : [
              ...selected,
              item.uri
            ]);
          }}
        />
      )}
      <pre>
        {JSON.stringify(selected, undefined, 2)}
      </pre>
    </>
  );
}
