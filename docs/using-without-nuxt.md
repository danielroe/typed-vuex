---
---

# Using without Nuxt

If you would like to benefit from a typed accessor to your store, but you're not using Nuxt, you can still use `nuxt-typed-vuex`.

::: warning
Many of this project's default settings are based on Nuxt - for example, modules are currently always expected to be namespaced.
:::

## Setup

1. Install package:

   ```bash
   # yarn
   yarn add nuxt-typed-vuex

   # npm
   npm i nuxt-typed-vuex
   ```

2. Instantiate your accessor

   `~/src/store/index.ts`:

   ```ts
   import Vue from 'vue'
   import Vuex from 'vuex'

   import {
     useAccessor,
     getterTree,
     mutationTree,
     actionTree,
   } from 'nuxt-typed-vuex'

   Vue.use(Vuex)

   const state = {
     email: '',
   }

   const getters = getterTree(state, {
     email: state => state.email,
     fullEmail: state => state.email,
   })

   const mutations = mutationTree(state, {
     setEmail(state, newValue: string) {
       state.email = newValue
     },

     initialiseStore() {
       console.log('initialised')
     },
   })

   const actions = actionTree(
     { state, getters, mutations },
     {
       async resetEmail({ commit }) {
         commit('setEmail', 'a@a.com')
       },
     }
   )

   const storePattern = {
     state,
     mutations,
     actions,
   }

   const store = new Vuex.Store(storePattern)

   export const accessor = useAccessor(store, storePattern)

   // Optionally, inject accessor globally
   Vue.prototype.$accessor = accessor

   export default store
   ```

3. Define types.

   If you've injected the accessor globally, you'll want to define its type:

   `~/index.d.ts`:

   ```ts
   import Vue from 'vue'
   import { accessor } from './src/store'

   declare module 'vue/types/vue' {
     interface Vue {
       $accessor: typeof accessor
     }
   }
   ```

## Usage within a component

```ts
import { Component, Vue } from 'vue-property-decorator'
import { accessor } from '../store'

@Component
export default class SampleComponent extends Vue {
  get email() {
    // This (behind the scenes) returns getters['email']
    return accessor.email

    // Or, with a globally injected accessor
    return this.$accessor.email
  }

  resetEmail() {
    // Executes dispatch('submodule/resetEmail', 'new@email.com')
    accessor.submodule.resetEmail('new@email.com')

    // Or, with a globally injected accessor
    this.$accessor.submodule.resetEmail('new@email.com')
  }
}
```
