import { redirect } from 'react-router';
import type { Context } from '~/main';
import { middleware } from '~/utils/middleware';

export const handle = { middleware };

export const clientLoader = async (_: unknown, { sdk }: Context) => {
  sdk.logOut();

  return redirect('/');
};
