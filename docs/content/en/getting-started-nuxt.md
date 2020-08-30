---
title: Getting started (Nuxt)
description: 'Vanilla, strongly-typed store accessor.'
category: Getting started
position: 2
---

## Install module

1. Install Nuxt module:

  <code-group>
    <code-block label="Yarn" active>

    ```bash
    yarn add nuxt-typed-vuex
    ```

    </code-block>
    <code-block label="NPM">

    ```bash
    npm install nuxt-typed-vuex --save
    ```

    </code-block>

  </code-group>

    <alert type="info">This will also install `typed-vuex` in your project, which is where the store accessor lives. You can import its helper functions from either `nuxt-typed-vuex` or from `typed-vuex`.</alert>

2. Add module to your `nuxt.config`:

   ```ts
   buildModules: [
     'nuxt-typed-vuex',
   ],
   ```

   <alert type="info">

   `buildModules` require Nuxt 2.10+. If you are using an older version, add `nuxt-typed-vuex` to `modules` instead.

    </alert>

3. You will need to transpile this module, by adding the following to your `nuxt.config`:

   ```ts{}[nuxt.config.js]
   build: {
     transpile: [
       /typed-vuex/,
     ],
   },
   ```

## Add type definitions

The module will inject a store accessor throughout your project (`$accessor`). It is not typed by default, so you will need to add types.

### Defining the accessor type

In your root store module, add the following code:

```ts{}[store/index.ts]
import { getAccessorType } from 'typed-vuex'

// Import all your submodules
import * as submodule from '~/store/submodule'

// Keep your existing vanilla Vuex code for state, getters, mutations, actions, plugins, etc.
// ...

// This compiles to nothing and only serves to return the correct type of the accessor
export const accessorType = getAccessorType({
  state,
  getters,
  mutations,
  actions,
  modules: {
    // The key (submodule) needs to match the Nuxt namespace (e.g. ~/store/submodule.ts)
    submodule,
  },
})
```

<alert type="info">This may look different if you split your modules into separate files for `state`, `actions`, `mutations` and `getters`.</alert>

### Creating type definitions

Add the following type definitions to your project:

```ts{}[index.d.ts]
import { accessorType } from '~/store'

declare module 'vue/types/vue' {
  interface Vue {
    $accessor: typeof accessorType
  }
}

declare module '@nuxt/types' {
  interface NuxtAppOptions {
    $accessor: typeof accessorType
  }
}
```
