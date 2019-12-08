---
---

# Customisation

You might choose to customise the accessor function using the helper function `useAccessor`. You pass this an object with `state`, `actions`, `mutations`, etc. Child modules are within a `modules` property.

## Injecting a custom accessor

`~/plugins/custom-store-accessor.ts`

```ts
import { useAccessor } from 'typed-vuex'
import { InjectKey } from 'vue/types/options'
import { Context } from '@nuxt/types'

import * as store from '~/store'
import * as submodule from '~/store/submodule'

type Inject = (name: InjectKey, property: unknown) => void

export default async ({ store }: Context, inject: Inject) => {
  inject(
    'accessor',
    useAccessor({
      ...store,
      modules: {
        submodule,
      },
    })
  )
}
```

::: warning
If you are using a custom accessor in a Nuxt project, bear in mind that `useAccessor` used on its own will treat modules as non-namespaced unless they include `namespaced: true`.
:::

## Typing your custom accessor

You can use the helper function `getAccessorType` to access the type of the accessor you've generated - by passing it the exact same object that `useAccessor` receives.

It gets compiled down to `() => {}` so there is no performance hit.

```ts
import { getAccessorType } from 'typed-vuex'

import * as store from '~/store'
import * as submodule from '~/store/submodule'

const accessorType = getAccessorType({
  ...store,
  modules: {
    submodule,
  },
})

// Now you can access the type of the accessor.
const accessor: typeof accessorType
```
