import type { ClientLoaderFunctionArgs } from '@remix-run/react';
import { useLoaderData } from '@remix-run/react';

import { Paginated } from '~/components/Paginated';
import { Container } from '~/components/layout/Container';
import { Grid } from '~/components/layout/Grid';
import { usePlayer } from '~/hooks/usePlayer';
import { getSpotify } from '~/utils/getSpotify';

export const clientLoader = async ({ request }: ClientLoaderFunctionArgs) => {
  const url = new URL(request.url);
  const offset = Number(url.searchParams.get('offset')) || 0;
  const sdk = await getSpotify();

  return sdk.currentUser.playlists.playlists(20, offset);
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
            <Grid gaps={{ phone: 1, laptop: 2 }} columns={{ phone: 2, tablet: 3, laptop: 5, desktop: 6 }}>
              {data.map((playlist) => (
                <span key={playlist.id}>
                  {playlist.name}
                </span>
              ))}
            </Grid>
          )}
        />
      )}
    </Container>
  );
}
