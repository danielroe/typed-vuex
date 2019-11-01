---
---

# Accessor

This module injects a store accessor throughout your project (`$accessor`). This serves two purposes:

- It wraps the store so that it can be typed without conflicting with the default types for `$store`
- It allows us to avoid creating impossible type definitions for namespaced magic strings, like `commit('mysubmodule/mutation')`).

**IMPORTANT**: The accessor injected by this module is not typed by default, so you will need to [add types](/setup.html).

## Structure

1. Getters, state, mutations and actions are flattened.
2. Getters take priority over state (so state is not included if a getter of the same name exists).
3. Modules are namespaced.

So, for example:

```ts
// Accesses this.$store.state.email
this.$accessor.email

// Accesses this.$store.getters['fullName']
this.$accessor.fullName

// Runs this.$store.dispatch('initialiseStore')
this.$accessor.initialiseStore()

// Runs this.$store.commit('SET_NAME', 'John Doe')
this.$accessor.SET_NAME('John Doe')

// Accesses this.$store.state.submodule.id
this.$accessor.submodule.id

// etc.
```

## Typing the accessor

Adding types is simple. A helper function, `getAccessorType`, is provided, which compiles to nothing and only serves to return the correct type of the accessor so that it can be used where you see fit.

Make sure you define types correctly following [these instructions](/setup.html).

## Using the accessor

### Components, `fetch` and `asyncData`

`components/sampleComponent.vue`

```ts
import { Component, Vue } from 'nuxt-property-decorator'

@Component({
  fetch({ app: { $accessor } }) {
    $accessor.fetchItems()
  },
  asyncData({ app: { $accessor } }) {
    return {
      myEmail: $accessor.email,
    }
  },
})
export default class SampleComponent extends Vue {
  get email() {
    // This (behind the scenes) returns this.$store.getters['email']
    return this.$accessor.email
  }

  resetEmail() {
    // Executes this.$store.dispatch('submodule/resetEmail', 'new@email.com')
    this.$accessor.submodule.resetEmail('new@email.com')
  }
}
```

### Middleware

`middleware/test.ts`

```ts
import { Context } from '@nuxt/types'

export default ({ redirect, app: { $accessor } }: Context) => {
  // You can access the store here
  if ($accessor.email) return redirect('/')
}
```
