import type {Module} from "vuex";

type AccessorRegisterModule = (path: string | [string, ...string[]], module: Module<any, any>) => void

declare module '@nuxt/types' {
  interface NuxtAppOptions {
    $accessorRegisterModule: AccessorRegisterModule;
  }

  interface Context {
    $accessorRegisterModule: AccessorRegisterModule;
  }
}

declare module 'vue/types/vue' {
  interface Vue {
    $accessorRegisterModule: AccessorRegisterModule;
  }
}

declare module 'vuex/types/index' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface Store<S> {
    $accessorRegisterModule: AccessorRegisterModule;
  }
}
