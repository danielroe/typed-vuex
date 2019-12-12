---
---

# State

It is strongly recommended to provide a state function (to avoid sharing state between requests) that returns the initial state of the store. (This is required if you are using Nuxt.)

If there is any ambiguity in your initial object (of particular note are empty arrays), make sure to provide types as well.

```ts
export const state = () => ({
  // AVOID: This results in emails being typed as never[]
  emails: [],

  // This is correct
  emails: [] as string[],
})

// If needed, you can define state for use in vanilla Vuex types
export type RootState = ReturnType<typeof state>
```
