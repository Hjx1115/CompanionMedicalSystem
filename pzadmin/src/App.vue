<template>
    <router-view></router-view>
    <!-- AI 助手 iframe 版本 -->
    <AIChatBot
      title="AI 助手"
      headerColor="#4E6EF2"
      position="bottom-right"
    />
</template>

<script setup>
import { ref, computed } from 'vue'
import AIChatBot from '@/components/AIChatBot.vue'

const userStore = JSON.parse(localStorage.getItem('pz_userInfo')) || '{}'
const aiChatRef = ref()

// 从 store 获取用户信息（动态传递）
const userInfo = computed(() => ({
  id: userStore.avatar || 'unknown',
  name: userStore.name || '访客',
}))
const props = defineProps({
  token: { type: String, required: true }
})

</script>



<style scoped>

</style>
