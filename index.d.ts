import { VueConstructor } from 'vue/types/vue'

declare module 'vue/types/vue' {
  interface VueConstructor {
    $accessor?: any;
  }
}
