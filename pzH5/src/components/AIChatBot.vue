<template>
  <div>
    <button 
      v-if="!isOpen" 
      class="chat-bubble" 
      :style="bubbleStyle"
      @click="isOpen = true"
    >
      🤖
    </button>

    <!-- 全屏遮罩层 -->
    <div v-if="isOpen" class="fullscreen-overlay">
      <div class="fullscreen-header" :style="{ backgroundColor: headerColor }">
        <span>{{ title }}</span>
        <button class="close-btn" @click="isOpen = false">✕</button>
      </div>
      <iframe
        src="https://yiyan.baidu.com/"
        frameborder="0"
        allow="microphone"
        class="fullscreen-iframe"
      ></iframe>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  title: { type: String, default: '文心一言' },
  headerColor: { type: String, default: '#4E6EF2' }
})

const isOpen = ref(false)

const bubbleStyle = {
  position: 'fixed',
  bottom: '20px',
  right: '20px',
  width: '60px',
  height: '60px',
  borderRadius: '50%',
  backgroundColor: '#4E6EF2',
  color: 'white',
  border: 'none',
  fontSize: '24px',
  cursor: 'pointer',
  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
  zIndex: 9998
}
</script>

<style scoped>
.fullscreen-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: white;
  z-index: 10000;
  display: flex;
  flex-direction: column;
}

.fullscreen-header {
  padding: 16px 20px;
  color: white;
  font-weight: bold;
  font-size: 18px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
}

.fullscreen-iframe {
  width: 100%;
  flex: 1;
  border: none;
}

.close-btn {
  background: none;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
  padding: 0 8px;
}

.close-btn:hover {
  opacity: 0.8;
}
</style>