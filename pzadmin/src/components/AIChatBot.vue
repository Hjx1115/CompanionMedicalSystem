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

    <div v-if="isOpen" class="chat-window" :style="windowStyle">
      <div class="chat-header" :style="{ backgroundColor: headerColor }">
        <span>{{ title }}</span>
        <button class="close-btn" @click="isOpen = false">✕</button>
      </div>
      
      <!-- 修改这里：允许横向滚动 -->
      <div class="scroll-container">
        <iframe
          ref="iframeRef"
          src="https://yiyan.baidu.com/m/"
          frameborder="0"
          allow="microphone"
          class="chat-iframe"
          @load="onIframeLoad"
          scrolling="no"
        ></iframe>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue'

const props = defineProps({
  title: { type: String, default: '文心一言' },
  headerColor: { type: String, default: '#4E6EF2' },
  width: { type: String, default: '900px' },
  height: { type: String, default: '700px' },
  position: { type: String, default: 'bottom-right' }
})

const isOpen = ref(false)
const iframeRef = ref(null)
const scrollContainer = ref(null)

const bubbleStyle = computed(() => ({
  position: 'fixed',
  bottom: '20px',
  right: '20px',
  width: '60px',
  height: '60px',
  borderRadius: '50%',
  backgroundColor: props.headerColor,
  color: 'white',
  border: 'none',
  fontSize: '24px',
  cursor: 'pointer',
  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
  zIndex: 9998
}))

const windowStyle = computed(() => ({
  position: 'fixed',
  bottom: '20px',
  right: '20px',
  width: props.width,
  height: props.height,
  backgroundColor: 'white',
  borderRadius: '12px',
  overflow: 'hidden',
  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
  zIndex: 9999,
  display: 'flex',
  flexDirection: 'column'
}))

const onIframeLoad = () => {
  console.log('文心一言加载成功')
  
  // 确保滚动容器可以滚动
  nextTick(() => {
    if (scrollContainer.value) {
      // 强制设置样式，允许横向滚动
      scrollContainer.value.style.overflowY = 'auto'
      scrollContainer.value.style.overflowX = 'auto'  // 改为 auto
    }
  })
}
</script>

<style scoped>
.chat-bubble:hover {
  transform: scale(1.1);
}

.chat-header {
  padding: 12px 16px;
  color: white;
  font-weight: bold;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
}

.close-btn {
  background: none;
  border: none;
  color: white;
  font-size: 18px;
  cursor: pointer;
  padding: 0 4px;
}

.close-btn:hover {
  opacity: 0.8;
}

.scroll-container {
  flex: 1;
  overflow-y: auto !important;   /* 保持垂直滚动 */
  overflow-x: auto !important;   /* 添加横向滚动 */
  -webkit-overflow-scrolling: touch;
  background: white;
  position: relative;
}

.chat-iframe {
  width: 100%;
  height: 100%;
  border: none;
  display: block;
  min-height: 700px;  /* 触发垂直滚动 */
  min-width: 900px;   /* 添加最小宽度，触发横向滚动 */
}

/* 滚动条样式 - 同时支持水平和垂直 */
.scroll-container::-webkit-scrollbar {
  width: 8px;   /* 垂直滚动条宽度 */
  height: 8px;  /* 水平滚动条高度 */
  background: #f1f1f1;
}

.scroll-container::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

.scroll-container::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* 滚动条角落 */
.scroll-container::-webkit-scrollbar-corner {
  background: #f1f1f1;
}
</style>