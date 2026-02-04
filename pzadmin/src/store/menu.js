const localData = JSON.parse(localStorage.getItem('pz_v3pz'))
const state = localData ? localData.menu : {
  isCollapse: false,
  selectMenu: [],
  routerList:[],
  menuActive:'1-1',
};

const mutations = {
  collapseMenu(state) {
    state.isCollapse = !state.isCollapse;
    console.log("isCollapse:", state.isCollapse);
  },
  addMenu(state, payload) {
    //判断添加的菜单是否已经存在
    if (state.selectMenu.findIndex((item) => item.path === payload.path) === -1) {
      //不存在则添加
      state.selectMenu.push(payload);
    }
  },
  removeMenu(state, payload) {
    const index = state.selectMenu.findIndex(
      (item) => item.name === payload.name,
    );
    state.selectMenu.splice(index, 1); //删除对应下标的菜单
    // console.log("selectMenu:", state.selectMenu);
  },
  dynamicMenu(state,payload){
    //用glob导入文件
    const modules = import.meta.glob('../views/**/**/*.vue')
    // console.log(modules)
    function routerSet(router){
      router.forEach(route=>{
        if(!route.children){//没有子菜单，拼接路由
          const url = `../views${route.meta.path}/index.vue`
          //拿到获取的页面组件
          route.component = modules[url]
        }else{//有子菜单
          routerSet(route.children)
        }
      })
    }
    routerSet(payload)
    state.routerList = payload
  },
  updateMenuActive(state,payload){
    state.menuActive = payload
  }
};

export default {
  state,
  mutations,
};
