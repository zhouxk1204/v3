<template>
  <div class="relative h-full overflow-hidden dark:bg-[#1a1a1a]">
    <Banner></Banner>
    <aside
      class="absolute h-full transition-all border-r border-gray-200 dark:border-dark-300 top-20"
    >
      <section class="flex flex-col w-48 px-2 pt-2 overflow-hidden">
        <MenuItem :menuList="menuRoutes" :parentRoute="parentRoute"></MenuItem>
      </section>
    </aside>
    <div
      class="absolute bottom-0 right-0 px-10 py-5 overflow-y-auto transition-all top-20 left-48"
    >
      <router-view></router-view>
      
    </div>
  </div>
  <MusicPlayer></MusicPlayer>
</template>

<script lang="ts" setup>
import router from "../../router";

const parentRoute = "/main";
const menuRoutes =
  router.options.routes.find((e) => e.path === parentRoute)?.children ?? [];
menuRoutes.sort(
  (a, b) => Number(a.meta?.sort ?? 0) - Number(b.meta?.sort ?? 0)
);
</script>
