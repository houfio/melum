import { redirect } from 'react-router';
import { getSpotify } from '~/utils/getSpotify';

export const clientLoader = async () => {
  const spotify = await getSpotify();

  spotify.logOut();

  return redirect('/');
};
