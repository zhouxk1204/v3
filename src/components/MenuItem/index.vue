<template>
  <div v-for="menu in menuList">
    <template v-if="menu.children.length === 0">
      <el-menu-item :index="menu.name">
        <router-link :to="parentRoute + '/' + menu.path">
          {{ menu.meta.title }}
        </router-link>
      </el-menu-item>
    </template>
    <template v-else>
      <el-sub-menu :index="menu.name">
        <template #title> {{ menu.meta.title }}</template>
        <MenuItem
          :menuList="menu.children"
          :parentRoute="parentRoute + '/' + menu.path"
        >
        </MenuItem>
      </el-sub-menu>
    </template>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  parentRoute: string;
  menuList: any[];
}>();
</script>
<style lang="scss" scoped></style>
