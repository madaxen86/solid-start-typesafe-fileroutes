import { getRequestEvent, isServer } from 'solid-js/web';
import { App } from 'vinxi';
import { BaseFileSystemRouter } from 'vinxi/dist/types/lib/fs-router';
import { ResolvedConfig } from 'vite';

export type VinxiFileRoute = { path: string; page: boolean; filePath: string };

let router: BaseFileSystemRouter | undefined;

export async function getRoutes(config?: ResolvedConfig): Promise<string[]> {
  if (!router) {
    if (config) {
      router = config.router.internals.routes;
    } else {
      const app = (globalThis as any).app as App; //app added by vinxi
      router = app?.getRouter?.('ssr').internals.routes;
    }
  }

  if (!router) return [];

  const fileroutes = (await router.getRoutes()) as VinxiFileRoute[];

  if (!fileroutes) throw new Error('Could not get router from vinxi app');

  const filteredRoutes = fileroutes
    .filter(
      route =>
        // (route.page || route.path.startsWith('/api')) &&
        !isLayout(route.path, route.filePath, fileroutes),
    )
    .map(({ path }) => cleanPath(path))
    .sort((a, b) => a.length - b.length);

  return filteredRoutes;
}
export function cleanPath(path: string) {
  return (
    path
      .replace(/\(.*?\)/gi, '')
      // remove double slashes
      .replace(/\/\//gi, '/')
      .replace('*', ':')
  );
}

export const isValidFile = (path: string, routeRootPath: string) =>
  path.includes(routeRootPath) &&
  !path.endsWith('RouteManifest/index.js') &&
  !path.endsWith('RouteManifest/index.d.ts') &&
  path.match(/\.[tj]sx?$/gi);

export function isLayout(route: string, filePath: string, allRoutes: VinxiFileRoute[]): boolean {
  // Check if any route in allRoutes starts with route + "/"
  return allRoutes.some(r => r.path.startsWith(route + '/') && r.filePath !== filePath);
}
