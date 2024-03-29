import type { ClientLoaderFunctionArgs } from '@remix-run/react';
import { useLoaderData } from '@remix-run/react';
import type { Market } from '@spotify/web-api-ts-sdk';

import { Button } from '~/components/form/Button';
import { usePlayer } from '~/hooks/usePlayer';
import { getSpotify } from '~/utils/getSpotify';

export const clientLoader = async ({ request }: ClientLoaderFunctionArgs) => {
  const sdk = await getSpotify();
  const url = new URL(request.url);
  const country = url.searchParams.get('country');
  const playlists = url.searchParams.getAll('playlist');
  const data = await Promise.all(playlists.map((playlist) => sdk.playlists.getPlaylistItems(playlist, country as Market, 'items.track(id,uri,name,preview_url,is_playable,album(id,images,name),artists(id,name)),next,offset')));

  return data.map((d) => d.items).flat();
};

export default function Play() {
  const tracks = useLoaderData<typeof clientLoader>();
  const [, , deviceId] = usePlayer();

  return (
    <div>
      {tracks.map((track) => (
        <div key={track.track.id}>
          <Button text="Play"/>
          {track.track.artists.map((a) => a.name).join(', ')} - {track.track.name}
        </div>
      ))}
    </div>
  );
}
