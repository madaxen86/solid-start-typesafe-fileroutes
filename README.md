<p>
  <img width='100%' src='https://assets.solidjs.com/banner?type=solid-start-typesafe-routes-plugin&background=tiles&project=%20' alt='solid-start-typesafe-routes-plugin'>
</p>

# solid-start-typesafe-routes-plugin

[![pnpm](https://img.shields.io/badge/maintained%20with-pnpm-cc00ff.svg?style=for-the-badge&logo=pnpm)](https://pnpm.io/)

This plugin for solid-start will create a route manifest which provides type-safe routes based on the file-routing.
As solid-start itself this plugin is also router agnostic. So it'll work with any router which is able to include solid-start's `FileRoutes` component.

## Installation

```bash
npm i --save-dev solid-start-typesafe-routes-plugin
```

```bash
yarn add -D solid-start-typesafe-routes-plugin
```

```bash
pnpm add -D solid-start-typesafe-routes-plugin
```

## Usage

### Add the plugin to your `app.config.ts`

```ts
interface PluginProps {
  routeDir: string; //default: 'src/routes' - path to the file routes root
  outDir: string; // default: './src/RouteManifest' - path where the output files are written to
}
```

```ts
//app.config.ts
import { SolidStartTypesafeRouterPlugin } from 'solid-start-typesafe-routes-plugin';
defineConfig({
  vite: {
    plugins: [SolidStartTypesafeRouterPlugin()],
  },
});
```

The plugin will create an `index.js` and `index.d.ts`the in `src/RouteManifest`.

Layouts will be ignored.

Updates automatically on

1. `pnpm build`
2. `pnpm dev` on startup of the dev server and when a file is `created/moved/deleted` in the `src/routes` directory

Assuming this routes

```
src
└─routes
  │   index.tsx
  │   about.tsx
  │
  └─posts
  │    [slug].tsx
  │
  └───multiple
  │   │
  │   └───[first]
  │          │
  │          └─[second]
  │                [third].tsx
  │                add.tsx
  │
  └───auth(layout)
           [userId].tsx
```

You can get the routes like

```ts
import { Routes } from '~/RouteManifest';

Routes().index; // => '/'
Routes().about.index; // => '/about'

Routes().posts.slug('hello-world').index; // => '/posts/hello-world'

Routes().multiple.first('a').second('b').third('c').index; // => '/multiple/a/b/c'
Routes().multiple.first('a').second('b').third('c').add.index; // => '/multiple/a/b/c/add'

Routes().auth.userId('xyz').index; // => '/auth/xyz'

// Pass searchparams to routes
Routes({ q: 'apples' }).index; // => '/?q=apples'
```

So use it like

```tsx
<a href={Routes().posts.slug('hello-world').index}> ... </a>

<Link href={Routes().posts.slug('hello-world').index} isActive={Routes().posts.slug('hello-world').index === location.pathname}>...</Link>

// -----------------------------------------

import {useNavigate} from '@solidjs/router';

const navigate = useNavigate();
navigate(Routes({q:"hello"}).posts.index)
```
