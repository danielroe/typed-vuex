---
---

# Getting started

## Install module

1. Install package:

   ```bash
   # yarn
   yarn add nuxt-typed-vuex

   # npm
   npm i nuxt-typed-vuex
   ```

2. Add module to your `nuxt.config`:

   ```ts
   buildModules: [
     'nuxt-typed-vuex',
   ],
   ```

   **Note**: `buildModules` require Nuxt 2.10+. If you are using an older version, add `nuxt-typed-vuex` to `modules` instead.

3. You will need to transpile this module, by adding the following to your `nuxt.config`:

   ```ts
   build: {
     transpile: [
       /nuxt-typed-vuex/,
     ],
   },
   ```

## Add type definitions

### Defining the accessor type

In your root store module, add the following code:

`store/index.ts`

```ts
import { getAccessorType } from 'nuxt-typed-vuex'

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

**Note**: This may look different if you split your modules into separate files for `state`, `actions`, `mutations` and `getters`.

### Creating type definitions

Add the following type definitions to your project:

`index.d.ts`

```ts
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
