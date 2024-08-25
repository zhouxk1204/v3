// vite.config.ts
import AutoImport from "file:///C:/github/v3/node_modules/unplugin-auto-import/dist/vite.js";
import Components from "file:///C:/github/v3/node_modules/unplugin-vue-components/dist/vite.js";
import { ElementPlusResolver } from "file:///C:/github/v3/node_modules/unplugin-vue-components/dist/resolvers.js";
import Icons from "file:///C:/github/v3/node_modules/unplugin-icons/dist/vite.js";
import IconsResolver from "file:///C:/github/v3/node_modules/unplugin-icons/dist/resolver.js";
import { defineConfig } from "file:///C:/github/v3/node_modules/vite/dist/node/index.js";
import { nodePolyfills } from "file:///C:/github/v3/node_modules/vite-plugin-node-polyfills/dist/index.js";
import path from "path";
import vue from "file:///C:/github/v3/node_modules/@vitejs/plugin-vue/dist/index.mjs";
var __vite_injected_original_dirname = "C:\\github\\v3";
var pathSrc = path.resolve(__vite_injected_original_dirname, "src");
var vite_config_default = defineConfig({
  build: {
    rollupOptions: {
      manualChunks(id) {
        if (id.includes("node_modules")) {
          return "vendor";
        }
      }
    }
  },
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxnaXRodWJcXFxcdjNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXGdpdGh1YlxcXFx2M1xcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovZ2l0aHViL3YzL3ZpdGUuY29uZmlnLnRzXCI7LypcclxuICogQEF1dGhvcjogXHU1NDY4XHU1QzBGXHU1RUI3XHJcbiAqIEBEYXRlOiAyMDI0LTA4LTIwIDIwOjI3OjMwXHJcbiAqIEBMYXN0RWRpdG9yczogXHU1NDY4XHU1QzBGXHU1RUI3XHJcbiAqIEBMYXN0RWRpdFRpbWU6IDIwMjQtMDgtMjIgMjA6MDE6NDFcclxuICogQERlc2NyaXB0aW9uOiBcclxuICovXHJcbmltcG9ydCBBdXRvSW1wb3J0IGZyb20gXCJ1bnBsdWdpbi1hdXRvLWltcG9ydC92aXRlXCI7XHJcbmltcG9ydCBDb21wb25lbnRzIGZyb20gXCJ1bnBsdWdpbi12dWUtY29tcG9uZW50cy92aXRlXCI7XHJcbmltcG9ydCB7IEVsZW1lbnRQbHVzUmVzb2x2ZXIgfSBmcm9tIFwidW5wbHVnaW4tdnVlLWNvbXBvbmVudHMvcmVzb2x2ZXJzXCI7XHJcbmltcG9ydCBJY29ucyBmcm9tIFwidW5wbHVnaW4taWNvbnMvdml0ZVwiO1xyXG5pbXBvcnQgSWNvbnNSZXNvbHZlciBmcm9tIFwidW5wbHVnaW4taWNvbnMvcmVzb2x2ZXJcIjtcclxuaW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSBcInZpdGVcIjtcclxuaW1wb3J0IHsgbm9kZVBvbHlmaWxscyB9IGZyb20gXCJ2aXRlLXBsdWdpbi1ub2RlLXBvbHlmaWxsc1wiO1xyXG5pbXBvcnQgcGF0aCBmcm9tIFwicGF0aFwiOyAvLyBcdTYyN0VcdTRFMERcdTUyMzBcdTZBMjFcdTU3NTcgXHUyMDE4cGF0aFx1MjAxOSBcdTYyMTZcdTUxNzZcdTc2RjhcdTVCRjlcdTVFOTRcdTc2ODRcdTdDN0JcdTU3OEJcdTU4RjBcdTY2MEUgLT4gbnBtIGluc3RhbGwgQHR5cGVzL25vZGUgLS1zYXZlLWRldlxyXG5pbXBvcnQgdnVlIGZyb20gXCJAdml0ZWpzL3BsdWdpbi12dWVcIjtcclxuXHJcbmNvbnN0IHBhdGhTcmMgPSBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBcInNyY1wiKTtcclxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcclxuICBidWlsZDp7XHJcbiAgICByb2xsdXBPcHRpb25zOntcclxuICAgICAgbWFudWFsQ2h1bmtzKGlkKSB7XHJcbiAgICAgICAgaWYgKGlkLmluY2x1ZGVzKCdub2RlX21vZHVsZXMnKSkge1xyXG4gICAgICAgICAgcmV0dXJuICd2ZW5kb3InO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0sXHJcbiAgcGx1Z2luczogW1xyXG4gICAgbm9kZVBvbHlmaWxscygpLCAvLyBWaXRlOiBgQnVmZmVyIGlzIG5vdCBkZWZpbmVkYCBcdTMwNkVcdTMwQThcdTMwRTlcdTMwRkNcdTMwNENcdTc2N0FcdTc1MUZcdTMwNTdcdTMwNUZcdTU4MzRcdTU0MDhcdTMwNkVcdTVCRkVcdTUxRTZcdTY1QjlcdTZDRDVcclxuICAgIHZ1ZSgpLFxyXG4gICAgQXV0b0ltcG9ydCh7XHJcbiAgICAgIC8vIEF1dG8gaW1wb3J0IGZ1bmN0aW9ucyBmcm9tIFZ1ZSwgZS5nLiByZWYsIHJlYWN0aXZlLCB0b1JlZi4uLlxyXG4gICAgICAvLyBcdTgxRUFcdTUyQThcdTVCRkNcdTUxNjUgVnVlIFx1NzZGOFx1NTE3M1x1NTFGRFx1NjU3MFx1RkYwQ1x1NTk4Mlx1RkYxQXJlZiwgcmVhY3RpdmUsIHRvUmVmIFx1N0I0OVxyXG4gICAgICBpbXBvcnRzOiBbXCJ2dWVcIl0sXHJcblxyXG4gICAgICAvLyBBdXRvIGltcG9ydCBmdW5jdGlvbnMgZnJvbSBFbGVtZW50IFBsdXMsIGUuZy4gRWxNZXNzYWdlLCBFbE1lc3NhZ2VCb3guLi4gKHdpdGggc3R5bGUpXHJcbiAgICAgIC8vIFx1ODFFQVx1NTJBOFx1NUJGQ1x1NTE2NSBFbGVtZW50IFBsdXMgXHU3NkY4XHU1MTczXHU1MUZEXHU2NTcwXHVGRjBDXHU1OTgyXHVGRjFBRWxNZXNzYWdlLCBFbE1lc3NhZ2VCb3guLi4gKFx1NUUyNlx1NjgzN1x1NUYwRilcclxuICAgICAgcmVzb2x2ZXJzOiBbXHJcbiAgICAgICAgRWxlbWVudFBsdXNSZXNvbHZlcigpLFxyXG5cclxuICAgICAgICAvLyBBdXRvIGltcG9ydCBpY29uIGNvbXBvbmVudHNcclxuICAgICAgICAvLyBcdTgxRUFcdTUyQThcdTVCRkNcdTUxNjVcdTU2RkVcdTY4MDdcdTdFQzRcdTRFRjZcclxuICAgICAgICBJY29uc1Jlc29sdmVyKHtcclxuICAgICAgICAgIHByZWZpeDogXCJJY29uXCIsXHJcbiAgICAgICAgfSksXHJcbiAgICAgIF0sXHJcblxyXG4gICAgICBkdHM6IHBhdGgucmVzb2x2ZShwYXRoU3JjLCBcImF1dG8taW1wb3J0cy5kLnRzXCIpLFxyXG4gICAgfSksXHJcblxyXG4gICAgQ29tcG9uZW50cyh7XHJcbiAgICAgIHJlc29sdmVyczogW1xyXG4gICAgICAgIC8vIEF1dG8gcmVnaXN0ZXIgaWNvbiBjb21wb25lbnRzXHJcbiAgICAgICAgLy8gXHU4MUVBXHU1MkE4XHU2Q0U4XHU1MThDXHU1NkZFXHU2ODA3XHU3RUM0XHU0RUY2XHJcbiAgICAgICAgSWNvbnNSZXNvbHZlcih7XHJcbiAgICAgICAgICBlbmFibGVkQ29sbGVjdGlvbnM6IFtcImVwXCJdLFxyXG4gICAgICAgIH0pLFxyXG4gICAgICAgIC8vIEF1dG8gcmVnaXN0ZXIgRWxlbWVudCBQbHVzIGNvbXBvbmVudHNcclxuICAgICAgICAvLyBcdTgxRUFcdTUyQThcdTVCRkNcdTUxNjUgRWxlbWVudCBQbHVzIFx1N0VDNFx1NEVGNlxyXG4gICAgICAgIEVsZW1lbnRQbHVzUmVzb2x2ZXIoKSxcclxuICAgICAgXSxcclxuXHJcbiAgICAgIGR0czogcGF0aC5yZXNvbHZlKHBhdGhTcmMsIFwiY29tcG9uZW50cy5kLnRzXCIpLFxyXG4gICAgfSksXHJcblxyXG4gICAgSWNvbnMoe1xyXG4gICAgICBhdXRvSW5zdGFsbDogdHJ1ZSxcclxuICAgIH0pLFxyXG4gIF0sXHJcbiAgLy8gXHU5MTREXHU3RjZFXHU4REVGXHU1Rjg0XHU1MjJCXHU1NDBEXHJcbiAgcmVzb2x2ZToge1xyXG4gICAgYWxpYXM6IFtcclxuICAgICAge1xyXG4gICAgICAgIGZpbmQ6IFwiQFwiLFxyXG4gICAgICAgIHJlcGxhY2VtZW50OiBwYXRoLnJlc29sdmUoXCIuL3NyY1wiKSxcclxuICAgICAgfSxcclxuICAgIF0sXHJcbiAgfSxcclxuICBkZWZpbmU6IHtcclxuICAgIFwicHJvY2Vzcy5lbnZcIjoge30sXHJcbiAgfSxcclxuICAvLyBcdTgxRUFcdTVCOUFcdTRFNDlcdTZBMjFcdTVGMEZcdTUzRDhcdTkxQ0ZcdTVGMDBcdTU5MzQsIFx1NTk4Mlx1RkYxQVx1NEVFNSBBUFBfIFx1NUYwMFx1NTkzNFxyXG4gIGVudlByZWZpeDogXCJBUFBfXCIsXHJcbn0pO1xyXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBT0EsT0FBTyxnQkFBZ0I7QUFDdkIsT0FBTyxnQkFBZ0I7QUFDdkIsU0FBUywyQkFBMkI7QUFDcEMsT0FBTyxXQUFXO0FBQ2xCLE9BQU8sbUJBQW1CO0FBQzFCLFNBQVMsb0JBQW9CO0FBQzdCLFNBQVMscUJBQXFCO0FBQzlCLE9BQU8sVUFBVTtBQUNqQixPQUFPLFNBQVM7QUFmaEIsSUFBTSxtQ0FBbUM7QUFpQnpDLElBQU0sVUFBVSxLQUFLLFFBQVEsa0NBQVcsS0FBSztBQUU3QyxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixPQUFNO0FBQUEsSUFDSixlQUFjO0FBQUEsTUFDWixhQUFhLElBQUk7QUFDZixZQUFJLEdBQUcsU0FBUyxjQUFjLEdBQUc7QUFDL0IsaUJBQU87QUFBQSxRQUNUO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDUCxjQUFjO0FBQUE7QUFBQSxJQUNkLElBQUk7QUFBQSxJQUNKLFdBQVc7QUFBQTtBQUFBO0FBQUEsTUFHVCxTQUFTLENBQUMsS0FBSztBQUFBO0FBQUE7QUFBQSxNQUlmLFdBQVc7QUFBQSxRQUNULG9CQUFvQjtBQUFBO0FBQUE7QUFBQSxRQUlwQixjQUFjO0FBQUEsVUFDWixRQUFRO0FBQUEsUUFDVixDQUFDO0FBQUEsTUFDSDtBQUFBLE1BRUEsS0FBSyxLQUFLLFFBQVEsU0FBUyxtQkFBbUI7QUFBQSxJQUNoRCxDQUFDO0FBQUEsSUFFRCxXQUFXO0FBQUEsTUFDVCxXQUFXO0FBQUE7QUFBQTtBQUFBLFFBR1QsY0FBYztBQUFBLFVBQ1osb0JBQW9CLENBQUMsSUFBSTtBQUFBLFFBQzNCLENBQUM7QUFBQTtBQUFBO0FBQUEsUUFHRCxvQkFBb0I7QUFBQSxNQUN0QjtBQUFBLE1BRUEsS0FBSyxLQUFLLFFBQVEsU0FBUyxpQkFBaUI7QUFBQSxJQUM5QyxDQUFDO0FBQUEsSUFFRCxNQUFNO0FBQUEsTUFDSixhQUFhO0FBQUEsSUFDZixDQUFDO0FBQUEsRUFDSDtBQUFBO0FBQUEsRUFFQSxTQUFTO0FBQUEsSUFDUCxPQUFPO0FBQUEsTUFDTDtBQUFBLFFBQ0UsTUFBTTtBQUFBLFFBQ04sYUFBYSxLQUFLLFFBQVEsT0FBTztBQUFBLE1BQ25DO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFBQSxFQUNBLFFBQVE7QUFBQSxJQUNOLGVBQWUsQ0FBQztBQUFBLEVBQ2xCO0FBQUE7QUFBQSxFQUVBLFdBQVc7QUFDYixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
