import chokidar from 'chokidar';
import path from 'path';
import type { Plugin } from 'vinxi';
import { generateRouteManifest } from './routeManifest';
import { isValidFile } from './utils';

interface PluginProps {
  routeDir: string;
  outDir: string;
}

export default function RouteManifestPlugin(
  { routeDir, outDir }: PluginProps = { routeDir: 'src/routes', outDir: './src/RoutesManifest' },
): Plugin {
  const targetDir = path.resolve(outDir);
  return {
    name: 'vite-plugin-route-manifest',
    enforce: 'post',
    async configResolved(config) {
      if (config.router.name === 'ssr') {
        // TODO: get routeDir from config and set routeRootPath
        await generateRouteManifest(targetDir);
      }
    },
    async handleHotUpdate({ file }) {
      if (!isValidFile(file, routeDir)) return;

      await generateRouteManifest(targetDir);
    },
    async configureServer(server) {
      // Define the path to watch
      const directoryPath = path.resolve(routeDir);

      // Initialize chokidar watcher
      const watcher = chokidar.watch(directoryPath, {
        persistent: true,
        ignoreInitial: true, // Ignore existing files when initializing watcher
        awaitWriteFinish: true,
      });

      // Handle file creation
      watcher.on('add', async filePath => {
        if (!isValidFile(filePath, routeDir)) return;
        await generateRouteManifest(targetDir);
      });

      // Handle file deletion
      watcher.on('unlink', async filePath => {
        if (!isValidFile(filePath, routeDir)) return;
        await generateRouteManifest(targetDir);
      });

      server.httpServer?.on('close', () => {
        watcher.close();
      });
    },
  };
}
