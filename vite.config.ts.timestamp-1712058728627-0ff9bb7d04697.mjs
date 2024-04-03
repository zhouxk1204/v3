// vite.config.ts
import vue from "file:///Users/intasect/Documents/zhouxk/project/v3/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import path from "path";
import AutoImport from "file:///Users/intasect/Documents/zhouxk/project/v3/node_modules/unplugin-auto-import/dist/vite.js";
import IconsResolver from "file:///Users/intasect/Documents/zhouxk/project/v3/node_modules/unplugin-icons/dist/resolver.js";
import Icons from "file:///Users/intasect/Documents/zhouxk/project/v3/node_modules/unplugin-icons/dist/vite.js";
import { ElementPlusResolver } from "file:///Users/intasect/Documents/zhouxk/project/v3/node_modules/unplugin-vue-components/dist/resolvers.js";
import Components from "file:///Users/intasect/Documents/zhouxk/project/v3/node_modules/unplugin-vue-components/dist/vite.js";
import { defineConfig } from "file:///Users/intasect/Documents/zhouxk/project/v3/node_modules/vite/dist/node/index.js";
import { nodePolyfills } from "file:///Users/intasect/Documents/zhouxk/project/v3/node_modules/vite-plugin-node-polyfills/dist/index.js";
var __vite_injected_original_dirname = "/Users/intasect/Documents/zhouxk/project/v3";
var pathSrc = path.resolve(__vite_injected_original_dirname, "src");
var vite_config_default = defineConfig({
  plugins: [
    nodePolyfills(),
    // Vite: `Buffer is not defined` のエラーが発生した場合の対処方法
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
          prefix: "Icon"
        })
      ],
      dts: path.resolve(pathSrc, "auto-imports.d.ts")
    }),
    Components({
      resolvers: [
        // Auto register icon components
        // 自动注册图标组件
        IconsResolver({
          enabledCollections: ["ep"]
        }),
        // Auto register Element Plus components
        // 自动导入 Element Plus 组件
        ElementPlusResolver()
      ],
      dts: path.resolve(pathSrc, "components.d.ts")
    }),
    Icons({
      autoInstall: true
    })
  ],
  // 配置路径别名
  resolve: {
    alias: [
      {
        find: "@",
        replacement: path.resolve("./src")
      }
    ]
  },
  define: {
    "process.env": {}
  },
  // 自定义模式变量开头, 如：以 APP_ 开头
  envPrefix: "APP_"
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvaW50YXNlY3QvRG9jdW1lbnRzL3pob3V4ay9wcm9qZWN0L3YzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvaW50YXNlY3QvRG9jdW1lbnRzL3pob3V4ay9wcm9qZWN0L3YzL3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9pbnRhc2VjdC9Eb2N1bWVudHMvemhvdXhrL3Byb2plY3QvdjMvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgdnVlIGZyb20gXCJAdml0ZWpzL3BsdWdpbi12dWVcIjtcbmltcG9ydCBwYXRoIGZyb20gXCJwYXRoXCI7IC8vIFx1NjI3RVx1NEUwRFx1NTIzMFx1NkEyMVx1NTc1NyBcdTIwMThwYXRoXHUyMDE5IFx1NjIxNlx1NTE3Nlx1NzZGOFx1NUJGOVx1NUU5NFx1NzY4NFx1N0M3Qlx1NTc4Qlx1NThGMFx1NjYwRSAtPiBucG0gaW5zdGFsbCBAdHlwZXMvbm9kZSAtLXNhdmUtZGV2XG5pbXBvcnQgQXV0b0ltcG9ydCBmcm9tIFwidW5wbHVnaW4tYXV0by1pbXBvcnQvdml0ZVwiO1xuaW1wb3J0IEljb25zUmVzb2x2ZXIgZnJvbSBcInVucGx1Z2luLWljb25zL3Jlc29sdmVyXCI7XG5pbXBvcnQgSWNvbnMgZnJvbSBcInVucGx1Z2luLWljb25zL3ZpdGVcIjtcbmltcG9ydCB7IEVsZW1lbnRQbHVzUmVzb2x2ZXIgfSBmcm9tIFwidW5wbHVnaW4tdnVlLWNvbXBvbmVudHMvcmVzb2x2ZXJzXCI7XG5pbXBvcnQgQ29tcG9uZW50cyBmcm9tIFwidW5wbHVnaW4tdnVlLWNvbXBvbmVudHMvdml0ZVwiO1xuaW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSBcInZpdGVcIjtcbmltcG9ydCB7IG5vZGVQb2x5ZmlsbHMgfSBmcm9tIFwidml0ZS1wbHVnaW4tbm9kZS1wb2x5ZmlsbHNcIjtcblxuY29uc3QgcGF0aFNyYyA9IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwic3JjXCIpO1xuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIHBsdWdpbnM6IFtcbiAgICBub2RlUG9seWZpbGxzKCksIC8vIFZpdGU6IGBCdWZmZXIgaXMgbm90IGRlZmluZWRgIFx1MzA2RVx1MzBBOFx1MzBFOVx1MzBGQ1x1MzA0Q1x1NzY3QVx1NzUxRlx1MzA1N1x1MzA1Rlx1NTgzNFx1NTQwOFx1MzA2RVx1NUJGRVx1NTFFNlx1NjVCOVx1NkNENVxuICAgIHZ1ZSgpLFxuICAgIEF1dG9JbXBvcnQoe1xuICAgICAgLy8gQXV0byBpbXBvcnQgZnVuY3Rpb25zIGZyb20gVnVlLCBlLmcuIHJlZiwgcmVhY3RpdmUsIHRvUmVmLi4uXG4gICAgICAvLyBcdTgxRUFcdTUyQThcdTVCRkNcdTUxNjUgVnVlIFx1NzZGOFx1NTE3M1x1NTFGRFx1NjU3MFx1RkYwQ1x1NTk4Mlx1RkYxQXJlZiwgcmVhY3RpdmUsIHRvUmVmIFx1N0I0OVxuICAgICAgaW1wb3J0czogW1widnVlXCJdLFxuXG4gICAgICAvLyBBdXRvIGltcG9ydCBmdW5jdGlvbnMgZnJvbSBFbGVtZW50IFBsdXMsIGUuZy4gRWxNZXNzYWdlLCBFbE1lc3NhZ2VCb3guLi4gKHdpdGggc3R5bGUpXG4gICAgICAvLyBcdTgxRUFcdTUyQThcdTVCRkNcdTUxNjUgRWxlbWVudCBQbHVzIFx1NzZGOFx1NTE3M1x1NTFGRFx1NjU3MFx1RkYwQ1x1NTk4Mlx1RkYxQUVsTWVzc2FnZSwgRWxNZXNzYWdlQm94Li4uIChcdTVFMjZcdTY4MzdcdTVGMEYpXG4gICAgICByZXNvbHZlcnM6IFtcbiAgICAgICAgRWxlbWVudFBsdXNSZXNvbHZlcigpLFxuXG4gICAgICAgIC8vIEF1dG8gaW1wb3J0IGljb24gY29tcG9uZW50c1xuICAgICAgICAvLyBcdTgxRUFcdTUyQThcdTVCRkNcdTUxNjVcdTU2RkVcdTY4MDdcdTdFQzRcdTRFRjZcbiAgICAgICAgSWNvbnNSZXNvbHZlcih7XG4gICAgICAgICAgcHJlZml4OiBcIkljb25cIixcbiAgICAgICAgfSksXG4gICAgICBdLFxuXG4gICAgICBkdHM6IHBhdGgucmVzb2x2ZShwYXRoU3JjLCBcImF1dG8taW1wb3J0cy5kLnRzXCIpLFxuICAgIH0pLFxuXG4gICAgQ29tcG9uZW50cyh7XG4gICAgICByZXNvbHZlcnM6IFtcbiAgICAgICAgLy8gQXV0byByZWdpc3RlciBpY29uIGNvbXBvbmVudHNcbiAgICAgICAgLy8gXHU4MUVBXHU1MkE4XHU2Q0U4XHU1MThDXHU1NkZFXHU2ODA3XHU3RUM0XHU0RUY2XG4gICAgICAgIEljb25zUmVzb2x2ZXIoe1xuICAgICAgICAgIGVuYWJsZWRDb2xsZWN0aW9uczogW1wiZXBcIl0sXG4gICAgICAgIH0pLFxuICAgICAgICAvLyBBdXRvIHJlZ2lzdGVyIEVsZW1lbnQgUGx1cyBjb21wb25lbnRzXG4gICAgICAgIC8vIFx1ODFFQVx1NTJBOFx1NUJGQ1x1NTE2NSBFbGVtZW50IFBsdXMgXHU3RUM0XHU0RUY2XG4gICAgICAgIEVsZW1lbnRQbHVzUmVzb2x2ZXIoKSxcbiAgICAgIF0sXG5cbiAgICAgIGR0czogcGF0aC5yZXNvbHZlKHBhdGhTcmMsIFwiY29tcG9uZW50cy5kLnRzXCIpLFxuICAgIH0pLFxuXG4gICAgSWNvbnMoe1xuICAgICAgYXV0b0luc3RhbGw6IHRydWUsXG4gICAgfSksXG4gIF0sXG4gIC8vIFx1OTE0RFx1N0Y2RVx1OERFRlx1NUY4NFx1NTIyQlx1NTQwRFxuICByZXNvbHZlOiB7XG4gICAgYWxpYXM6IFtcbiAgICAgIHtcbiAgICAgICAgZmluZDogXCJAXCIsXG4gICAgICAgIHJlcGxhY2VtZW50OiBwYXRoLnJlc29sdmUoXCIuL3NyY1wiKSxcbiAgICAgIH0sXG4gICAgXSxcbiAgfSxcbiAgZGVmaW5lOiB7XG4gICAgXCJwcm9jZXNzLmVudlwiOiB7fSxcbiAgfSxcbiAgLy8gXHU4MUVBXHU1QjlBXHU0RTQ5XHU2QTIxXHU1RjBGXHU1M0Q4XHU5MUNGXHU1RjAwXHU1OTM0LCBcdTU5ODJcdUZGMUFcdTRFRTUgQVBQXyBcdTVGMDBcdTU5MzRcbiAgZW52UHJlZml4OiBcIkFQUF9cIixcbn0pO1xuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFtVCxPQUFPLFNBQVM7QUFDblUsT0FBTyxVQUFVO0FBQ2pCLE9BQU8sZ0JBQWdCO0FBQ3ZCLE9BQU8sbUJBQW1CO0FBQzFCLE9BQU8sV0FBVztBQUNsQixTQUFTLDJCQUEyQjtBQUNwQyxPQUFPLGdCQUFnQjtBQUN2QixTQUFTLG9CQUFvQjtBQUM3QixTQUFTLHFCQUFxQjtBQVI5QixJQUFNLG1DQUFtQztBQVV6QyxJQUFNLFVBQVUsS0FBSyxRQUFRLGtDQUFXLEtBQUs7QUFFN0MsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUztBQUFBLElBQ1AsY0FBYztBQUFBO0FBQUEsSUFDZCxJQUFJO0FBQUEsSUFDSixXQUFXO0FBQUE7QUFBQTtBQUFBLE1BR1QsU0FBUyxDQUFDLEtBQUs7QUFBQTtBQUFBO0FBQUEsTUFJZixXQUFXO0FBQUEsUUFDVCxvQkFBb0I7QUFBQTtBQUFBO0FBQUEsUUFJcEIsY0FBYztBQUFBLFVBQ1osUUFBUTtBQUFBLFFBQ1YsQ0FBQztBQUFBLE1BQ0g7QUFBQSxNQUVBLEtBQUssS0FBSyxRQUFRLFNBQVMsbUJBQW1CO0FBQUEsSUFDaEQsQ0FBQztBQUFBLElBRUQsV0FBVztBQUFBLE1BQ1QsV0FBVztBQUFBO0FBQUE7QUFBQSxRQUdULGNBQWM7QUFBQSxVQUNaLG9CQUFvQixDQUFDLElBQUk7QUFBQSxRQUMzQixDQUFDO0FBQUE7QUFBQTtBQUFBLFFBR0Qsb0JBQW9CO0FBQUEsTUFDdEI7QUFBQSxNQUVBLEtBQUssS0FBSyxRQUFRLFNBQVMsaUJBQWlCO0FBQUEsSUFDOUMsQ0FBQztBQUFBLElBRUQsTUFBTTtBQUFBLE1BQ0osYUFBYTtBQUFBLElBQ2YsQ0FBQztBQUFBLEVBQ0g7QUFBQTtBQUFBLEVBRUEsU0FBUztBQUFBLElBQ1AsT0FBTztBQUFBLE1BQ0w7QUFBQSxRQUNFLE1BQU07QUFBQSxRQUNOLGFBQWEsS0FBSyxRQUFRLE9BQU87QUFBQSxNQUNuQztBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQUEsRUFDQSxRQUFRO0FBQUEsSUFDTixlQUFlLENBQUM7QUFBQSxFQUNsQjtBQUFBO0FBQUEsRUFFQSxXQUFXO0FBQ2IsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
