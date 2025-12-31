import vue from "@vitejs/plugin-vue";
import path from "path"; // 找不到模块 ‘path’ 或其相对应的类型声明 -> npm install @types/node --save-dev
import AutoImport from "unplugin-auto-import/vite";
import IconsResolver from "unplugin-icons/resolver";
import Icons from "unplugin-icons/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
import Components from "unplugin-vue-components/vite";
import { defineConfig } from "vite";
import { nodePolyfills } from "vite-plugin-node-polyfills";

const pathSrc = path.resolve(__dirname, "src");
// https://vitejs.dev/config/
export default defineConfig({
  esbuild: {
    pure: ["console.log"], // 删除 console.log
    drop: ["debugger"], // 删除 debugger
  },
  build: {
    chunkSizeWarningLimit: 1000,
    minify: "esbuild", // or 'esbuild' for faster builds
    terserOptions: {
      compress: {
        drop_console: true, // 移除 console 语句
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          vue: ["vue", "vue-router", "pinia"],
          element: ["element-plus"],
        },
      },
    },
  },
  plugins: [
    nodePolyfills(), // Vite: `Buffer is not defined` のエラーが発生した場合の対処方法
    vue(),
    AutoImport({
      // Auto import functions from Vue, e.g. ref, reactive, toRef...
      // 自动导入 Vue 相关函数，如：ref, reactive, toRef 等
      imports: ["vue"],

      // Auto import functions from Element Plus, e.g. ElMessage, ElMessageBox... (with style)
      // 自动导入 Element Plus 相关函数，如：ElMessage, ElMessageBox... (带样式)
      resolvers: [
        ElementPlusResolver(),

        // Auto import icon components
        // 自动导入图标组件
        IconsResolver({
          prefix: "Icon",
        }),
      ],

      dts: path.resolve(pathSrc, "auto-imports.d.ts"),
    }),

    Components({
      resolvers: [
        // Auto register icon components
        // 自动注册图标组件
        IconsResolver({
          enabledCollections: ["ep"],
        }),
        // Auto register Element Plus components
        // 自动导入 Element Plus 组件
        ElementPlusResolver(),
      ],

      dts: path.resolve(pathSrc, "components.d.ts"),
    }),

    Icons({
      autoInstall: true,
    }),
  ],
  // 配置路径别名
  resolve: {
    alias: [
      {
        find: "@",
        replacement: path.resolve("./src"),
      },
    ],
  },
  define: {
    "process.env": {},
  },
  // 自定义模式变量开头, 如：以 APP_ 开头
  envPrefix: "APP_",
});
