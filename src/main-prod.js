import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './assets/css/global.css'
import axios from 'axios'
// import ElementUi from 'element-ui'
// 导入 NProgress
import NProgress from 'nprogress'
// import 'element-ui/lib/theme-chalk/index.css'
// import 'nprogress/nprogress.css'

// Vue.use(ElementUi)

// axios.defaults.baseURL = 'http://175.178.175.236:8889'

// axios.defaults.baseURL = 'http://localhost:3007'
axios.defaults.baseURL = 'http://112.74.79.146:5000'

// proxy代理服务器，根目录下会转发到http://localhost:3000，解决了开发阶段跨域问题
// axios.defaults.baseURL = '/'

// 在 request 拦截器中，展示进度条 NProgress.start()
axios.interceptors.request.use(config => {
  NProgress.start()
  // 在最后必须 return config
  return config
})
// 在 response 拦截器中，隐藏进度条 NProgress.done()
axios.interceptors.response.use(config => {
  NProgress.done()
  return config
})

Vue.prototype.$http = axios

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
