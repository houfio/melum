import type { RefObject} from 'react';
import { useState } from 'react';

import { useEventListener } from '~/hooks/useEventListener';
import { createProvidableHook } from '~/utils/createProvidableHook';
import { wait } from '~/utils/wait';

type Props = {
  audioRef: RefObject<HTMLAudioElement | null>
};

export const useAudio = createProvidableHook(({ audioRef }: Props) => {
  const [playing, setPlaying] = useState(false);
  const volume = useEventListener(audioRef, 'volumechange', 0, (audio) => audio.volume);

  const play = (url: string, offset = 0, duration = 1) => {
    if (!audioRef.current) {
      return;
    }

    audioRef.current.src = url;
    audioRef.current.currentTime = offset * duration;
    audioRef.current.play()
      .then(() => {
        setPlaying(true);

        return wait(duration * 1000);
      })
      .then(() => {
        setPlaying(false);

        audioRef.current!.src = '';
      });
  };

  return {
    playing,
    play,
    volume,
    setVolume: (volume: number) => {
      if (audioRef.current) {
        audioRef.current.volume = volume;
      }
    }
  };
});
