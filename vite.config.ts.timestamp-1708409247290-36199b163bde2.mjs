// vite.config.ts
import AutoImport from "file:///Users/intasect/Documents/zhouxk/project/v3/node_modules/unplugin-auto-import/dist/vite.js";
import Components from "file:///Users/intasect/Documents/zhouxk/project/v3/node_modules/unplugin-vue-components/dist/vite.js";
import { ElementPlusResolver } from "file:///Users/intasect/Documents/zhouxk/project/v3/node_modules/unplugin-vue-components/dist/resolvers.js";
import Icons from "file:///Users/intasect/Documents/zhouxk/project/v3/node_modules/unplugin-icons/dist/vite.js";
import IconsResolver from "file:///Users/intasect/Documents/zhouxk/project/v3/node_modules/unplugin-icons/dist/resolver.js";
import { defineConfig } from "file:///Users/intasect/Documents/zhouxk/project/v3/node_modules/vite/dist/node/index.js";
import path from "path";
import vue from "file:///Users/intasect/Documents/zhouxk/project/v3/node_modules/@vitejs/plugin-vue/dist/index.mjs";
var __vite_injected_original_dirname = "/Users/intasect/Documents/zhouxk/project/v3";
var pathSrc = path.resolve(__vite_injected_original_dirname, "src");
var vite_config_default = defineConfig({
  plugins: [
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
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvaW50YXNlY3QvRG9jdW1lbnRzL3pob3V4ay9wcm9qZWN0L3YzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvaW50YXNlY3QvRG9jdW1lbnRzL3pob3V4ay9wcm9qZWN0L3YzL3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9pbnRhc2VjdC9Eb2N1bWVudHMvemhvdXhrL3Byb2plY3QvdjMvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgQXV0b0ltcG9ydCBmcm9tIFwidW5wbHVnaW4tYXV0by1pbXBvcnQvdml0ZVwiO1xuaW1wb3J0IENvbXBvbmVudHMgZnJvbSBcInVucGx1Z2luLXZ1ZS1jb21wb25lbnRzL3ZpdGVcIjtcbmltcG9ydCB7IEVsZW1lbnRQbHVzUmVzb2x2ZXIgfSBmcm9tIFwidW5wbHVnaW4tdnVlLWNvbXBvbmVudHMvcmVzb2x2ZXJzXCI7XG5pbXBvcnQgSWNvbnMgZnJvbSBcInVucGx1Z2luLWljb25zL3ZpdGVcIjtcbmltcG9ydCBJY29uc1Jlc29sdmVyIGZyb20gXCJ1bnBsdWdpbi1pY29ucy9yZXNvbHZlclwiO1xuaW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSBcInZpdGVcIjtcbmltcG9ydCBwYXRoIGZyb20gXCJwYXRoXCI7IC8vIFx1NjI3RVx1NEUwRFx1NTIzMFx1NkEyMVx1NTc1NyBcdTIwMThwYXRoXHUyMDE5IFx1NjIxNlx1NTE3Nlx1NzZGOFx1NUJGOVx1NUU5NFx1NzY4NFx1N0M3Qlx1NTc4Qlx1NThGMFx1NjYwRSAtPiBucG0gaW5zdGFsbCBAdHlwZXMvbm9kZSAtLXNhdmUtZGV2XG5pbXBvcnQgdnVlIGZyb20gXCJAdml0ZWpzL3BsdWdpbi12dWVcIjtcbmNvbnN0IHBhdGhTcmMgPSBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBcInNyY1wiKTtcbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBwbHVnaW5zOiBbXG4gICAgdnVlKCksXG4gICAgQXV0b0ltcG9ydCh7XG4gICAgICAvLyBBdXRvIGltcG9ydCBmdW5jdGlvbnMgZnJvbSBWdWUsIGUuZy4gcmVmLCByZWFjdGl2ZSwgdG9SZWYuLi5cbiAgICAgIC8vIFx1ODFFQVx1NTJBOFx1NUJGQ1x1NTE2NSBWdWUgXHU3NkY4XHU1MTczXHU1MUZEXHU2NTcwXHVGRjBDXHU1OTgyXHVGRjFBcmVmLCByZWFjdGl2ZSwgdG9SZWYgXHU3QjQ5XG4gICAgICBpbXBvcnRzOiBbXCJ2dWVcIl0sXG5cbiAgICAgIC8vIEF1dG8gaW1wb3J0IGZ1bmN0aW9ucyBmcm9tIEVsZW1lbnQgUGx1cywgZS5nLiBFbE1lc3NhZ2UsIEVsTWVzc2FnZUJveC4uLiAod2l0aCBzdHlsZSlcbiAgICAgIC8vIFx1ODFFQVx1NTJBOFx1NUJGQ1x1NTE2NSBFbGVtZW50IFBsdXMgXHU3NkY4XHU1MTczXHU1MUZEXHU2NTcwXHVGRjBDXHU1OTgyXHVGRjFBRWxNZXNzYWdlLCBFbE1lc3NhZ2VCb3guLi4gKFx1NUUyNlx1NjgzN1x1NUYwRilcbiAgICAgIHJlc29sdmVyczogW1xuICAgICAgICBFbGVtZW50UGx1c1Jlc29sdmVyKCksXG5cbiAgICAgICAgLy8gQXV0byBpbXBvcnQgaWNvbiBjb21wb25lbnRzXG4gICAgICAgIC8vIFx1ODFFQVx1NTJBOFx1NUJGQ1x1NTE2NVx1NTZGRVx1NjgwN1x1N0VDNFx1NEVGNlxuICAgICAgICBJY29uc1Jlc29sdmVyKHtcbiAgICAgICAgICBwcmVmaXg6IFwiSWNvblwiLFxuICAgICAgICB9KSxcbiAgICAgIF0sXG5cbiAgICAgIGR0czogcGF0aC5yZXNvbHZlKHBhdGhTcmMsIFwiYXV0by1pbXBvcnRzLmQudHNcIiksXG4gICAgfSksXG5cbiAgICBDb21wb25lbnRzKHtcbiAgICAgIHJlc29sdmVyczogW1xuICAgICAgICAvLyBBdXRvIHJlZ2lzdGVyIGljb24gY29tcG9uZW50c1xuICAgICAgICAvLyBcdTgxRUFcdTUyQThcdTZDRThcdTUxOENcdTU2RkVcdTY4MDdcdTdFQzRcdTRFRjZcbiAgICAgICAgSWNvbnNSZXNvbHZlcih7XG4gICAgICAgICAgZW5hYmxlZENvbGxlY3Rpb25zOiBbXCJlcFwiXSxcbiAgICAgICAgfSksXG4gICAgICAgIC8vIEF1dG8gcmVnaXN0ZXIgRWxlbWVudCBQbHVzIGNvbXBvbmVudHNcbiAgICAgICAgLy8gXHU4MUVBXHU1MkE4XHU1QkZDXHU1MTY1IEVsZW1lbnQgUGx1cyBcdTdFQzRcdTRFRjZcbiAgICAgICAgRWxlbWVudFBsdXNSZXNvbHZlcigpLFxuICAgICAgXSxcblxuICAgICAgZHRzOiBwYXRoLnJlc29sdmUocGF0aFNyYywgXCJjb21wb25lbnRzLmQudHNcIiksXG4gICAgfSksXG5cbiAgICBJY29ucyh7XG4gICAgICBhdXRvSW5zdGFsbDogdHJ1ZSxcbiAgICB9KSxcbiAgXSxcbiAgLy8gXHU5MTREXHU3RjZFXHU4REVGXHU1Rjg0XHU1MjJCXHU1NDBEXG4gIHJlc29sdmU6IHtcbiAgICBhbGlhczogW1xuICAgICAge1xuICAgICAgICBmaW5kOiBcIkBcIixcbiAgICAgICAgcmVwbGFjZW1lbnQ6IHBhdGgucmVzb2x2ZShcIi4vc3JjXCIpLFxuICAgICAgfSxcbiAgICBdLFxuICB9LFxufSk7XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQW1ULE9BQU8sZ0JBQWdCO0FBQzFVLE9BQU8sZ0JBQWdCO0FBQ3ZCLFNBQVMsMkJBQTJCO0FBQ3BDLE9BQU8sV0FBVztBQUNsQixPQUFPLG1CQUFtQjtBQUMxQixTQUFTLG9CQUFvQjtBQUM3QixPQUFPLFVBQVU7QUFDakIsT0FBTyxTQUFTO0FBUGhCLElBQU0sbUNBQW1DO0FBUXpDLElBQU0sVUFBVSxLQUFLLFFBQVEsa0NBQVcsS0FBSztBQUU3QyxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTO0FBQUEsSUFDUCxJQUFJO0FBQUEsSUFDSixXQUFXO0FBQUE7QUFBQTtBQUFBLE1BR1QsU0FBUyxDQUFDLEtBQUs7QUFBQTtBQUFBO0FBQUEsTUFJZixXQUFXO0FBQUEsUUFDVCxvQkFBb0I7QUFBQTtBQUFBO0FBQUEsUUFJcEIsY0FBYztBQUFBLFVBQ1osUUFBUTtBQUFBLFFBQ1YsQ0FBQztBQUFBLE1BQ0g7QUFBQSxNQUVBLEtBQUssS0FBSyxRQUFRLFNBQVMsbUJBQW1CO0FBQUEsSUFDaEQsQ0FBQztBQUFBLElBRUQsV0FBVztBQUFBLE1BQ1QsV0FBVztBQUFBO0FBQUE7QUFBQSxRQUdULGNBQWM7QUFBQSxVQUNaLG9CQUFvQixDQUFDLElBQUk7QUFBQSxRQUMzQixDQUFDO0FBQUE7QUFBQTtBQUFBLFFBR0Qsb0JBQW9CO0FBQUEsTUFDdEI7QUFBQSxNQUVBLEtBQUssS0FBSyxRQUFRLFNBQVMsaUJBQWlCO0FBQUEsSUFDOUMsQ0FBQztBQUFBLElBRUQsTUFBTTtBQUFBLE1BQ0osYUFBYTtBQUFBLElBQ2YsQ0FBQztBQUFBLEVBQ0g7QUFBQTtBQUFBLEVBRUEsU0FBUztBQUFBLElBQ1AsT0FBTztBQUFBLE1BQ0w7QUFBQSxRQUNFLE1BQU07QUFBQSxRQUNOLGFBQWEsS0FBSyxRQUFRLE9BQU87QUFBQSxNQUNuQztBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
