import "./style.css";

import AutoRegisterComponents from "@/components/AutoRegisterComponents";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

createApp(App).use(pinia).use(AutoRegisterComponents).use(router).mount("#app");
