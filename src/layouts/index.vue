<template>
  <div class="h-screen overflow-x-hidden overflow-y-scroll">
    <header
      class="fixed top-0 left-0 z-10 w-[calc(100vw-15px)] bg-white border-b border-gray-200 h-14 flex items-center px-8"
    >
      HEADER
    </header>
    <aside
      class="fixed left-0 w-40 h-screen px-8 pb-24 overflow-y-auto border-r border-gray-200 top-14"
    >
      <section class="flex flex-col pt-6">
        <router-link
          v-for="menu in menuList"
          :key="menu.route"
          :to="menu.route"
        >
          <p
            class="py-1 text-sm text-gray-400 hover:text-black"
            :class="currentRoute === menu.route ? 'text-black' : ''"
            @click="onClickMenu(menu)"
          >
            {{ menu.label }}
          </p>
        </router-link>
      </section>
    </aside>
    <div class="px-24 pt-16 ml-40 mt-14">
      <router-view></router-view>
    </div>
  </div>
</template>

<script lang="ts" setup>
import router from "@/router";
import { ref } from "vue";

const menuList: { label: string; route: string }[] =
  router.options.routes[0].children?.map((e) => {
    return {
      label: (e.meta?.title as string) ?? "",
      route: `/${e.path}`,
    };
  }) ?? [];

const currentRoute = ref<string>(menuList[0].route ?? "");

const onClickMenu = (data: { label: string; route: string }) => {
  currentRoute.value = data.route;
};
</script>
