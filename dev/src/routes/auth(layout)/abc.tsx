import { action, cache, createAsync, reload, useAction } from '@solidjs/router';
import { onMount, Suspense } from 'solid-js';
import { getRoutes } from '../../../../src/utils';

const routes = cache(async () => getRoutes(), 'routes');
const refetch = action(async () => reload({ revalidate: routes.key }));

const AboutPage = () => {
  console.log('Route');

  return (
    <>
      <p>abC</p>
    </>
  );
};
export default AboutPage;
