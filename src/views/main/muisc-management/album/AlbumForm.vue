<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <!-- 专辑名称 -->
    <div class="space-y-1">
      <label class="text-sm font-medium text-gray-700">专辑名称</label>
      <input
        v-model="localForm.title"
        type="text"
        required
        placeholder="请输入专辑名称"
        class="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500"
      />
    </div>

    <!-- 主歌手ID -->
    <div class="space-y-1">
      <label class="text-sm font-medium text-gray-700">主歌手ID</label>
      <input
        v-model.number="localForm.artistId"
        type="number"
        required
        placeholder="请输入歌手 ID"
        class="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500"
      />
    </div>

    <!-- 发布日期 -->
    <div class="space-y-1">
      <label class="text-sm font-medium text-gray-700">发布日期</label>
      <input
        v-model="localForm.releaseDate"
        type="date"
        class="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500"
      />
    </div>

    <!-- 专辑封面 -->
    <div class="space-y-2">
      <label class="text-sm font-medium text-gray-700">专辑封面</label>
      <input
        type="file"
        accept="image/*"
        @change="handleCoverChange"
        class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100"
      />
      <img
        v-if="previewUrl"
        :src="previewUrl"
        class="object-cover w-32 h-32 mt-2 border rounded-lg"
      />
    </div>

    <!-- 专辑简介 -->
    <!-- <div class="space-y-1">
      <label class="text-sm font-medium text-gray-700">专辑简介</label>
      <textarea
        v-model="localForm.description"
        rows="4"
        placeholder="请输入专辑简介"
        class="w-full px-3 py-2 text-sm border rounded-lg resize-none focus:ring-2 focus:ring-blue-500"
      />
    </div> -->

    <!-- 操作按钮 -->
    <div class="flex justify-end gap-3 pt-4">
      <button
        type="button"
        @click="$emit('cancel')"
        class="px-4 py-2 text-sm text-gray-600 border rounded-lg hover:bg-gray-100"
      >
        取消
      </button>
      <button
        type="submit"
        class="px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
      >
        {{ isEdit ? '更新' : '提交' }}
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import type { AlbumAddInfo, AlbumUpdateInfo } from "@/types/music/album";
import { onBeforeUnmount, reactive, ref } from "vue";

interface AlbumFormProps {
  modelValue?: AlbumUpdateInfo; // 编辑时传入
  isEdit?: boolean;
}

const props = defineProps<AlbumFormProps>();
const emit = defineEmits<{
  (e: "submit", payload: AlbumAddInfo | AlbumUpdateInfo): void;
  (e: "cancel"): void;
}>();

const localForm = reactive<AlbumUpdateInfo | AlbumAddInfo>({
  title: props.modelValue?.title || "",
  artistId: props.modelValue?.artistId || -1,
  releaseDate: props.modelValue?.releaseDate || "",
  coverImage: props.modelValue?.coverImage || "",
  albumId: props.modelValue?.albumId ?? -1,
});

const isEdit = props.isEdit ?? false;

const previewUrl = ref(localForm.coverImage || "");

/** 选择封面 */
const handleCoverChange = (e: Event) => {
  const input = e.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;

  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value);
  }

  localForm.coverImage = file as unknown as string;
  previewUrl.value = URL.createObjectURL(file);
};

/** 提交 */
const handleSubmit = () => {
  if (!localForm.artistId) {
    alert("请输入主歌手 ID");
    return;
  }

  emit("submit", localForm);
};

/** 卸载释放 URL */
onBeforeUnmount(() => {
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value);
  }
});
</script>
