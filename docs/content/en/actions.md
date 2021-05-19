---
title: Actions
description: 'Vanilla, strongly-typed store accessor.'
category: Store
position: 23
---

Actions are async functions that have access to the Vuex instance and are passed a context object and optional payload.

This package provides a helper function to reduce boilerplate: `actionTree`. This function adds typings and returns the actions passed to it, without transforming them.

<d-alert>If you use the helper function, only the `commit` method is typed - and only for mutations within the module.</d-alert>

<d-alert type="info">

1. Even if you do not use the `actionTree` helper function, make sure not to use the `ActionTree` type provided by Vuex. This will interfere with type inference. You won't lose out by omitting it, as Typescript will complain if you pass an incompatible action into [the `getAccessorType` function](/getting-started-nuxt#add-type-definitions).

2. This package does not support [object-style dispatches](https://vuex.vuejs.org/guide/actions.html).

</d-alert>

## Referencing other modules

If you need to reference other modules, or dispatch actions within the module, it should be done in a type-safe way through `this.app.$accessor`. You will need to add a return type to your action to avoid TypeScript complaining about self-referential type definitions. For example:

```ts
export const actions = actionTree(
  { state, getters, mutations },
  {
    async resetEmail(): Promise<void> {
      this.app.$accessor.anotherModule.doSomething()
    },
  }
)
```

Should your IDE not properly recognize type declarations setup as described in [these instructions](/getting-started-nuxt#add-type-definitions),
you may want to explicitly define accessor types like in the following examples: 

```ts
export const actions = actionTree(
  { state, getters, mutations },
  {
    async resetEmail(): Promise<void> {
      // accessor as an explicitly typed constant
      const accessor: typeof accessorType = this.app.$accessor
      accessor.anotherModule.doSomething()

      // inline type definition
      (this.app.$accessor as typeof accessorType).anotherModule.doSomething()
    },
  }
)
```

## Example

```ts
// Vanilla
import { Context } from '@nuxt/types'

export const actions = {
  async resetEmail(
    this: Store<RootState>,
    { state, commit }: ActionContext<RootState, RootState>,
    payload: string
  ) {
    // Typed
    state.email

    // Not typed - avoid
    commit('initialiseStore')

    // Typed
    this.app.$accessor.initialiseStore()
  },
  async nuxtServerInit(
    _vuexContext: ActionContext<RootState, RootState>,
    nuxtContext: Context
  ) {
    console.log(nuxtContext.req)
  },
}

// Helper function

import { actionTree } from 'typed-vuex'
import { Context } from '@nuxt/types'

export const actions = actionTree(
  { state, getters, mutations },
  {
    async resetEmail({ commit, dispatch, getters, state }) {
      // Typed
      commit('initialiseStore')
      let a = getters.email
      let b = state._email

      // Not typed
      dispatch('resetEmail')

      // Typed
      this.app.$accessor.resetEmail()
    },
    async nuxtServerInit(_vuexContext, nuxtContext: Context) {
      console.log(nuxtContext.req)
    },
  }
)
```
