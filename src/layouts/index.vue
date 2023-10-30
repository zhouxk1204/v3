<template>
  <div class="h-screen overflow-x-hidden overflow-y-scroll">
    <header
      class="fixed top-0 left-0 z-10 w-[calc(100vw-15px)] bg-white border-b border-gray-200 h-14 flex items-center px-8"
    >
      <span class="text-3xl">😂</span>
    </header>
    <aside
      class="fixed left-0 h-screen pb-24 overflow-y-auto border-r border-gray-200 w-60 top-14"
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
    <div class="px-24 pt-16 ml-60 mt-14">
      <router-view></router-view>
    </div>
  </div>
</template>

<script lang="ts" setup>
import router from "@/router";
import { ref } from "vue";
import { onBeforeRouteUpdate } from "vue-router";
import { Menu } from "./type";

onBeforeRouteUpdate((to) => {
  currentRoute.value = to.path;
});

const menuList: Menu[] =
  router.options.routes[1].children?.map((e) => {
    return {
      label: (e.meta?.title as string) ?? "",
      route: `/${e.path}`,
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
