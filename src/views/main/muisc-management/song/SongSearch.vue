<template>
  <div class="p-4 bg-white rounded-xl">
    <div class="flex items-end gap-5">
      <!-- 歌曲名称 -->
      <div class="flex items-center gap-2 font-bold">
        <label class="block mb-1 text-sm text-gray-600">歌曲名称</label>
        <input
          v-model="localSearch.title"
          type="text"
          class="w-56 px-3 py-2 text-sm border rounded-lg"
        />
      </div>

      <!-- 歌手选择 -->
      <div class="flex items-center gap-2 font-bold">
        <label class="block mb-1 text-sm text-gray-600">歌手</label>
        <select
          v-model="localSearch.artistId"
          class="w-48 px-3 py-2 text-sm border rounded-lg"
        >
          <option value="">全部</option>
          <option
            v-for="artist in artistList"
            :key="artist.artistId"
            :value="artist.artistId"
          >
            {{ artist.name }}
          </option>
        </select>
      </div>

      <button
        @click="onSearch"
        class="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg"
      >
        查询
      </button>

      <button @click="onReset" class="px-4 py-2 text-sm border rounded-lg">
        重置
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useArtistStore } from "@/store/music/artist";
import type { SongSearchForm } from "@/types/music/song";
import { computed, onMounted, reactive } from "vue";

const props = defineProps<{
  modelValue?: SongSearchForm;
}>();

const emit = defineEmits<{
  (e: "search", payload: SongSearchForm): void;
  (e: "reset"): void;
}>();

/** 歌手 store */
const artistStore = useArtistStore();

/** 确保有数据（防止刷新页面没缓存） */
onMounted(() => {
  if (!artistStore.artistList.length) {
    artistStore.fetchArtistList();
  }
});

/** select 数据源 */
const artistList = computed(() => artistStore.artistList);

/** 本地搜索表单 */
const localSearch = reactive<SongSearchForm>({
  title: props.modelValue?.title || "",
  artistId: props.modelValue?.artistId || "",
});

const onSearch = () => {
  emit("search", { ...localSearch });
};

const onReset = () => {
  localSearch.title = "";
  localSearch.artistId = "";
  emit("reset");
};
</script>
