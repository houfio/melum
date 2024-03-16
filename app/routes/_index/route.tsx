import type { MetaFunction } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import type { ClientLoaderFunctionArgs } from '@remix-run/react';
import { Form } from '@remix-run/react';

import styles from './route.module.scss';

import { Container } from '~/components/layout/Container';
import { Grid } from '~/components/layout/Grid';
import { getSpotify } from '~/utils/getSpotify';

export const meta: MetaFunction = () => {
  return [
    { title: 'Melum' }
  ];
};

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
      <Grid columns={{ phone: 1, tablet: 2, laptop: 3, desktop: 4 }} gaps={{ tablet: 1, laptop: 2, desktop: 3 }}>
        <span>Anna</span>
        <span>is</span>
        <span>the</span>
        <span>best</span>
      </Grid>
      <Form method="post">
        <button type="submit">
          Login
        </button>
      </Form>
    </Container>
  );
}
