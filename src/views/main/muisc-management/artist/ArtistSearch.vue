<template>
  <div class="p-4 bg-white rounded-xl">
    <div class="flex items-end gap-5">
      <!-- 歌手名称 -->
      <div class="flex items-center gap-2 font-bold">
        <label class="block mb-1 text-sm text-gray-600">歌手名称</label>
        <input
          v-model="localSearch.name"
          type="text"
          placeholder="请输入歌手名称"
          class="w-56 px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <!-- 国家 -->
       <div class="flex items-center gap-2 font-bold">
        <label class="block mb-1 text-sm text-gray-600">国家</label>
        <input
          v-model="localSearch.country"
          type="text"
          placeholder="国家"
          class="w-40 px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <button
        @click="onSearch"
        class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
      >
        查询
      </button>

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
import type { ArtistSearchForm } from "@/types/music/artist";
import { reactive } from "vue";

const props = defineProps<{
  modelValue?: ArtistSearchForm;
}>();

const emit = defineEmits<{
  (e: "search", payload: ArtistSearchForm): void;
  (e: "reset"): void;
  (e: "update:modelValue", val: ArtistSearchForm): void;
}>();

const localSearch = reactive<ArtistSearchForm>({
  name: props.modelValue?.name || "",
  country: props.modelValue?.country || "",
});

const onSearch = () => {
  emit("search", { ...localSearch });
};

const onReset = () => {
  localSearch.name = "";
  localSearch.country = "";
  emit("reset");
};
</script>
