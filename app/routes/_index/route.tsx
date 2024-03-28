import type { ClientLoaderFunctionArgs } from '@remix-run/react';
import { Form, redirect } from '@remix-run/react';

import styles from './route.module.scss';

import { Button } from '~/components/form/Button';
import { Container } from '~/components/layout/Container';
import { getSpotify } from '~/utils/getSpotify';

export const clientLoader = async ({ request }: ClientLoaderFunctionArgs) => {
  const sdk = await getSpotify(false);
  const url = new URL(request.url);

  if (!url.searchParams.has('code')) {
    return {};
  }

  await sdk.authenticate();

  return redirect('/app');
};

export const clientAction = async () => {
  const sdk = await getSpotify(false);

  await sdk.authenticate();

  return redirect('/app');
};

export default function Index() {
  return (
    <Container>
      <div className={styles.heading}>
        Melum
      </div>
      <Form method="post">
        <Button text="Login" type="submit"/>
      </Form>
    </Container>
  );
}
