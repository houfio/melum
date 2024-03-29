import type { ClientActionFunctionArgs, ShouldRevalidateFunction } from '@remix-run/react';
import { Form, useLoaderData } from '@remix-run/react';

import { Button } from '~/components/form/Button';
import { Container } from '~/components/layout/Container';
import { usePlayer } from '~/hooks/usePlayer';
import { getSpotify } from '~/utils/getSpotify';
import { wait } from '~/utils/wait';

export const clientLoader = async () => {
  const sdk = await getSpotify();

  return {
    playlists: await sdk.currentUser.playlists.playlists()
  };
};

export const clientAction = async ({ request }: ClientActionFunctionArgs) => {
  const data = await request.formData();
  const sdk = await getSpotify();

  const deviceId = data.get('deviceId');
  const uri = data.get('uri');

  if (typeof deviceId !== 'string' || typeof uri !== 'string') {
    throw new Error();
  }

  await sdk.player.startResumePlayback(deviceId, uri);
  await wait(2500);
  await sdk.player.pausePlayback(deviceId);

  return { ok: true };
};

export const shouldRevalidate: ShouldRevalidateFunction = ({ defaultShouldRevalidate, formMethod }) => {
  return defaultShouldRevalidate && formMethod !== 'POST';
};

export default function AppIndex() {
  const { playlists } = useLoaderData<typeof clientLoader>();
  const [, , deviceId] = usePlayer();

  return (
    <Container>
      {deviceId && (
        <div>
          {playlists.items.map((playlist) => (
            <Form key={playlist.id} method="post">
              <input name="deviceId" type="hidden" value={deviceId}/>
              <input name="uri" type="hidden" value={playlist.uri}/>
              <Button text={playlist.name}/>
            </Form>
          ))}
        </div>
      )}
    </Container>
  );
}
