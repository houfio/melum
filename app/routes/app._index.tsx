import { Container } from '~/components/layout/Container';
import { usePlayer } from '~/hooks/usePlayer';

export default function AppIndex() {
  const [, state, ready] = usePlayer();

  return (
    <Container>
      {ready ? 'ready' : 'not ready'}
      <pre>
        {JSON.stringify(state, undefined, 2)}
      </pre>
    </Container>
  );
}
