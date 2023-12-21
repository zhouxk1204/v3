<template>
  <div class="h-screen overflow-hidden">
    <Banner></Banner>
    <aside
      class="fixed h-screen pb-12 transition-all border-r border-gray-200 top-20"
    >
      <section class="flex flex-col w-48 px-2 pt-2 overflow-hidden">
        <MenuItem :menuList="menuRoutes" :parentRoute="parentRoute"></MenuItem>
      </section>
    </aside>
    <div
      class="fixed bottom-0 right-0 p-10 overflow-y-auto h-[calc(100vh-80px)] transition-all left-48"
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
