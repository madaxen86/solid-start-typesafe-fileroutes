import { cache, createAsync } from '@solidjs/router';

import { Suspense } from 'solid-js';
import { isServer } from 'solid-js/web';

// export const getTime = cache(async () => new Date().toLocaleTimeString(), 'getTime');
export default function Home() {
  // const time = createAsync(() => getTime());

  return (
    <main class="text-center mx-auto  p-4">
      {/* <pre>{JSON.stringify(routes()?.map(r => r.path), undefined, 2)}</pre> */}
      {/* <p class="">{JSON.stringify(generateRouteManifest(fileRoutes), undefined, 2)}</p> */}
      asdasda <Suspense>{'asds'}</Suspense>
    </main>
  );
}
