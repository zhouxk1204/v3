<template>
  <div class="h-full">
    <header
      class="sticky top-0 flex items-center justify-between h-16 px-4 bg-transparent border-b webkit-sticky cus-blur">
      <div class="hidden max-[1280px]:flex">
        <el-button :icon="Menu" circle @click="drawer = true" />
      </div>
      <h1>
        <Icon icon="emojione-monotone:peach" width="40" height="40" class="text-red-300 cursor-pointer"
          @click="onClickLogo" />
      </h1>
      <div>
        <el-dropdown>
          <img :src="avatar" class="w-12 h-12 rounded-full" />
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="onClickLogout">Logout</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </header>
    <el-drawer size="200" direction="ltr" v-model="drawer" :with-header="false">
      <el-menu class="pt-5 overflow-auto" :default-active="currentRoute.name?.toString() ?? ''" :router="true"
        :collapse="false" popper-effect="light" @select="drawer = false">
        <h2 class="pb-5 text-2xl text-center text-red-300 border-b">🍑 Peach</h2>
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
    <div class="pt-5 pb-10 pr-5 pl-44 max-[1280px]:pl-5">
      <router-view></router-view>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { getAllSelectOption } from "@/api/common";
import useStore from "@/store";
import { Menu } from "@element-plus/icons-vue";
import { useRouter } from "vue-router";
import router from "../../router";

const avatar = new URL('../../assets/img/avatar.jpg', import.meta.url).href;

const currentRoute = useRouter().currentRoute;

const parentRoute = "/main";
const menuRoutes =
  router.options.routes.find((e) => e.path === parentRoute)?.children ?? [];
menuRoutes.sort(
  (a, b) => Number(a.meta?.sort ?? 0) - Number(b.meta?.sort ?? 0)
);
4;

const drawer = ref(false);

const onClickLogo = () => {
  router.replace("/home");
}

const onClickLogout = () => {
  localStorage.removeItem("token");
  router.replace("/home");
}

const init = async () => {
  if (useStore().selection.list.length === 0) {
    // 显示 Loading
    const loading = ElLoading.service({
      lock: true,
      text: "正在初始化...",
      background: "rgba(255, 255, 255, 0.1)",
    });
    const selectOptionRes = await getAllSelectOption();
    useStore().selection.setSelectOptionList(selectOptionRes.data);
    loading.close();
  }
}


init();
</script>

<style lang="scss" scoped>
.cus-blur {
  z-index: 999;
  background: radial-gradient(transparent 1px, #fff 1px);
  backdrop-filter: saturate(50%) blur(4px);
  background-size: 4px 4px;
}
</style>
