import { Button } from '~/components/form/Button';
import { usePlayer } from '~/hooks/usePlayer';

export default function AppIndex() {
  const [player, state] = usePlayer();

  return (
    <div>
      <Button text="Toggle play" onClick={() => player?.togglePlay()}/>
      <pre>
        {JSON.stringify(state, undefined, 2)}
      </pre>
    </div>
  );
}
