import vue from "@vitejs/plugin-vue";
import path from "path"; // 找不到模块 ‘path’ 或其相对应的类型声明 -> pm install @types/node --save-dev
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  // 配置路径别名
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "/src"),
    },
  },
});
