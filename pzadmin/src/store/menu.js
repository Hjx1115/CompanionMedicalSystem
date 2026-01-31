const state = {
  isCollapse: false,
  selectMenu: [],
};

const mutations = {
  collapseMenu(state) {
    state.isCollapse = !state.isCollapse;
    console.log("isCollapse:", state.isCollapse);
  },
  addMenu(state, payload) {
    //判断添加的菜单是否已经存在
    if (
      state.selectMenu.findIndex((item) => item.path === payload.path) === -1
    ) {
      //不存在则添加
      state.selectMenu.push(payload);
      // console.log("selectMenu:", state.selectMenu);
    }
  },
  removeMenu(state, payload) {
    const index = state.selectMenu.findIndex(
      (item) => item.name === payload.name,
    );
    state.selectMenu.splice(index, 1); //删除对应下标的菜单
    // console.log("selectMenu:", state.selectMenu);
  },
};

export default {
  state,
  mutations,
};
