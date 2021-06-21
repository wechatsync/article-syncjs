import Vue from 'vue'
import VueMoment from 'vue-moment'
import Main from './Main.vue'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.use(ElementUI)

Vue.use(VueMoment)

const app = new Vue(Main)
const appDiv = document.createElement('div')
appDiv.id = 'synciconapp'
document.body.appendChild(appDiv)
app.$mount('#synciconapp')

// const pendingTasks = []
// let timer = null

// window.$syncicon = {
//   ready(fn) {
//     if (typeof window.syncPost == 'undefined') {
//       pendingTasks.push(fn)
//       return
//     } else {
//       fn()
//     }
//   },
// }
