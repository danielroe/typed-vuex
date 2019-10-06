# 🏦 Nuxt Typed Vuex

## Summary

This module provides a store accessor and helper type methods so you can access your normal Nuxt store in a strongly typed way.

**Note**: This has been developed to suit my needs but additional use cases and contributions are very welcome.

![Image showing autocomplete on this.$accessor](./docs/images/screenshot1.png)

![Image showing autocomplete on commit within store](./docs/images/screenshot2.png)

## Usage

Add module to your `nuxt.config`:

```ts
modules: [
  'nuxt-typed-vuex',
],
```

You will now have access to an injected store accessor (`this.$accessor`) throughout your project. Getters, state (if a getter with the same name doesn't already exist), actions and mutations are available at the root level, with submodules nested under their own namespace.

### Typing the accessor

The accessor injected by this module is not typed by default, so you will need to add your own type definitions, for which a helper function, `getAccessorType`, is provided. This function only serves to return the correct type of the accessor so that it can be used where you see fit.

```ts
import { getAccessorType } from 'nuxt-typed-vuex'
import * as store from '~/store'
...

const accessorType = getAccessorType(store)
// Now you can access the type of the accessor.
const accessor: typeof accessorType
```

### Typing actions within the store

I recommend the following patterns:

**Note**: There are a number of helper functions created to assist in typing actions within the store, although they are strictly optional. They do not **transform** the objects provided to them, but simply inject the correct types.

#### State

If there is any ambiguity in your initial object (of particular note are empty arrays), make sure to provide types as well.

```ts
export const state = () => ({
  emails: [] as string[],
})

// If needed, you can define state for use in vanilla Vuex types
export type RootState = ReturnType<typeof state>
```

#### Getters

Vanilla getters are functions that receive state, as well as the other getters. `nuxt-typed-vuex` can't type the getters received, but does provide a helper function to reduce boilerplate:

```ts
// Vanilla

export const getters = {
  email: (state: RootState) => (state.emails.length ? state.emails[0] : ''),
  aDependentGetter: (_state: RootState, getters: any) => getters.email,
}

// Helper function

import { getterTree } from 'nuxt-typed-vuex'

export const getters = getterTree(state, {
  email: state => (state.emails.length ? state.emails[0] : ''),
  aDependentGetter: (_state, getters) => getters.email,
})
```

#### Mutations

Vanilla mutations are functions that receive state and an optional payload. Again, a helper function is provided to reduce boilerplate.

```ts
// Vanilla

export const mutations = {
  setEmail(state: RootState, newValue: string) {
    state.email = newValue
  },

  initialiseStore() {
    console.log('initialised')
  },
}

// Helper function

import { mutationTree } from 'nuxt-typed-vuex'

export const getters = mutationTree(state, {
  setEmail(state, newValue: string) {
    state.email = newValue
  },

  initialiseStore() {
    console.log('initialised')
  },
})
```

#### Actions

Actions are more complicated. In vanilla Vuex, they can either be objects (not supported by `nuxt-typed-vuex`) or async functions that have access to an instance (through which they can access the strongly-typed accessor injected above).

```ts
// Vanilla

export const actions = {
  async resetEmail(
    this: Store<RootState>,
    { commit }: ActionContext<RootState, RootState>,
    payload: string
  ) {
    // Not typed - avoid
    commit('initialiseStore')

    // Typed
    this.app.$accessor.initialiseStore()
  },
}

// Helper function

export const actions = actionTree(
  { state, getters, mutations },
  {
    async resetEmail({ commit, dispatch }) {
      // Typed
      commit('initialiseStore')

      // Not typed
      dispatch('resetEmail')

      // Typed
      this.app.$accessor.resetEmail()
    },
  }
)
```

#### Accessing namespaced state, getters, actions and mutations from mutations

This is currently a work in progress.

#### `getStoreType` (deprecated)

There is another helper function: `getStoreType`.

This is largely obviated by the `actionTree` helper above.

It does not correctly type actions and mutations for submodules, but may be useful for simpler setups. Consider it a placeholder for future development.

```ts
import { getStoreType } from 'nuxt-typed-vuex'
import * as store from '~/store'

const { storeType, storeInstance } = getStoreType(store)

const store: storeInstance
// You will now get type checking on getters, actions, state and mutations
store.commit('SAMPLE_MUTATION', 30)
```

## Example

### Setup

`store/index.ts`:

```ts
import { getAccessorType } from 'nuxt-typed-vuex'
import * as submodule from '~/store/submodule'

export const state = () => ({
  email: '',
  ids: [] as number[],
})

type RootState = ReturnType<typeof state>

export const getters = {
  email: (state: RootState) => state.email,
}

export const mutations = {
  SET_EMAIL(state: RootState, newValue: string) {
    state.email = newValue
  },
}

export const actions = {
  async resetEmail({ commit }: ActionContext<RootState, RootState>) {
    commit('SET_EMAIL', '')
  },
}

export const accessorType = getAccessorType({
  actions,
  getters,
  mutations,
  state,
  modules: {
    // The key (submodule) needs to match the Nuxt namespace (e.g. submodule.ts)
    submodule,
  },
})
```

`index.d.ts`:

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

### Usage

#### Within components

`components/sampleComponent.vue`:

```ts
import { Component, Vue } from 'nuxt-property-decorator'

@Component({
  fetch({ app: { $accessor } }) {
    // Accessing within fetch or asyncData
    $accessor.fetchItems()
  },
})
export default class SampleComponent extends Vue {
  get email() {
    // This (behind the scenes) returns this.$store.getters['email']
    return this.$accessor.email
  }

  resetEmail() {
    // Executes this.$store.dispatch('submodule/resetEmail', 'thing')
    this.$accessor.submodule.submoduleAction('thing')
  }
}
```

#### Middleware

`middleware/test.ts`:

```ts
import { Context } from '@nuxt/types'

export default ({ redirect, app: { $accessor } }: Context) => {
  // You can access the store here
  if ($accessor.email) return redirect('/')
}
```

## Notes

### Usage with IE11

You may need to transpile this module for usage with IE11.

`nuxt.config`:

```ts
...

build: {
  transpile: [
    /nuxt-typed-vuex/
  ],
},
```

## Key limitations and assumptions

1. You should not use the Vuex helper functions, such as `GetterTree`, in your store, as it interferes with type inference.

   However, your store properties will be checked at the point you pass them into `getAccessorType` and you will get an error if (for example) you pass in a getter that doesn't match Vuex's type signature for a getter.

2. This may require additional work for submodules split into separate `state.ts`, `actions.ts`, `mutations.ts` and `getters.ts`.

3. Note that this does not support [object-style commits](https://vuex.vuejs.org/guide/mutations.html#object-style-commit).

## License

[MIT License](./LICENSE) - Copyright &copy; Daniel Roe
