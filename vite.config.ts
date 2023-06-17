import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from "path"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      { find: "@src", replacement: path.resolve(__dirname, "./src") },
      { find: /^~/, replacement: "" }, // 用于兼容 webpack 导入 less 的写法，以 “～” 开头（@import '~antd/'）
    ],
  },
  experimental: {
    renderBuiltUrl(filename: string, { hostType }: { hostType: 'js' | 'css' | 'html' }) {
      return filename.split('/').filter(Boolean).join('/')
    }
  }
})
