import { ResolvedConfig } from 'vite';

export type _FileRoute = {
  path: string;
  page: boolean;
  filePath?: string;
  $component?: {
    src: string;
  };
};
export type FileRoute = Required<_FileRoute>;
type BaseFileSystemRouter = {
  getRoutes: () => Promise<_FileRoute[]>;
};
let router: BaseFileSystemRouter | undefined;

export async function getRoutes(config?: ResolvedConfig): Promise<string[]> {
  if (!router) {
    const app = (globalThis as any)?.app;
    if (app) router = app?.getRouter?.('client')?.internals?.routes;
    const clientRouter = (globalThis as any)?.ROUTERS?.client;
    if (clientRouter) router = clientRouter;
  }

  if (!router) return [];

  const fileroutes = (await router.getRoutes()).map(r => {
    r;
    if (!r.filePath) return { ...r, filePath: r.$component!.src } as FileRoute;
    return {
      ...r,
      $component: {
        src: r.filePath,
      },
    } as FileRoute;
  });

  if (!fileroutes) throw new Error('Could not get router from fs-router');

  const filteredRoutes = fileroutes
    .filter(
      route =>
        // (route.page || route.path.startsWith('/api')) &&
        !isLayout(route.path, route.filePath, fileroutes),
    )
    .map(({ path }) => cleanPath(path))
    .sort(function (a, b) {
      return a.length - b.length || a.localeCompare(b);
    });

  return filteredRoutes;
}
export function cleanPath(path: string) {
  return (
    path
      .replace(/\(.*?\)/gi, '')
      // remove consecutive slashes
      .replace(/\/+/gi, '/')
      .replace(/(.)\/$/gi, '$1')
      .replace('*', ':')
  );
}

export const isValidFile = (path: string, routeRootPath: string) =>
  path.includes(routeRootPath) &&
  !path.endsWith('RouteManifest/index.js') &&
  !path.endsWith('RouteManifest/index.d.ts') &&
  path.match(/\.[tj]sx?$/gi);

export function isLayout(route: string, filePath: string, allRoutes: FileRoute[]): boolean {
  // Check if any route in allRoutes starts with route + "/"
  return allRoutes.some(r => r.path.startsWith(route + '/') && r.filePath !== filePath);
}
