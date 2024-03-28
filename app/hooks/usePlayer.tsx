import { useEffect, useState } from 'react';

import { createProvidableHook } from '~/utils/createProvidableHook';

type Props = {
  token: string
};

export const usePlayer = createProvidableHook(({ token }: Props) => {
  const [player, setPlayer] = useState<Spotify.Player>();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const script = document.createElement('script');

    script.src = 'https://sdk.scdn.co/spotify-player.js';
    script.async = true;

    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      setPlayer(new window.Spotify.Player({
        name: 'Web Playback SDK',
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

    player.addListener('ready', () => setReady(true));
    player.addListener('not_ready', ({ device_id }) => setReady(false));
    player.connect();

    return () => {
      player.disconnect();
    };
  }, [player]);

  return [player, ready] as const;
});
