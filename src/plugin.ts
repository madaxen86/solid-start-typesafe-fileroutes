import chokidar from 'chokidar';
import path from 'path';
import type { Plugin } from 'vinxi';
import { generateRouteManifest } from './routeManifest';
import { isValidFile } from './utils';

interface PluginProps {
  routeDir: string;
}

export default function RouteManifestPlugin({ routeDir = 'src/routes' }: PluginProps): Plugin {
  return {
    name: 'vite-plugin-route-manifest',
    enforce: 'post',
    async configResolved(config) {
      if (config.router.name === 'client') {
        // TODO: get routeDir from config and set routeRootPath
        await generateRouteManifest();
      }
    },
    async handleHotUpdate({ file }) {
      if (!isValidFile(file, routeDir)) return;

      await generateRouteManifest();
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
        console.log(`File created: ${filePath}`);
        await generateRouteManifest();
      });

      // Handle file deletion
      watcher.on('unlink', async filePath => {
        if (!isValidFile(filePath, routeDir)) return;
        console.log(`File deleted: ${filePath}`);
        await generateRouteManifest();
      });

      server.httpServer?.on('close', () => {
        watcher.close();
      });
    },
  };
}
