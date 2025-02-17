import { defineConfig } from '@solidjs/start/config';
import tsconfigPaths from 'vite-tsconfig-paths';
import Plugin from '../src/plugin'; //
// import path from 'path';
// import { fileURLToPath } from 'url';

// const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
// const __dirname = path.dirname(__filename); // get the name of the directory

const app = defineConfig({
  ssr: false,
  vite: {
    // resolve: {
    //   alias: {
    //     '@src': path.resolve(__dirname, '../src'),
    //     '@plugin': path.resolve(__dirname, '../src/plugin'),
    //   },
    // },
    plugins: [tsconfigPaths({}), Plugin()],
    // build: {
    //   rollupOptions: {
    //     external: ['RouteManifest'],
    //   },
    // },
  },
  middleware: './middleware.ts',
});

export default app;
