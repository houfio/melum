import { useEffect, useState } from 'react';

import { createProvidableHook } from '~/utils/createProvidableHook';

type Props = {
  token: string
};

export const usePlayer = createProvidableHook(({ token }: Props) => {
  const [player, setPlayer] = useState<Spotify.Player>();
  const [state, setState] = useState<Spotify.PlaybackState>();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const script = document.createElement('script');

    script.src = 'https://sdk.scdn.co/spotify-player.js';
    script.async = true;

    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      setPlayer(new window.Spotify.Player({
        name: 'Melum',
        getOAuthToken: (cb) => cb(token)
      }));
    };

    return () => {
      document.body.removeChild(script);
    };
  }, [token]);

  useEffect(() => {
    if (!player) {
      return;
    }

    player.addListener('player_state_changed', (state) => setState(state));
    player.addListener('ready', () => setReady(true));
    player.addListener('not_ready', () => setReady(false));
    player.connect();

    return () => {
      player.disconnect();
    };
  }, [player]);

  return [player, state, ready] as const;
});
