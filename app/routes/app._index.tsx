import { Button } from '~/components/form/Button';
import { usePlayer } from '~/hooks/usePlayer';

export default function AppIndex() {
  const [player, state, ready] = usePlayer();

  return (
    <div>
      <Button text="Toggle play" onClick={() => player?.togglePlay()}/>
      {ready ? 'ready' : 'not ready'}
      <pre>
        {JSON.stringify(state, undefined, 2)}
      </pre>
    </div>
  );
}
