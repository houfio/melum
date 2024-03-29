import type { ClientActionFunctionArgs, ClientLoaderFunctionArgs, ShouldRevalidateFunction } from '@remix-run/react';
import { Form, useLoaderData } from '@remix-run/react';

import { Paginated } from '~/components/Paginated';
import { Button } from '~/components/form/Button';
import { Container } from '~/components/layout/Container';
import { Grid } from '~/components/layout/Grid';
import { usePlayer } from '~/hooks/usePlayer';
import { getSpotify } from '~/utils/getSpotify';
import { wait } from '~/utils/wait';

export const clientLoader = async ({ request }: ClientLoaderFunctionArgs) => {
  const url = new URL(request.url);
  const offset = Number(url.searchParams.get('offset')) || 0;
  const sdk = await getSpotify();

  return sdk.currentUser.playlists.playlists(20, offset);
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
  const playlists = useLoaderData<typeof clientLoader>();
  const [, , deviceId] = usePlayer();

  return (
    <Container>
      Select the playlists that you want to include
      {deviceId && (
        <Paginated
          data={playlists}
          render={(data) => (
            <Grid columns={{ phone: 2, tablet: 3, laptop: 4, desktop: 5 }}>
              {data.map((playlist) => (
                <Form key={playlist.id} method="post">
                  <input name="deviceId" type="hidden" value={deviceId}/>
                  <input name="uri" type="hidden" value={playlist.uri}/>
                  <Button text={playlist.name}/>
                </Form>
              ))}
            </Grid>
          )}
        />
      )}
    </Container>
  );
}
