<template>
  <div v-for="menu in menuList" :key="menu.name">
    <template v-if="menu.children.length === 0">
      <el-menu-item :index="menu.name" :route="parentRoute + '/' + menu.path">
        <div class="flex items-center">
          <Icon :icon="menu.meta.icon" class="mr-2"></Icon>
          <span>{{ menu.meta.title }}</span>
        </div>
      </el-menu-item>
    </template>
    <template v-else>
      <el-sub-menu :index="menu.name" :route="parentRoute + '/' + menu.path">
        <template #title>
          <div class="flex items-center">
            <Icon :icon="menu.meta.icon" class="mr-2"></Icon>
            <span>{{ menu.meta.title }}</span>
          </div>
        </template>
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
