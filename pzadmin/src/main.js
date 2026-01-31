import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import store from './store'

//路由守卫
router.beforeEach((to, from) => {
  const token = localStorage.getItem("pz_token");
  //未登录状态下不能访问除登录页以外的页面
  if (to.path !== '/login' && !token) {
    return '/login';
  }else if (to.path === '/login' && token) {
    //已登录状态下不能访问登录页
    return '/';
  }else{
    return true;
  }
});

// 引入全部图标组件
// 如果您正在使用CDN引入，请删除下面一行。
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

const app = createApp(App)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
//路由挂载
app.use(router)
//状态管理挂载
app.use(store)
app.mount('#app')
