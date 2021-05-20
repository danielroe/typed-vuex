---
title: State
description: 'Vanilla, strongly-typed store accessor.'
category: Store
position: 20
---

In order to use the accessor, you should define your state with a function that returns the initial state of the store.

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
