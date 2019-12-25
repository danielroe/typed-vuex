---
---

# Getting started (Nuxt)

## Install module

1. Install Nuxt module:

   ```bash
   # yarn
   yarn add nuxt-typed-vuex

   # npm
   npm i nuxt-typed-vuex
   ```

   ::: tip
   This will also install `typed-vuex` in your project, which is where the store accessor lives. You can import its helper functions from either `nuxt-typed-vuex` or from `typed-vuex`.
   :::

2. Add module to your `nuxt.config`:

   ```ts
   buildModules: [
     'nuxt-typed-vuex',
   ],
   ```

   ::: tip
   `buildModules` require Nuxt 2.10+. If you are using an older version, add `nuxt-typed-vuex` to `modules` instead.
   :::

3. You will need to transpile this module, by adding the following to your `nuxt.config`:

   ```ts
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

`store/index.ts`

```ts
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

::: tip
This may look different if you split your modules into separate files for `state`, `actions`, `mutations` and `getters`.
:::

::: warning
Typescript 3.7 has brought some limitations on type inference. Specifically, there is now an issue with an accessor type used in the same module that exports it. So if you wish to reference child modules from within your actions in `~/store/index.ts`, you may need to exclude those actions from the accessor type:

```ts
export const accessorType = getAccessorType({
  state,
  getters,
  mutations,
  // actions,
  modules: {
    // The key (submodule) needs to match the Nuxt namespace (e.g. ~/store/submodule.ts)
    submodule,
  },
})
```

:::

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
