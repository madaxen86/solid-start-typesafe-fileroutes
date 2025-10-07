import path from 'path';

import { debouncedGenerateRouteManifest, generateRouteManifest } from './routeManifest';
import { isValidFile } from './utils';
import { Plugin } from 'vite';

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
      //@ts-expect-error - cant type vinxi and vite
      if (config.router && config.router?.name === 'ssr') {
        //use the ssr router to include API routes
        // TODO: get routeDir from config and set routeRootPath
        //vinxi
        await generateRouteManifest(targetDir);
      } else {
        //devinxi
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
