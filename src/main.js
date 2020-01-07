//https://gumroad.com/l/pim-book
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import io from 'socket.io-client'
import VueSocketIOExt from 'vue-socket.io-extended'
 

import '@/styles/main.scss'

Vue.config.productionTip = false

const socket = io(`${process.env.VUE_APP_SOCKET_BACKEND}`, { 
  // path: `${process.env.VUE_APP_PUBLIC_PATH}/socket.io`,
  transports: ['websocket', 'polling']
});

Vue.use(VueSocketIOExt, socket, { store });

Vue.filter('capitalize', (value) => {
  if (!value) return ''
  value = value.toString()
  return value.charAt(0).toUpperCase() + value.slice(1)
})

Vue.mixin({
  methods: {
  	delay(time, v){
       return new Promise((resolve) => {
           setTimeout(resolve.bind(null, v), time)
       });
    },
    shuffle(array){
      // shuffle
      for (let i = array.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1))
        const temp = array[i]
        array[i] = array[j]
        array[j] = temp
      }
      return array
    },
  },
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
