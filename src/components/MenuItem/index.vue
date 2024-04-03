<template>
  <div v-for="menu in menuList" :key="menu.name">
    <template v-if="menu.children.length === 0">
      <el-menu-item :index="menu.name" :route="parentRoute + '/' + menu.path">
        <el-icon>
          <component :is="menu.meta.icon"></component>
        </el-icon>
        <template #title>
          <span>{{ menu.meta.title }}</span>
        </template>
      </el-menu-item>
    </template>
    <template v-else>
      <el-sub-menu :index="menu.name" :route="parentRoute + '/' + menu.path">
        <el-icon>
          <!-- <setting /> -->
          <component :is="menu.meta.icon"></component>
        </el-icon>
        <template #title>
          <span>{{ menu.meta.title }}</span>
        </template>
        <MenuItem :menuList="menu.children" :parentRoute="parentRoute + '/' + menu.path">
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
