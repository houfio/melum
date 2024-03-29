import { useEffect, useRef, useState } from 'react';

import { useInterval } from '~/hooks/useInterval';
import { usePlaybackSDK } from '~/hooks/usePlaybackSDK';
import { createProvidableHook } from '~/utils/createProvidableHook';

type Props = {
  token: string
};

export const usePlayer = createProvidableHook(({ token }: Props) => {
  const sdkReady = usePlaybackSDK();
  const tokenRef = useRef(token);
  const [player, setPlayer] = useState<Spotify.Player>();
  const [state, setState] = useState<Spotify.PlaybackState>();
  const [deviceId, setDeviceId] = useState<string>();

  tokenRef.current = token;

  useEffect(() => {
    if (!sdkReady) {
      return;
    }

    const player = new window.Spotify.Player({
      name: 'Melum',
      getOAuthToken: (cb) => cb(tokenRef.current)
    });

    player.addListener('player_state_changed', (state) => setState(state));
    player.addListener('ready', ({ device_id }) => setDeviceId(device_id));
    player.addListener('not_ready', () => setDeviceId(undefined));

    player.connect()
      .then((success) => success && setPlayer(player));

    return () => {
      player.disconnect();

      setPlayer(undefined);
    };
  }, [sdkReady]);

  useInterval(() => {
    if (!player) {
      return;
    }

    player.getCurrentState()
      .then((state) => setState(state ?? undefined));
  }, deviceId ? 1000 : null);

  return [player, state, deviceId] as const;
});
