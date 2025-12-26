<template>
  <div class="p-4 bg-white shadow-sm rounded-xl">
    <div class="flex items-end gap-4">
      <!-- 专辑名称 -->
      <div>
        <label class="block mb-1 text-sm text-gray-600">专辑名称</label>
        <input
          v-model="localSearch.title"
          type="text"
          placeholder="请输入专辑名称"
          class="w-56 px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <!-- 歌手ID -->
      <div>
        <label class="block mb-1 text-sm text-gray-600">歌手 ID</label>
        <input
          v-model.number="localSearch.artistId"
          type="number"
          placeholder="歌手 ID"
          class="w-40 px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <!-- 查询按钮 -->
      <button
        @click="onSearch"
        class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
      >
        查询
      </button>

      <!-- 重置按钮 -->
      <button
        @click="onReset"
        class="px-4 py-2 text-sm text-gray-600 border rounded-lg hover:bg-gray-100"
      >
        重置
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from "vue";

interface AlbumSearchForm {
  title?: string;
  artistId?: number;
}

const props = defineProps<{
  modelValue?: AlbumSearchForm;
}>()

const emit = defineEmits<{
  (e: "search", payload: AlbumSearchForm): void;
  (e: "reset"): void;
}>();

const localSearch = reactive<AlbumSearchForm>({
  title: props.modelValue?.title || "",
  artistId: props.modelValue?.artistId || undefined,
});

/** 查询 */
const onSearch = () => {
  emit("search", { ...localSearch });
};

/** 重置 */
const onReset = () => {
  localSearch.title = "";
  localSearch.artistId = undefined;
  emit("reset");
};
</script>
