import { App, defineAsyncComponent } from "vue";

const modulesFiles = import.meta.glob("./**/*.vue");

export default {
  install: (app: App): void => {
    for (const path in modulesFiles) {
      const componentName = modulesFiles[path].name.split("/")[1];
      const modulesContent: any = modulesFiles[path];
      app.component(componentName, defineAsyncComponent(modulesContent));
    }
  },
};
