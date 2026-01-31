<template>
  <el-menu
    :style="{ width: !isCollapse ? '13%' : '64px' }"
    active-text-color="#ffd04b"
    background-color="#545c64"
    class="aside-container"
    default-active="2"
    text-color="#fff"
    @open="handleOpen"
    @close="handleClose"
    :collapse="isCollapse"
  >
    <p class="logo">{{isCollapse ? 'CDS' : 'CDS陪诊系统'}}</p>
    <treeMenu :parent_index="1" :menu-data="menuData" />
  </el-menu>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import treeMenu from "./treeMenu.vue";
import { useRouter } from "vue-router";
import { computed } from "vue";
import { useStore } from "vuex";

const router = useRouter();
const menuData = reactive(router.options.routes[0].children);

//console.log(router);

const handleOpen = () => {};
const handleClose = () => {};
const store = useStore();
const isCollapse = computed(() => store.state.menu.isCollapse);//扁平化处理
console.log("isCollapse:", isCollapse);
</script>

<style lang="less" scoped>
.aside-container {
  height: 100%;
  .logo {
    height: 50px;
    color: #fff;
    font-size: 20px;
    text-align: center;
    line-height: 50px;
    margin-bottom: 10px;
  }
}
</style>
