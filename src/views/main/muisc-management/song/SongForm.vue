<template>
  <form class="space-y-4" @submit.prevent="submitForm">
    <!-- 歌曲名称 -->
    <div class="space-y-1">
      <label class="text-sm font-medium">歌曲名称</label>
      <input
        v-model="form.title"
        type="text"
        required
        class="w-full px-3 py-2 border rounded-lg"
      />
    </div>

    <!-- 主歌手 -->
    <div class="space-y-1">
      <label class="text-sm font-medium">歌手</label>
      <select
        v-model="form.artistId"
        required
        class="w-full px-3 py-2 border rounded-lg"
      >
        <option value="">请选择歌手</option>
        <option
          v-for="artist in artistList"
          :key="artist.id"
          :value="artist.id"
        >
          {{ artist.name }}
        </option>
      </select>
    </div>

    <!-- 专辑 -->
    <div class="space-y-1">
      <label class="text-sm font-medium">所属专辑</label>
      <select v-model="form.albumId" class="w-full px-3 py-2 border rounded-lg">
        <option value="">无</option>
        <option
          v-for="album in albumList"
          :key="album.albumId"
          :value="album.albumId"
        >
          {{ album.title }}
        </option>
      </select>
    </div>

    <!-- 发布日期 -->
    <div class="space-y-1">
      <label class="text-sm font-medium">发布日期</label>
      <input
        v-model="form.releaseDate"
        type="date"
        class="w-full px-3 py-2 border rounded-lg"
      />
    </div>

    <!-- 歌曲封面 -->
    <div class="space-y-2" v-if="!isEdit">
      <label class="text-sm font-medium">歌曲封面</label>
      <input type="file" accept="image/*" @change="handleCoverChange" />

      <img
        v-if="coverPreview"
        :src="coverPreview"
        class="object-cover w-32 h-32 border rounded-lg"
      />
    </div>

    <!-- 音乐文件 -->
    <div class="space-y-2" v-if="!isEdit">
      <label class="text-sm font-medium">音乐文件</label>
      <input type="file" accept="audio/*" @change="handleAudioChange" />

      <div v-if="form.duration" class="text-sm text-gray-500">
        音频时长：{{ form.duration }} 秒
      </div>
    </div>

    <!-- 操作按钮 -->
    <div class="flex justify-end gap-3 pt-4">
      <button
        type="button"
        @click="$emit('cancel')"
        class="px-4 py-2 text-sm border rounded-lg"
      >
        取消
      </button>

      <button
        type="submit"
        class="px-5 py-2 text-sm text-white bg-blue-600 rounded-lg"
      >
        {{ isEdit ? "更新" : "提交" }}
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { useAlbumStore } from "@/store/music/album";
import { useArtistStore } from "@/store/music/artist";
import { SongForm, SongFormSubmit, SongListItem } from "@/types/music/song";
import { onBeforeUnmount, reactive, ref } from "vue";

const artistStore = useArtistStore();
const albumStore = useAlbumStore();

const artistList = computed(() => artistStore.artistList);
const albumList = computed(() => albumStore.albumList);

onMounted(() => {
  if (!artistStore.artistList.length) {
    artistStore.loadArtistList();
  }
  if (!albumStore.albumList.length) {
    albumStore.fetchAlbumList();
  }
});

const props = defineProps<{
  modelValue?: SongListItem;
  isEdit?: boolean;
}>();

const emit = defineEmits<{
  (e: "submit", payload: SongFormSubmit): void;
  (e: "cancel"): void;
}>();

const isEdit = props.isEdit ?? false;

/** 表单数据（ID 全 string） */
const form = reactive<SongForm>({
  id: props.modelValue?.id,
  title: props.modelValue?.title || "",
  artistId: props.modelValue?.artistId || "",
  albumId: props.modelValue?.albumId || "",
  releaseDate: props.modelValue?.releaseDate || "",
  duration: props.modelValue?.duration || 0,
  coverUrl: props.modelValue?.coverUrl,
  fileUrl: props.modelValue?.fileUrl,
});

const coverFile = ref<File | null>(null);
const audioFile = ref<File | null>(null);

const coverPreview = ref<string>(props.modelValue?.coverUrl || "");

/** 选择封面 */
const handleCoverChange = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (!file) return;

  coverFile.value = file;

  if (coverPreview.value) {
    URL.revokeObjectURL(coverPreview.value);
  }
  coverPreview.value = URL.createObjectURL(file);
};

/** 选择音频 + 解析时长 */
const handleAudioChange = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (!file) return;

  audioFile.value = file;

  const audio = new Audio(URL.createObjectURL(file));
  audio.onloadedmetadata = () => {
    form.duration = Math.floor(audio.duration);
    URL.revokeObjectURL(audio.src);
  };
};

/** 提交 */
const submitForm = async () => {
  const data: SongFormSubmit = {
    id: form.id,
    title: form.title,
    duration: form.duration,
    albumId: form.albumId,
    artistId: form.artistId,
    releaseDate: form.releaseDate,
    audioFile: audioFile.value,
    coverFile: coverFile.value,
  };
  emit("submit", data);
};

/** 释放 URL */
onBeforeUnmount(() => {
  if (coverPreview.value) {
    URL.revokeObjectURL(coverPreview.value);
  }
});
</script>
