import { faPlay, faSquareCheck, faSquareXmark } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { ClientActionFunctionArgs, ClientLoaderFunctionArgs} from '@remix-run/react';
import { redirect , Form, useLoaderData } from '@remix-run/react';
import { clsx } from 'clsx';
import { useState } from 'react';
import { useNavigation } from 'react-router';

import styles from './route.module.scss';

import { Table } from '~/components/Table';
import { Button } from '~/components/form/Button';
import { useProfile } from '~/hooks/useProfile';
import { getImage } from '~/utils/getImage';
import { getSpotify } from '~/utils/getSpotify';

export const clientLoader = async ({ request }: ClientLoaderFunctionArgs) => {
  const sdk = await getSpotify();
  const url = new URL(request.url);
  const offset = Number(url.searchParams.get('offset')) || 0;

  return sdk.currentUser.playlists.playlists(20, offset);
};

export const clientAction = async ({ request }: ClientActionFunctionArgs) => {
  const data = await request.formData();
  const params = new URLSearchParams(data as unknown as URLSearchParams);

  return redirect(`/app/play?${params.toString()}`)
};

export default function AppIndex() {
  const { state } = useNavigation()
  const playlists = useLoaderData<typeof clientLoader>();
  const profile = useProfile();
  const [selected, setSelected] = useState<string[]>([]);

  return (
    <>
      <Form method="post">
        <input name="country" type="hidden" value={profile.country}/>
        {selected.map((id) => (
          <input key={id} name="playlist" type="hidden" value={id}/>
        ))}
        <Button
          text={`Start with ${selected.length} playlist(s)`}
          icon={faPlay}
          loading={state === 'loading'}
          disabled={!selected.length}
          type="submit"
          className={styles.big}
        />
      </Form>
      Select the playlists that you want to include
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
            const s = selected.includes(item.id);

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
        onClick={(item) => setSelected(selected.includes(item.id) ? selected.filter((id) => id !== item.id) : [
          ...selected,
          item.id
        ])}
      />
    </>
  );
}
