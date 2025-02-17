import { cache, createAsync } from '@solidjs/router';
import { getRoutes } from '@src/utils';
import { Suspense } from 'solid-js';
import { isServer } from 'solid-js/web';

// export const getTime = cache(async () => new Date().toLocaleTimeString(), 'getTime');
export const routes = async () => {
  'use server';
  console.log(isServer, '**');

  return await getRoutes();
};
export default function Home() {
  // const time = createAsync(() => getTime());
  const r = createAsync(async () => {
    'use server';
    console.log(isServer, '**');

    return await getRoutes();
  });
  return (
    <main class="text-center mx-auto  p-4">
      {/* <pre>{JSON.stringify(routes()?.map(r => r.path), undefined, 2)}</pre> */}
      {/* <p class="">{JSON.stringify(generateRouteManifest(fileRoutes), undefined, 2)}</p> */}
      asdasda <Suspense>{r()}</Suspense>
    </main>
  );
}
