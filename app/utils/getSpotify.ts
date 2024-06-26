import { redirect } from '@remix-run/react';
import { Scopes, SpotifyApi } from '@spotify/web-api-ts-sdk';

export async function getSpotify(require = true) {
  const sdk = SpotifyApi.withUserAuthorization(
    import.meta.env.VITE_SPOTIFY_CLIENT_ID ?? '',
    import.meta.env.VITE_SPOTIFY_CALLBACK_URL ?? '',
    [...Scopes.playlistRead, ...Scopes.userPlayback]
  );

  if (require && !await sdk.getAccessToken()) {
    throw redirect('/');
  }

  return sdk;
}
