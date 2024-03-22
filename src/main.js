import { createApp } from 'vue'
import { Notify, Quasar } from 'quasar'
import quasarLang from 'quasar/lang/zh-CN.js'
import quasarIconSet from 'quasar/icon-set/svg-material-icons.mjs'
import App from './App.vue'
import router from './router/index.ts'
import store from "./stores/index.ts";


import 'quasar/dist/quasar.css'

// 如果不要 roboto 字体，删了这行
// import '@quasar/extras/roboto-font/roboto-font.css'

const myApp = createApp(App)

myApp.use(Quasar, {
  plugins: {
    Notify,
  },
  lang: quasarLang,
  iconSet: quasarIconSet,
  config: {
    brand: {
      primary: '#e46262',
    },
  },
})


myApp.use(store())
myApp.use(router())
// Assumes you have a <div id="app"></div> in your index.html
myApp.mount('#app')
