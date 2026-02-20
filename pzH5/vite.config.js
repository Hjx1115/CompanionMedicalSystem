import vue from '@vitejs/plugin-vue';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { VantResolver } from '@vant/auto-import-resolver';
import { fileURLToPath, URL } from 'url'
import path from 'path'

export default {
  server:{
    port:4500
  },
  plugins: [
    vue(),
    AutoImport({
      resolvers: [VantResolver()],
    }),
    Components({
      resolvers: [VantResolver()],
    }),
  ],
  resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        '@api': path.resolve(__dirname, './src/api') 
      }
  },
  server: {
    headers: {
      'Content-Security-Policy': [
        "script-src 'self' 'unsafe-inline' https://*.dify.ai https://*.udify.app https://udify.app;",
        "frame-src 'self' https://yiyan.baidu.com https://*.baidu.com;",
        "connect-src 'self' http://localhost:* https://*.dify.ai https://*.udify.app https://v3pz.itndedu.com;"
      ].join(' ')
    }
  },
};
