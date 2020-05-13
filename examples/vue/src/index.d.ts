import Vue from 'vue'
import { accessor } from './store'

declare module 'vue/types/vue' {
  interface Vue {
    $accessor: typeof accessor
  }
}
