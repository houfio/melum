import { useEffect, useState } from 'react';

import { createProvidableHook } from '~/utils/createProvidableHook';

let hasScript = false;
let loaded = false;

export const usePlaybackSDK = createProvidableHook(() => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (hasScript) {
      setReady(loaded);

      return;
    }

    const script = document.createElement('script');

    script.src = 'https://sdk.scdn.co/spotify-player.js';
    script.async = true;

    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => setReady(loaded = true);
    hasScript = true;
  }, []);

  return ready;
});
