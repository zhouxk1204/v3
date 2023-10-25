import { defineConfig } from "vite";
import path from "path"; // 找不到模块 ‘path’ 或其相对应的类型声明 -> npm install @types/node --save-dev
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  // 配置路径别名
  resolve: {
    alias: [
      {
        find: '@',
        replacement: path.resolve('./src')
      }
    ]
  },
});
