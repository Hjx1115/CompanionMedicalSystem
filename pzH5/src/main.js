import { createApp } from 'vue'
// import './style.css'
import App from './App.vue'
import router from './router'
import api from './api/index'

const app=createApp(App)

//在实例上绑定api
app.config.globalProperties.$api=api

//路由前置守卫
router.beforeEach((to,from)=>{
    if(to.path !== '/login'){
        if(!localStorage.getItem('h5_token')){
            router.push('/login')
        }
    }
})
//挂载
app.use(router)
app.mount('#app')
