import { persistentAtom } from '@nanostores/persistent';
import type { Track } from '@spotify/web-api-ts-sdk';

type Game = {
  playlists: string[],
  guessed: string[],
  skipped: string[],
  track?: string,
  score: number
};

export const $currentGame = persistentAtom<Game | undefined>('game', undefined, {
  decode: JSON.parse,
  encode: JSON.stringify
});

export function startGame(playlists: string[]) {
  $currentGame.set({
    playlists,
    guessed: [],
    skipped: [],
    score: 0
  });
}

export function setGuessed(score: number) {
  const current = $currentGame.get();

  if (!current?.track) {
    return;
  }

  $currentGame.set({
    ...current,
    guessed: [
      ...current.guessed,
      current.track
    ],
    score: current.score + score
  });
}

export function setSkipped() {
  const current = $currentGame.get();

  if (!current?.track) {
    return;
  }

  $currentGame.set({
    ...current,
    skipped: [
      ...current.skipped,
      current.track
    ]
  });
}

export function setNextTrack(tracks: Track[], fn: (track: Track) => void) {
  const current = $currentGame.get();

  if (!current) {
    return;
  }

  const guessable = tracks.filter((t) => !current.guessed.includes(t.id) && !current.skipped.includes(t.id));

  if (!guessable.length) {
    return;
  }

  const track = guessable[Math.floor(Math.random() * guessable.length)];

  $currentGame.set({
    ...current,
    track: track.id
  });

  fn(track);
}
