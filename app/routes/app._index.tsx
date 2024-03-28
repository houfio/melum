import { usePlayer } from '~/hooks/usePlayer';

export default function AppIndex() {
  const [, ready] = usePlayer();

  return (
    <div>
      {ready ? 'ready' : 'not ready'} to play music
    </div>
  );
}
