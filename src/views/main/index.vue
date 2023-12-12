<template>
  <div class="h-screen overflow-hidden">
    <Banner></Banner>
    <aside
      class="fixed left-0 h-screen pb-12 border-r border-gray-200 w-60 top-20"
    >
      <section class="flex flex-col px-4 pt-2">
        <router-link
          :to="menu.route"
          v-for="menu in menuList"
          :key="menu.route"
        >
          <p
            class="px-2 py-2 mt-1 text-sm rounded hover:bg-blue-500 hover:text-white"
            :class="
              currentRoute === menu.route
                ? 'bg-blue-500 text-white'
                : 'text-gray-600'
            "
            @click="onClickMenu(menu)"
          >
            {{ menu.label }}
          </p>
        </router-link>
      </section>
    </aside>
    <div
      class="fixed bottom-0 right-0 px-20 py-10 overflow-y-auto left-60 h-[calc(100vh-80px)]"
    >
      <router-view></router-view>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { onBeforeRouteUpdate } from "vue-router";
import router from "../../router";
import { Menu } from "./type";

onBeforeRouteUpdate((to) => {
  currentRoute.value = to.path;
});

const menuRoutes =
  router.options.routes.find((e) => e.path === "/main")?.children ?? [];
console.log("%c Line:46 🍐 menuRoutes", "color:#7f2b82", menuRoutes);

const menuList: Menu[] =
  menuRoutes.map((e) => {
    return {
      label: (e.meta?.title as string) ?? "menu",
      route: `/main/${e.path}`,
    };
  }) ?? [];

const currentRoute = ref<string>(router.currentRoute.value.path);

/**
 * Menu click event
 * @param {Menu} menu
 */
const onClickMenu = (menu: Menu): void => {
  currentRoute.value = menu.route;
};
</script>
