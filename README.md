# 🏦 Nuxt Typed Vuex

## Summary

This module provides a store accessor and helper type methods so you can access your normal Nuxt store in a strongly typed way.

**Note**: This has been developed to suit my needs but additional use cases and contributions are very welcome.

## Usage

Add module to your `nuxt.config`:

```ts
modules: [
  'nuxt-typed-vuex',
],
```

You will now have access to an injected store accessor (`this.$accessor`) throughout your project. Getters, state (if a getter with the same name doesn't already exist), actions and mutations are available at the root level, with submodules nested under their own namespace.

It is not typed by default, so you will need to add your own type definitions, for which a helper function, `getAccessorType`, is provided. This function only serves to return the correct type of the accessor so that it can be used where you see fit.

```ts
import { getAccessorType } from 'nuxt-typed-vuex'
import * as store from '~/store'
...

const accessorType = getAccessorType(store)
// Now you can access the type of the accessor.
const accessor: typeof accessorType
```

There is another helper function you may wish to take advantage of as well: `getStoreType`. It does not correctly type actions and mutations for submodules, but may be useful for simpler setups. Consider it a placeholder for future development.

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
    // Note that the key (submodule) needs to match the Nuxt namespace (e.g. the filename)
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
```

`components/sampleComponent.vue`:

```ts
import { Component, Vue } from 'nuxt-property-decorator'

@Component
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

## Key limitations and assumptions

1. All typings require being passed a state function.

2. If you use the Vuex helper functions in your store, such as `GetterTree`, we will not be able to infer correct types. However, your store properties will be checked at the point you pass them into `getAccessorType` and you will get an error if (for example) you pass in a getter that doesn't match Vuex's type signature for a getter.

3. This may require additional work for submodules split into separate `state.ts`, `actions.ts`, `mutations.ts` and `getters.ts`.

## License

[MIT License](./LICENSE) - Copyright &copy; Daniel Roe
