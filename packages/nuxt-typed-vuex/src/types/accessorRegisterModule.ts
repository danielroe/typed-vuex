import type {Module} from "vuex";

type AccessorRegisterModule = (path: string | [string, ...string[]], module: Module<any, any>) => void
type AccessorUnregisterModule = (path: string | [string, ...string[]]) => void

declare module '@nuxt/types' {
  interface NuxtAppOptions {
    $accessorRegisterModule: AccessorRegisterModule;
    $accessorUnregisterModule: AccessorUnregisterModule;
  }

  interface Context {
    $accessorRegisterModule: AccessorRegisterModule;
    $accessorUnregisterModule: AccessorUnregisterModule;
  }
}

declare module 'vue/types/vue' {
  interface Vue {
    $accessorRegisterModule: AccessorRegisterModule;
    $accessorUnregisterModule: AccessorUnregisterModule;
  }
}

declare module 'vuex/types/index' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface Store<S> {
    $accessorRegisterModule: AccessorRegisterModule;
    $accessorUnregisterModule: AccessorUnregisterModule;
  }
}
