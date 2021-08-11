/* eslint-disable */
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module 'js-cookie'

declare module 'path'

declare module 'jsencrypt/bin/jsencrypt.min';