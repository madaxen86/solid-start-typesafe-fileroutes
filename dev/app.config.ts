import { defineConfig } from '@solidjs/start/config';
import typedRoutesPlugin from '../src/index';
export default defineConfig({
  vite: {
    plugins: [typedRoutesPlugin()],
  },
});
