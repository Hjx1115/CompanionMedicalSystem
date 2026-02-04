import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import store from './store'
import PanelHead from './components/panelHead.vue'

//刷新后的动态路由添加
const localData = localStorage.getItem('pz_v3pz')
if(localData){
  store.commit('dynamicMenu',JSON.parse(localData).menu.routerList)
  store.state.menu.routerList.forEach(item=>{
    router.addRoute('main',item)
  })
}

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

app.component('PanelHead',PanelHead)
//路由挂载
app.use(router)
//状态管理挂载
app.use(store)
app.mount('#app')
