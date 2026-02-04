import { App, defineAsyncComponent } from "vue";

const modulesFiles = import.meta.glob("./**/*.vue");

export default {
  install: (app: App): void => {
    for (const path in modulesFiles) {
      // 从路径中提取组件名，例如 "./LoadingScreen/index.vue" -> "LoadingScreen"
      const pathParts = path.split("/");
      const componentName = pathParts[pathParts.length - 2]; // 获取文件夹名作为组件名
      
      if (componentName && componentName !== ".") {
        const modulesContent: any = modulesFiles[path];
        app.component(componentName, defineAsyncComponent(modulesContent));
      }
    }
  },
};
