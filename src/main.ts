import "element-plus/theme-chalk/dark/css-vars.css";
import "element-plus/theme-chalk/display.css";
import "./style.scss";

import AutoRegisterComponents from "@/components/AutoRegisterComponents";
import { Icon } from "@iconify/vue";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import { createApp } from "vue";
import App from "./App.vue";
import { throttleDirective } from "./directives/throttleDirective";
import router from "./router";

const app = createApp(App);

// pinia
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

// iconify
app.component("Icon", Icon);

// 注册全局指令
app.directive("throttle", throttleDirective);

// 将获取环境的方法挂载到vue的原型上，方便后面的使用
app.config.globalProperties.getEnv = import.meta.env;

app.use(pinia).use(AutoRegisterComponents).use(router).mount("#app");
