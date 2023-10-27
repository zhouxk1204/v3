import "./style.css";

import AutoRegisterComponents from "@/components/AutoRegisterComponents";
import { Icon } from "@iconify/vue";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

const app = createApp(App);
app.component("Icon", Icon);

app.use(pinia).use(AutoRegisterComponents).use(router).mount("#app");
