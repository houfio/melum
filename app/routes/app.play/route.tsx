import { faForward, faForwardStep } from '@fortawesome/pro-regular-svg-icons';
import { params } from '@nanostores/i18n';
import { useStore } from '@nanostores/react';
import type { PlaylistedTrack, SpotifyApi, Track } from '@spotify/web-api-ts-sdk';
import Fuse from 'fuse.js';
import { useState } from 'react';
import { redirect } from 'react-router';
import { TrackEntry } from '~/components/TrackEntry';
import { Button } from '~/components/form/Button';
import { useAudio } from '~/hooks/useAudio';
import { $currentGame, setGuessed, setNextTrack, setSkipped } from '~/stores/game';
import { i18n } from '~/stores/i18n';
import { getSpotify } from '~/utils/getSpotify';
import type { Route } from './+types/route';
import styles from './route.module.scss';

const messages = i18n('play', {
  start: 'Start first track',
  search: 'Search...',
  next: 'Play next second',
  skip: 'Skip song',
  guessed: 'You got it!',
  skipped: 'Too bad',
  score: params('Score: {score}')
});

async function getPlaylist(sdk: SpotifyApi, playlist: string, offset = 0, tracks: PlaylistedTrack<Track>[] = []) {
  const fetched = await sdk.playlists.getPlaylistItems(
    playlist,
    undefined,
    'items.track(id,uri,name,preview_url,album(id,images,name),artists(id,name)),next,limit',
    undefined,
    offset
  );
  const result = [...tracks, ...fetched.items];

  if (!fetched.next) {
    return result;
  }

  return getPlaylist(sdk, playlist, offset + fetched.limit, result);
}

export const clientLoader = async () => {
  const sdk = await getSpotify();
  const currentGame = $currentGame.get();

  if (!currentGame) {
    throw redirect('/app');
  }

  const data = await Promise.all(currentGame.playlists.map((playlist) => getPlaylist(sdk, playlist)));

  return data
    .flat()
    .map(({ track }) => track)
    .filter((track) => track.preview_url)
    .reduce<Track[]>((previous, track) => {
      if (!previous.some((t) => t.id === track.id)) {
        previous.push(track);
      }

      return previous;
    }, []);
};

export const shouldRevalidate = () => false;

export const handle = { game: true };

export default function Play({ loaderData }: Route.ComponentProps) {
  console.log(loaderData);
  const t = useStore(messages);
  const { playing, play } = useAudio();
  const [fuse] = useState(
    () =>
      new Fuse(loaderData, {
        keys: [
          {
            name: 'name',
            weight: 5
          },
          {
            name: 'artists.name',
            weight: 1
          }
        ],
        minMatchCharLength: 3,
        threshold: 0.25
      })
  );
  const currentGame = useStore($currentGame);
  const [score, setScore] = useState(100);
  const [search, setSearch] = useState('');
  const [clip, setClip] = useState(0);

  if (!currentGame) {
    return null;
  }

  const track = loaderData.find((t) => t.id === currentGame.track);
  const guessed = currentGame.guessed.includes(track?.id ?? '');
  const skipped = currentGame.skipped.includes(track?.id ?? '');

  const nextTrack = () =>
    setNextTrack(loaderData, (t) => {
      setScore(100);
      setSearch('');
      setClip(0);
      play(t.preview_url ?? '');
    });

  const playClip = () => {
    if (!track) {
      return;
    }

    setScore(score - 10);
    setClip(clip + 1);
    play(track.preview_url ?? '', clip + 1);
  };

  return (
    <div className={styles.content}>
      {track ? (
        guessed || skipped ? (
          <>
            {guessed ? t.guessed : t.skipped}
            <TrackEntry track={track} />
            {t.score({ score: currentGame.score })}
            <div>
              <Button text="Next" onClick={() => nextTrack()} />
            </div>
          </>
        ) : (
          <>
            <input
              value={search}
              placeholder={t.search}
              className={styles.input}
              onChange={(e) => setSearch(e.target.value)}
            />
            {fuse
              .search(search)
              .slice(0, 3)
              .map(({ item }) => (
                <TrackEntry
                  key={item.id}
                  track={item}
                  onClick={() => {
                    if (track.id === item.id) {
                      setGuessed(score);
                    }
                  }}
                />
              ))}
            <div className={styles.actions}>
              <Button
                text={t.next}
                chip="-10"
                icon={faForwardStep}
                disabled={playing || !score}
                onClick={() => playClip()}
              />
              <Button text={t.skip} chip={`-${score}`} icon={faForward} onClick={() => setSkipped()} />
            </div>
          </>
        )
      ) : (
        <>
          rules
          <Button text={t.start} onClick={() => nextTrack()} />
        </>
      )}
    </div>
  );
}
