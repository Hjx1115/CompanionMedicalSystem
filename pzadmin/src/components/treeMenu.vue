<template>
  <template v-for="(item, index) in props.menuData">

    <!-- 没有子菜单 -->
    <el-menu-item 
      @click="handleClick(item,`${props.parent_index}-${item.meta.id}`)"
      v-if="!item.children || item.children.length == 0" 
      :index="`${props.parent_index}-${item.meta.id}`" :key="`${props.parent_index}-${item.meta.id}`">
      <el-icon size="20">
        <component :is="item.meta.icon" />
      </el-icon>
      <span>{{ item.meta.name }}</span>
    </el-menu-item>

    <!-- 有子菜单 -->
    <el-sub-menu v-else :index="`${props.parent_index}-${item.meta.id}`">
      <template #title>
        <el-icon size="20">
          <component :is="item.meta.icon" />
        </el-icon>
        <span>{{ item.meta.name }}</span>
      </template>

      <!-- 组件递归 -->
      <treeMenu :parent_index="`${props.parent_index}-${item.meta.id}`" :menu-data="item.children"/>

    </el-sub-menu>
  </template>

</template>

<script setup>
  import { useRouter } from "vue-router";
  import {useStore} from 'vuex';

  const props = defineProps(["menuData","parent_index"]);
  // console.log(props);

  const router = useRouter();
  const store = useStore();

  // 点击菜单
  const handleClick = (item,index)=>{
    store.commit('addMenu',item.meta);
    store.commit('updateMenuActive',index)
    router.push(item.meta.path);
  }
</script>

<style></style>
