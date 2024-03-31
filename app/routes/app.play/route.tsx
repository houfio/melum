import { faRotateLeft } from '@fortawesome/pro-regular-svg-icons';
import type { ClientActionFunctionArgs, ClientLoaderFunctionArgs } from '@remix-run/react';
import { useFetcher, useLoaderData } from '@remix-run/react';
import type { Market, PlaylistedTrack, SpotifyApi, Track } from '@spotify/web-api-ts-sdk';
import Fuse from 'fuse.js';
import { useEffect, useState } from 'react';

import { Button } from '~/components/form/Button';
import { usePlayer } from '~/hooks/usePlayer';
import { getSpotify } from '~/utils/getSpotify';
import { wait } from '~/utils/wait';

async function getPlaylist(sdk: SpotifyApi, market: Market, playlist: string, offset = 0, tracks: PlaylistedTrack<Track>[] = []) {
  const fetched = await sdk.playlists.getPlaylistItems(
    playlist,
    market,
    'items.track(id,uri,name,preview_url,is_playable,album(id,images,name),artists(id,name)),next,limit',
    undefined,
    offset
  );
  const result = [
    ...tracks,
    ...fetched.items
  ];

  if (!fetched.next) {
    return result;
  }

  return getPlaylist(sdk, market, playlist, offset + fetched.limit, result);
}

export const clientLoader = async ({ request }: ClientLoaderFunctionArgs) => {
  const sdk = await getSpotify();
  const url = new URL(request.url);
  const country = url.searchParams.get('country');
  const playlists = url.searchParams.getAll('playlist');
  const data = await Promise.all(playlists.map((playlist) => getPlaylist(sdk, country as Market, playlist)));

  return data
    .flat()
    .map(({ track }) => track)
    .filter((track) => track.is_playable)
    .reduce<Track[]>((previous, track) => previous.some((t) => t.id === track.id) ? previous : [
      ...previous,
      track
    ], []);
};

export const clientAction = async ({ request }: ClientActionFunctionArgs) => {
  const sdk = await getSpotify();
  const data = await request.formData();

  const deviceId = data.get('deviceId');
  const uri = data.get('uri');

  if (typeof deviceId !== 'string' || typeof uri !== 'string') {
    throw new Error();
  }

  await sdk.player.startResumePlayback(deviceId, undefined, [uri]);
  await wait(1000);
  await sdk.player.pausePlayback(deviceId);

  return { ok: true };
};

export const shouldRevalidate = () => false;

export default function Play() {
  const tracks = useLoaderData<typeof clientLoader>();
  const [fuse] = useState(() => new Fuse(tracks, {
    keys: [{
      name: 'name',
      weight: 2
    }, {
      name: 'artists.name',
      weight: 1
    }],
    minMatchCharLength: 3,
    threshold: .1
  }));
  const [, , deviceId] = usePlayer();
  const [guessed, setGuessed] = useState<Track[]>([]);
  const [track, setTrack] = useState<Track>();
  const [search, setSearch] = useState('');
  const fetcher = useFetcher();

  useEffect(() => {
    if (!deviceId || !track) {
      return;
    }

    const data = new FormData();

    data.set('deviceId', deviceId);
    data.set('uri', track.uri);

    fetcher.submit(data, {
      method: 'post'
    });
  }, [deviceId, track]);

  function nextTrack() {
    if (track) {
      setGuessed([
        ...guessed,
        track
      ]);
    }

    const guessable = tracks.filter((track) => !guessed.includes(track));

    if (guessable.length <= 1) {
      return;
    }

    setSearch('');
    setTrack(guessable[Math.floor(Math.random() * guessable.length)]);
  }

  return track ? (
    <>
      <input value={search} onChange={(e) => setSearch(e.target.value)}/>
      {fuse.search(search).map(({ item }) => (
        <Button
          key={item.id}
          text={`${item.artists.map((a) => a.name).join(', ')} - ${item.name}`}
          onClick={() => {
            if (track.id === item.id) {
              nextTrack();
            }
          }}
        />
      ))}
      <div>
        <Button text="Skip song" onClick={() => nextTrack()}/>
        <fetcher.Form method="post">
          <input name="deviceId" type="hidden" value={deviceId}/>
          <input name="uri" type="hidden" value={track.uri}/>
          <Button text="Play again" icon={faRotateLeft} type="submit" disabled={fetcher.state !== 'idle'}/>
        </fetcher.Form>
      </div>
    </>
  ) : (
    <Button
      text="Start first track"
      onClick={() => nextTrack()}
    />
  );
}
