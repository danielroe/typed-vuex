---
---

# Getters

A getter is a function that receives `state`, `getters`, `rootState` and `rootGetters`.

This package provides a helper function to reduce boilerplate: `getterTree`. This function adds typings and returns the getters passed to it, without transforming them.

::: warning
`typed-vuex` does not currently type-check anything but the state received.
:::

```ts
// Vanilla

export const getters = {
  // Type-checked
  email: (state: RootState) => (state.emails.length ? state.emails[0] : ''),
  // NOT type-checked
  aDependentGetter: (_state: RootState, getters: any) => getters.email,
}

// Helper function

import { getterTree } from 'typed-vuex'

export const getters = getterTree(state, {
  // Type-checked
  email: state => (state.emails.length ? state.emails[0] : ''),
  // NOT type-checked
  aDependentGetter: (_state, getters) => getters.email,
})
```

::: tip

Even if you do not use the `getterTree` helper function, make sure not to use the `GetterTree` type provided by Vuex. This will interfere with type inference. You won't lose out by omitting it, as Typescript will complain if you pass an improperly formed getter into [the `getAccessorType` function](/setup.html#add-type-definitions).

:::
