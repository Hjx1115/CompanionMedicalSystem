# Vue 3 + Vite

#### 环境配置

node.js版本 v20.16.0 
https://nodejs.org/zh-cn/download/package-manager

推荐使用nvm https://nvm.uihtm.com

编辑器 vsCode https://code.visualstudio.com

vite https://cn.vitejs.dev/

vue-router https://router.vuejs.org/zh

vuex https://vuex.vuejs.org/zh

接口文档 https://apifox.com/apidoc/shared/205c93aa-6b50-4a1a-85be-b93dc5304443

axios https://www.axios-http.cn/docs/intro

Vant https://vant-ui.github.io/vant/#/zh-CN

#### 路由创建

创建路由和对应页面

引入vue-router 创建路由实例

挂载router到vue实例上

对应页面使用<RouterView />配置路由显示

#### UI框架

Element Plus https://element-plus.org/zh-CN

安装步骤
- 下载依赖npm install element-plus
- 按需引入
  - 执行命令
npm install -D unplugin-vue-components unplugin-auto-import

- vite配置修改，**注意：修改配置后需要重启项目**
```js
// vite.config.ts
import { defineConfig } from 'vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

export default defineConfig({
  // ...
  plugins: [
    // ...
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],
})
```

#### 页面Layout布局

引入 Container 布局容器

#### aside组件内容

通过useRouter获取数据
使用递归组件来实现
@element-plus/icons-vued的引入

#### header组件内容

flex布局
引入vuex实现组件通信
点击按钮展开收起菜单
tag显示和点击关闭逻辑

#### 用户鉴权

用户注册
用户登录获取token和userinfo缓存
请求头携带token传给后端
响应拦截器进行校验
前置路由守卫对token进行校验

#### 权限配置

创建菜单权限
账号管理关联菜单权限
登录后调用权限接口获取菜单数据
路由动态配置

router.js数据
```js
const routes = [
  { 
    path: '/',
    component: Layout,
    name: 'main',
    children: [
      {
        path: 'dashboard',
        meta: { id: '1', name: '控制台', icon: 'Platform', path: '/dashboard', describe: '用于展示当前系统中的统计数据、统计报表及重要实时数据' },
        component: Dashboard
      },
      {
        path: 'auth',
        meta: { id: '2' ,name: '权限管理', icon: 'Grid' },
        children: [
          {
            path: '',
            alias: ['admin'],
            meta: { id: '1', name: '账号管理', icon: 'Avatar', path: '/auth/admin', describe: '管理员可以进行编辑，权限修改后需要登出才会生效' },
            component: Admin
          },
          {
            path: 'group',
            meta: { id: '2', name: '菜单管理', icon: 'Menu', path: '/auth/group', describe: '菜单规则通常对应一个控制器的方法,同时菜单栏数据也从规则中获取' },
            component: Group
          }
        ]
      },
      {
        path: 'vppz',
        meta: { id: '3', name: 'DIDI陪诊', icon: 'BellFilled' },
        children: [
          {
            path: '',
            alias: ['staff'],
            meta: { id: '1', name: '陪护管理', icon: 'Checked', path: '/vppz/staff', describe: '陪护师可以进行创建和修改，设置对应生效状态控制C端选择' },
            component: Staff
          },
          {
            path: 'order',
            meta: { id: '2', name: '订单管理', icon: 'List', path: '/vppz/order', describe: 'C端下单后可以查看所有订单状态，已支付的订单可以完成陪护状态修改' },
            component: Order
          }
        ]
      }
    ]
  },
  {
    path: '/login',
    component: Login
  },
]
```

login页面
```js
// 手机号正则
/^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/
// 密码正则
/^[a-zA-Z0-9_-]{4,16}$/
//已有帐号
15169066946 123456 2477
19819832600 123456 6682
13075371879 123456 8518
```

orderDetail页面
```js
const formatData = (key) => {
  if (key.indexOf(".") === -1) {
    if (key === "order_start_time") {
      return formatTimestamp(detailData[key]);
    }
    return detailData[key];
  }
  let arr = key.split(".").reduce((o, p) => {
    return (o || {})[p];
  }, detailData);
  return arr;
}
function formatTimestamp(timestamp) {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // 月份是从0开始的，所以需要+1
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}
```