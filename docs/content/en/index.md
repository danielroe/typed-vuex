---
title: Introduction
description: 'Vanilla, strongly-typed store accessor.'
category: Getting started
position: 1
list:
  - store definition with vanilla Vuex code
  - strongly typed accessor
  - fast performance
  - small footprint
  - compatible with Nuxt
  - access this.$axios and the app/store instance from within actions
  - minimal setup/boilerplate
---

Nuxt Typed Vuex is made up of two packages:

1. `typed-vuex` - a typed store accessor with helper functions, with no Nuxt dependencies
2. `nuxt-typed-vuex` - a Nuxt module that auto-injects this accessor throughout your project

## Why another package?

Typing vanilla Vuex is complicated. Many people choose a class-based approach with Typescript decorators, but this can cause issues. Although Vuex provides limited type definitions for the store itself, it's complicated to access it in a type-safe way.

`nuxt-typed-vuex` was developed to address this problem. It features:

<list :items="list"></list>

![Image showing autocomplete on this.$accessor](./images/screenshot1.png)

![Image showing autocomplete on commit within store](./images/screenshot2.png)

## Alternatives

If you would prefer a class-based approach, good options include [`vuex-module-decorators`](https://github.com/championswimmer/vuex-module-decorators) and [`vuex-class-component`](https://github.com/michaelolof/vuex-class-component).
