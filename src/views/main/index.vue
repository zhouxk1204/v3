<template>
  <div class="h-full">
    <el-container>
      <el-header class="relative">
        <div class="absolute inset-0 flex items-center justify-between px-5 border-b border-ep">
          <h1>
            <Icon icon="emojione-monotone:peach" width="40" height="40" class="text-red-300 cursor-pointer"
              @click="onClickLogo" />
          </h1>
          <div class="flex items-center gap-3">
            <el-switch v-model="isDark" :active-action-icon="Moon" :inactive-action-icon="Sunny" />
            <el-dropdown>
              <img :src="avatar" class="w-12 h-12 rounded-full" />
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="onClickSetting">
                    <el-icon>
                      <Setting />
                    </el-icon>
                    <span>个人设置</span> </el-dropdown-item>
                  <el-dropdown-item @click="onClickLogout" divided>
                    <el-icon>
                      <SwitchButton />
                    </el-icon>
                    <span>退出登录</span></el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </div>
      </el-header>
      <el-container class="h-[calc(100dvh-60px)]">
        <el-aside :width="isCollapse ? '65px' : '200px'">
          <el-menu class="h-[calc(100dvh-60px)] relative" :default-active="currentRoute.name?.toString() ?? ''"
            :router="true" popper-effect="light" :collapse-transition="false" :collapse="isCollapse">
            <MenuItem :menuList="menuRoutes" :parentRoute="parentRoute">
            </MenuItem>
            <el-button :icon="Operation" @click="toggleMenu()" class="absolute bottom-0 w-full mb-2" link />
          </el-menu>
        </el-aside>
        <el-container>
          <el-main>
            <router-view></router-view>
          </el-main>
          <el-footer class="border-t border-ep">
            <div class="flex flex-col items-center justify-center h-full text-xs text-gray-400">
              <div class="underline">
                <a href="https://beian.miit.gov.cn/" target="_blank">蜀ICP备2024053978号</a>
              </div>
              <span>Powered by zhouxk © 2024 </span>
            </div>
          </el-footer>
        </el-container>
      </el-container>
    </el-container>
  </div>
</template>

<script lang="ts" setup>
import { getAllSelectOption } from "@/api/common";
import useStore from "@/store";
import { Moon, Operation, Setting, Sunny, SwitchButton } from "@element-plus/icons-vue";
import { useDark } from "@vueuse/core";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
import router from "../../router";

const { user } = storeToRefs(useStore().user);
const avatar = computed(() => {
  return user.value.avatar || new URL("../../assets/img/avatar.jpg", import.meta.url).href;
})


const currentRoute = useRouter().currentRoute;

const parentRoute = "/main";
const menuRoutes =
  router.options.routes.find((e) => e.path === parentRoute)?.children ?? [];
menuRoutes.sort(
  (a, b) => Number(a.meta?.sort ?? 0) - Number(b.meta?.sort ?? 0)
);
4;

const onClickLogo = () => {
  router.replace("/home");
}

const onClickLogout = () => {
  localStorage.removeItem("token");
  router.replace("/home");
}

const init = async () => {
  if (useStore().selection.selectionList.length === 0) {
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

const isCollapse = ref<boolean>(false);
const toggleMenu = () => {
  isCollapse.value = !isCollapse.value;
}
const isDark = useDark();

const onClickSetting = () => {
  router.push("/main/profile");
};
</script>

<style lang="scss" scoped>
.cus-blur {
  z-index: 999;
  background: radial-gradient(transparent 1px, #fff 1px);
  backdrop-filter: saturate(50%) blur(4px);
  background-size: 4px 4px;
}
</style>
