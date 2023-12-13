<template>
  <div class="h-screen overflow-hidden">
    <Banner></Banner>
    <aside
      class="fixed left-0 h-screen pb-12 border-r border-gray-200 w-60 top-20"
    >
      <section class="flex flex-col px-4 pt-2">
        <MenuItem :menuList="menuRoutes" :parentRoute="parentRoute"></MenuItem>
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
import router from "../../router";

const parentRoute = "/main";

const menuRoutes =
  router.options.routes.find((e) => e.path === parentRoute)?.children ?? [];
menuRoutes.sort(
  (a, b) => Number(a.meta?.sort ?? 0) - Number(b.meta?.sort ?? 0)
);
</script>
