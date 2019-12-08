---
---

# Dynamic modules

You can also use `typed-vuex` with dynamic modules.

## Sample module

`~/modules/dynamic-module.ts`:

```ts
export const namespaced = true

export const state = () => ({
  emails: [] as string[],
})

export const mutations = mutationTree(state, {
  addEmail(state, newEmail: string) {
    state.emails.push(newEmail)
  },
})
```

## Accessing the module

You might want to use the store

`~/components/my-component.vue`:

```ts
import { Component, Vue } from 'nuxt-property-decorator'

import { useAccessor, getAccessorType } from 'typed-vuex'
import dynamicModule from '~/modules/dynamic-module'

const accessorType = getAccessorType(dynamicModule)

@Component
export default class MyComponent extends Vue {
  accessor: typeof accessorType | null = null

  beforeCreated() {
    // make sure the namespaces match!
    this.$store.registerModule('dynamicModule', dynamicModule, {
      preserveState: false,
    })
    const accessor = useAccessor(this.$store, dynamicModule, 'dynamicModule')

    // this works and is typed
    accessor.addEmail('my@email.com')

    // but you might want to save the accessor for use elsewhere in your component
    this.accessor = accessor
  }

  anotherMethod() {
    // ... such as here
    if (this.accessor) {
      this.accessor.addEmail('my@email.com')
    }
  }
}
```
