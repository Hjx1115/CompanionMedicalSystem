<template>
  <div class="header-container">
    <div class="header-left flex-box">
      <el-icon class="icon" size="30" @click="store.commit('collapseMenu')"
        ><Fold
      /></el-icon>
      <ul class="select-menu flex-box">
        <li
          v-for="(item, index) in selectMenu"
          :class="{ selected: route.path === item.path }"
          :key="item.path"
          class="flex-box tag"
        >
          <el-icon size="15"><component :is="item.icon"></component></el-icon>
          <router-link :to="item.path" class="text flex-box">
            {{ item.name }}
          </router-link>
          <el-icon size="15" class="close" @click="closeTag(item, index)"
            ><Close
          /></el-icon>
        </li>
      </ul>
    </div>
    <div class="header-right">
      <el-dropdown @command="handleClick" >
        <div class="el-dropdown-link flex-box">
          <el-avatar
            :src="userInfo.avatar"
          />
          <p class="user-name">{{userInfo.name}}</p>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="cancel">退出</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup>
import { useStore } from "vuex";
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
console.log(route.path);

const store = useStore();
const router = useRouter();
const selectMenu = computed(() => store.state.menu.selectMenu);

const userInfo = JSON.parse(localStorage.getItem('pz_userInfo'))

const closeTag = (item, index) => {
  store.commit("removeMenu", item);
  //若果关闭的标签不是当前路由，则不跳转
  if (route.path !== item.path) {
    return;
  }
  // 删的最后一项
  const selectMenuList = store.state.menu.selectMenu;
  if (selectMenuList.length === 0) {
    router.push("/");
    return;
  }
  // 删除的不是最后一项
  const nextItem = selectMenuList[index] || selectMenuList[index - 1];
  router.push(nextItem.path);
};

//退出登录
const handleClick=(command)=>{
  if(command==="cancel"){
    localStorage.removeItem('pz_token')
    localStorage.removeItem('pz_userInfo')
    localStorage.removeItem('pz_v3pz')
    window.location.href=window.location.origin
  }
}
</script>

<style lang="less" scoped>
.flex-box {
  display: flex;
  align-items: center;
  height: 100%;
}
.header-container {
  display: flex;
  height: 100%;
  padding-right: 25px;
  background-color: aliceblue;
  justify-content: space-between;
  align-items: center;
  .header-left {
    height: 100%;
    .icon {
      width: 45px;
      height: 100%;
    }
    .icon:hover {
      cursor: pointer;
      background-color: #e0e0e0;
    }
    .tag {
      height: 100%;
      padding: 0 10px;
      .text {
        margin: 0 5px;
        color: #333;
        font-size: 15px;
      }
      .close{
        visibility: hidden;
      }
      &.selected {
        background-color: #f5f5f5;
        a,
        i {
          color: #409eff;
        }
      }
    }
    .tag:hover {
      background-color: #e0e0e0;
      .close {
        cursor: pointer;
        visibility: inherit;
      }
    }
  }
}
.header-right {
  .el-dropdown-link {
    cursor: pointer;
    border-radius: 4px;
    padding: 5px;
    .user-name {
      margin: 0 10px;
      font-weight: bold;
    }
    &:hover {
      background-color: #e0e0e0;
    }
  }
  .a {
    height: 100%;
    color: #333;
    font-size: 15px;
  }
}
</style>
