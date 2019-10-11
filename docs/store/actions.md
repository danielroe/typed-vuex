---
---

# Actions

Actions are async functions that have access to the Vuex instance and are passed a context object.

This package provides a helper function to reduce boilerplate: `actionTree`. This function adds typings and returns the actions passed to it, without transforming them.

**Warning**: If you use the helper function, only the `commit` method is typed - and only for mutations within the module. Anything else should be accessed in a type-safe way through `this.app.$accessor`.

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

**Note**

1. Even if you do not use the `actionTree` helper function, make sure not to use the `ActionTree` type provided by Vuex. This will interfere with type inference. You won't lose out by omitting it, as Typescript will complain if you pass an incompatible action into [the `getAccessorType` function](/setup.html#add-type-definitions).

2. This package does not support [object-style dispatches](https://vuex.vuejs.org/guide/actions.html).
