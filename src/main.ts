import "./style.css";

import { createPersistedState } from "pinia-plugin-persistedstate";

import { createPinia } from "pinia";
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

const pinia = createPinia();
pinia.use(
  createPersistedState({
    auto: true,
  })
);

createApp(App).use(router).use(pinia).mount("#app");
