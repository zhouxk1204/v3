<template>
  <div>
    <header
      class="sticky top-0 flex items-center justify-between h-16 px-4 bg-transparent border-b webkit-sticky cus-blur">
      <div class="hidden max-[1280px]:flex">
        <el-button :icon="Menu" circle @click="drawer = true" />
      </div>
      <h1 class="text-4xl animate-zoom" @click="onLogo">🍑</h1>
      <div>
        <a href="https://github.com/zhouxk1204/v3" target="_blank" class="cursor-pointer">
          <Icon icon="ri:github-fill" class="text-red-300" width="30" />
        </a>
      </div>
    </header>
    <el-drawer size="300" direction="ltr" v-model="drawer" :with-header="false">
      <el-menu class="pt-5 overflow-auto" :default-active="currentRoute.name?.toString() ?? ''" :router="true"
        :collapse="false" popper-effect="light" @select="drawer = false">
        <MenuItem :menuList="menuRoutes" :parentRoute="parentRoute">
        </MenuItem>
      </el-menu>
    </el-drawer>
    <div class="fixed left-0 top-16 max-[1280px]:hidden" @click="drawer = false">
      <el-menu class="h-[calc(100vh-64px)] overflow-auto" :default-active="currentRoute.name?.toString() ?? ''"
        :router="true" :collapse="false" popper-effect="light">
        <div>
          <MenuItem :menuList="menuRoutes" :parentRoute="parentRoute">
          </MenuItem>
        </div>
      </el-menu>
    </div>
    <div class="pt-5 pb-10 pr-5 pl-44 max-[1280px]:pl-5 min-h-[calc(100vh-64px)]">
      <router-view></router-view>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Menu } from "@element-plus/icons-vue";
import { useRouter } from "vue-router";
import router from "../../router";

const currentRoute = useRouter().currentRoute;

const parentRoute = "/main";
const menuRoutes =
  router.options.routes.find((e) => e.path === parentRoute)?.children ?? [];
menuRoutes.sort(
  (a, b) => Number(a.meta?.sort ?? 0) - Number(b.meta?.sort ?? 0)
);
4;

const drawer = ref(false);

const onLogo = () => {
  router.replace("/marriage");
}
</script>
<style lang="scss" scoped>
.cus-blur {
  z-index: 999;
  background: radial-gradient(transparent 1px, #fff 1px);
  backdrop-filter: saturate(50%) blur(4px);
  background-size: 4px 4px;
}
</style>
