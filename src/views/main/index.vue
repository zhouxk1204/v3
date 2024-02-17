<template>
  <div>
    <header
      class="sticky top-0 flex items-center justify-between h-16 px-4 bg-transparent border-b cus-blur"
    >
      <div class="hidden max-sm:flex">
        <el-button
        :icon="Menu"
        circle
        @click="drawer = true"
      />
      </div>
      <h1 class="text-4xl">🍑</h1>
      <div>
        <a
          href="https://github.com/zhouxk1204/v3"
          target="_blank"
          class="cursor-pointer"
          ><Icon icon="ri:github-fill" width="30"
        /></a>
      </div>
    </header>
    <el-drawer
      size="300"
      direction="ltr"
      v-model="drawer"
      title="I am the title"
      :with-header="false"
    >
      <el-menu
        class="overflow-auto"
        :default-active="currentRoute.name?.toString() ?? ''"
        :router="true"
        :collapse="false"
        popper-effect="light"
      >
        <MenuItem :menuList="menuRoutes" :parentRoute="parentRoute"></MenuItem>
      </el-menu>
    </el-drawer>
    <div class="fixed left-0 top-16 max-sm:hidden">
      <el-menu
        class="h-[calc(100vh-64px)] overflow-auto"
        :default-active="currentRoute.name?.toString() ?? ''"
        :router="true"
        :collapse="false"
        popper-effect="light"
      >
        <MenuItem :menuList="menuRoutes" :parentRoute="parentRoute"></MenuItem>
      </el-menu>
    </div>
    <div class="py-5 pr-5 pl-44 max-sm:pl-5">
      <router-view></router-view>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from "vue-router";
import router from "../../router";
import { Menu } from "@element-plus/icons-vue";

const currentRoute = useRouter().currentRoute;

const parentRoute = "/main";
const menuRoutes =
  router.options.routes.find((e) => e.path === parentRoute)?.children ?? [];
menuRoutes.sort(
  (a, b) => Number(a.meta?.sort ?? 0) - Number(b.meta?.sort ?? 0)
);
4;

const drawer = ref(false);
</script>
<style lang="scss" scoped>
.cus-blur {
  z-index: 999;
  background: radial-gradient(transparent 1px, #fff 1px);
  backdrop-filter: saturate(50%) blur(4px);
  background-size: 4px 4px;
}
</style>
