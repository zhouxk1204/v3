<template>
  <div v-for="menu in menuList">
    <div v-if="menu.children.length > 0">
      <div class="flex items-center p-2 mb-1 text-gray-500 rounded-md">
        <div class="mr-2">{{ menu.meta.emoji }}</div>
        <div>{{ menu.meta.title }}</div>
      </div>
    </div>
    <router-link
      v-if="menu.children.length === 0"
      :to="parentRoute + '/' + menu.path"
    >
      <div
        class="flex items-center p-2 mb-1 text-gray-500 rounded-md"
        :class="
          currentRoute === `${parentRoute}/${menu.path}`
            ? 'bg-blue-400 text-white'
            : 'hover:bg-gray-200'
        "
      >
        <div class="mr-2">{{ menu.meta.emoji }}</div>
        <div>{{ menu.meta.title }}</div>
      </div>
    </router-link>
    <div class="ml-2" v-if="menu.children.length > 0">
      <MenuItem
        :menuList="menu.children"
        :parentRoute="parentRoute + '/' + menu.path"
      ></MenuItem>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { onBeforeRouteUpdate, useRouter } from "vue-router";

const router = useRouter();
const currentRoute = ref(router.currentRoute.value.fullPath);
onBeforeRouteUpdate((to) => {
  currentRoute.value = to.path;
});

defineProps<{
  parentRoute: string;
  menuList: any[];
}>();
</script>
<style lang="scss" scoped></style>
