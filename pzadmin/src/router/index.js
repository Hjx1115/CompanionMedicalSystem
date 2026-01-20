import Layout from '../views/Main.vue'
import Login from '../views/login/index.vue'
import { createRouter, createWebHashHistory } from 'vue-router'


const routes = [
    {
        parth: '/',
        component: Layout
    },
    {
        path: '/login',
        component: Login
    },
    {

    }
]
const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router