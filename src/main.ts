import "./style.css";

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

app.use(pinia).use(AutoRegisterComponents).use(router).mount("#app");
