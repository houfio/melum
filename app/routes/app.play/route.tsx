import type { ClientLoaderFunctionArgs } from '@remix-run/react';
import { useLoaderData } from '@remix-run/react';
import type { Market, PlaylistedTrack, SpotifyApi, Track } from '@spotify/web-api-ts-sdk';
import Fuse from 'fuse.js';
import { useState } from 'react';

import { Button } from '~/components/form/Button';
import { useAudio } from '~/hooks/useAudio';
import { getSpotify } from '~/utils/getSpotify';

async function getPlaylist(sdk: SpotifyApi, market: Market, playlist: string, offset = 0, tracks: PlaylistedTrack<Track>[] = []) {
  const fetched = await sdk.playlists.getPlaylistItems(
    playlist,
    market,
    'items.track(id,uri,name,preview_url,album(id,images,name),artists(id,name)),next,limit',
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
    .filter((track) => track.preview_url)
    .reduce<Track[]>((previous, track) => previous.some((t) => t.id === track.id) ? previous : [
      ...previous,
      track
    ], []);
};

export const shouldRevalidate = () => false;

export default function Play() {
  const tracks = useLoaderData<typeof clientLoader>();
  const { playing, play } = useAudio();
  const [fuse] = useState(() => new Fuse(tracks, {
    keys: [{
      name: 'name',
      weight: 2
    }, {
      name: 'artists.name',
      weight: 1
    }],
    minMatchCharLength: 3,
    threshold: .25
  }));
  const [guessed, setGuessed] = useState<Track[]>([]);
  const [track, setTrack] = useState<Track>();
  const [search, setSearch] = useState('');
  const [clip, setClip] = useState(0);

  const nextTrack = () => {
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

    const next = guessable[Math.floor(Math.random() * guessable.length)];

    setSearch('');
    setTrack(next);
    setClip(0);
    play(next.preview_url!);
  };

  const playNext = () => {
    if (!track) {
      return;
    }

    setClip(clip + 1);
    play(track.preview_url!, clip + 1);
  };

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
        <Button text="Play next clip" disabled={playing} onClick={() => playNext()}/>
        <Button text="Skip song" onClick={() => nextTrack()}/>
      </div>
    </>
  ) : (
    <Button
      text="Start first track"
      onClick={() => nextTrack()}
    />
  );
}
