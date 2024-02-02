<template>
  <div>
    <header
      class="sticky top-0 flex items-center justify-between h-16 px-4 bg-transparent border-b cus-blur"
    >
      <h1 class="text-4xl">🍑</h1>
      <div>
        <a
          href="https://github.com/zhouxk1204/v3"
          target="_blank"
          class="cursor-pointer"
          ><Icon icon="ri:github-fill" width="24" height="24"
        /></a>
      </div>
    </header>
    <div class="fixed left-0 top-16">
      <el-menu
        class="h-[calc(100vh-64px)] overflow-auto"
        :default-active="currentRoute"
        :router="true"
      >
        <MenuItem :menuList="menuRoutes" :parentRoute="parentRoute"> </MenuItem>
      </el-menu>
    </div>
    <div class="py-5 pl-48">
      <router-view></router-view>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from "vue-router";
import router from "../../router";

const currentRoute = useRouter().currentRoute.value.name as string;
const parentRoute = "/main";
const menuRoutes =
  router.options.routes.find((e) => e.path === parentRoute)?.children ?? [];
menuRoutes.sort(
  (a, b) => Number(a.meta?.sort ?? 0) - Number(b.meta?.sort ?? 0)
);
</script>
<style lang="scss" scoped>
.cus-blur {
  background: radial-gradient(transparent 1px, #fff 1px);
  backdrop-filter: saturate(50%) blur(4px);
  background-size: 4px 4px;
}
</style>
