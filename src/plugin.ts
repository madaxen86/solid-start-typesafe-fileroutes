import path from 'path';
import type { Plugin } from 'vinxi';
import { debouncedGenerateRouteManifest, generateRouteManifest } from './routeManifest';
import { isValidFile } from './utils';

interface PluginProps {
  routeDir: string;
  outDir: string;
}

export default function routeManifestPlugin(
  { routeDir, outDir }: PluginProps = { routeDir: 'src/routes', outDir: './src/RouteManifest' },
): Plugin {
  const targetDir = path.resolve(outDir);
  return {
    name: 'vite-plugin-route-manifest',
    enforce: 'post',
    async configResolved(config) {
      if (!config.app.config.name)
        throw new Error('`RouteManifestPlugin` requires to be used with solid-start / vinxi');

      if (config.router.name === 'ssr') {
        //use the ssr router to include API routes
        // TODO: get routeDir from config and set routeRootPath
        await generateRouteManifest(targetDir);
      }
    },
    async handleHotUpdate({ file }) {
      if (!isValidFile(file, routeDir)) return;

      await debouncedGenerateRouteManifest(targetDir);
    },
    async watchChange(filePath) {
      if (!isValidFile(filePath, routeDir)) return;
      await debouncedGenerateRouteManifest(targetDir);
    },
  };
}
