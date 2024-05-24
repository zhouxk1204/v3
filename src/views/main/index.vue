<template>
  <div class="h-full">
    <el-container>
      <el-header class="relative">
        <div class="absolute inset-0 flex items-center justify-between px-5 border-b border-ep">
          <h1 class="flex items-center gap-3">
            <el-button :icon="Menu" circle @click="menuDrawer = true" class="hidden-sm-and-up" />
            <Icon icon="emojione-monotone:peach" width="40" height="40"
              class="text-red-300 cursor-pointer hidden-sm-and-down" @click="onClickLogo" />
            <el-drawer v-model="menuDrawer" direction="ltr" size="70%">
              <template #header>
                <span class="text-xl font-bold text-red-300">Peach</span>
              </template>
              <el-menu class="h-full border-t border-ep" :default-active="currentRoute.name?.toString() ?? ''"
                :router="true" popper-effect="light" :collapse-transition="false">
                <MenuItem :menuList="menuRoutes" :parentRoute="parentRoute">
                </MenuItem>
              </el-menu>
            </el-drawer>
          </h1>
          <div class="flex items-center gap-3">
            <el-button type="info" text :icon="FullScreen" @click="toggleFullScreen">
            </el-button>
            <el-switch v-model="isDark" :active-action-icon="Moon" :inactive-action-icon="Sunny" />
            <el-dropdown>
              <Image :src="avatar" :rounded="true" class="w-12 h-12"></Image>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="onClickSetting">
                    <el-icon>
                      <Setting />
                    </el-icon>
                    <span>个人中心</span> </el-dropdown-item>
                  <el-dropdown-item @click="logoutDialogVisible = true" divided>
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
        <el-aside :width="isCollapse ? '65px' : '200px'" class="hidden-sm-and-down">
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

    <el-dialog v-model="logoutDialogVisible" title="提示" width="500" align-center>
      <span class="flex items-center gap-1"><el-icon :size="24" color="#dca550">
          <WarningFilled />
        </el-icon>确定注销并退出系统吗？</span>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="logoutDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="onClickLogout">
            确认
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { getAllSelectOption } from "@/api/common";
import useStore from "@/store";
import { FullScreen, Menu, Moon, Operation, Setting, Sunny, SwitchButton, WarningFilled } from "@element-plus/icons-vue";
import { useDark } from "@vueuse/core";
import { storeToRefs } from "pinia";
import { RouteRecordRaw, useRouter } from "vue-router";
import router from "../../router";

const { user } = storeToRefs(useStore().user);
const avatar = computed(() => {
  return user.value.avatar;
})

const currentRoute = useRouter().currentRoute;

const parentRoute = "/main";
// const menuRoutes = (router.options.routes.find(e => e.path === parentRoute)?.children ?? [])
//   .filter(e => !(e.meta && e.meta.visible === false))
//   .sort((a, b) => Number(a.meta?.sort ?? 0) - Number(b.meta?.sort ?? 0));
const sortRoutes = (routes: Readonly<RouteRecordRaw[]>) => {
  return routes
    .filter(e => !(e.meta && e.meta.visible === false)) // 过滤掉 meta.visible === false 的路由
    .map(route => {
      if (route.children && route.children.length > 0) {
        route.children = sortRoutes(route.children);
      }
      return route;
    })
    .sort((a, b) => Number(a.meta?.sort ?? 0) - Number(b.meta?.sort ?? 0)); // 根据 meta.sort 进行排序
}

const menuRoutes = sortRoutes(router.options.routes.find(e => e.path === parentRoute)?.children ?? []);

console.log("%c Line:104 🥤 menuRoutes", "color:#ed9ec7", menuRoutes);

const onClickLogo = () => {
  router.replace("/home");
}

const logoutDialogVisible = ref(false);
const onClickLogout = () => {
  logoutDialogVisible.value = false;
  localStorage.removeItem("token");
  router.replace("/home");
}

const init = async () => {
  if (useStore().selection.selectionList.length === 0) {
    // 显示 Loading
    const loading = ElLoading.service({
      lock: true,
      text: "正在初始化...",
      background: "rgba(0, 0, 0, 0.2)",
    });
    const selectOptionRes = await getAllSelectOption();
    useStore().selection.setSelectOptionList(selectOptionRes.data);
    loading.close();
  }
}
init();

const isCollapse = ref<boolean>(true);
const toggleMenu = () => {
  isCollapse.value = !isCollapse.value;
}
const isDark = useDark();

const onClickSetting = () => {
  router.push("/main/profile");
};

const toggleFullScreen = () => {
  //获取当前是否全屏展示
  let full = document.fullscreenElement
  if (!full) {
    document.documentElement.requestFullscreen()
  } else {
    document.exitFullscreen()
  }
}



const menuDrawer = ref(false);
</script>

<style lang="scss" scoped>
.cus-blur {
  z-index: 999;
  background: radial-gradient(transparent 1px, #fff 1px);
  backdrop-filter: saturate(50%) blur(4px);
  background-size: 4px 4px;
}
</style>
