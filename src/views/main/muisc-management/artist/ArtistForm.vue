<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <!-- 歌手名称 -->
    <div class="space-y-1">
      <label class="text-sm font-medium text-gray-700">歌手名称</label>
      <input
        v-model="localForm.name"
        required
        type="text"
        class="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500"
      />
    </div>

    <!-- 国家 -->
    <div class="space-y-1">
      <label class="text-sm font-medium text-gray-700">国家</label>
      <input
        v-model="localForm.country"
        type="text"
        class="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500"
      />
    </div>

    <!-- 出生日期 -->
    <div class="space-y-1">
      <label class="text-sm font-medium text-gray-700">出生日期</label>
      <input
        v-model="localForm.birthDate"
        type="date"
        class="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500"
      />
    </div>

    <!-- 头像 -->
    <div class="space-y-2">
      <label class="text-sm font-medium text-gray-700">头像</label>
      <input type="file" accept="image/*" @change="handleAvatarChange" />
      <img
        v-if="previewUrl"
        :src="previewUrl"
        class="object-cover w-24 h-24 rounded-full"
      />
    </div>

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
        {{ isEdit ? "更新" : "提交" }}
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import type {
  ArtistAddInfo,
  ArtistTableData,
  ArtistUpdateInfo,
} from "@/types/music/artist";
import { onBeforeUnmount, reactive, ref } from "vue";

const props = defineProps<{
  modelValue?: ArtistTableData;
  isEdit?: boolean;
}>();

const emit = defineEmits<{
  (e: "submit", payload: ArtistAddInfo | ArtistUpdateInfo): void;
  (e: "cancel"): void;
}>();

const localForm = reactive<ArtistAddInfo | ArtistUpdateInfo>({
  name: props.modelValue?.name || "",
  country: props.modelValue?.country || "",
  birthDate: props.modelValue?.birthDate || "",
  avatar: props.modelValue?.avatar || "",
  ...(props.modelValue?.artistId
    ? { artistId: props.modelValue.artistId }
    : {}),
});

const isEdit = props.isEdit ?? false;
const previewUrl = ref(localForm.avatar || "");

const handleAvatarChange = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (!file) return;

  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value);
  }

  localForm.avatar = file as unknown as string;
  previewUrl.value = URL.createObjectURL(file);
};

const handleSubmit = () => {
  emit("submit", localForm);
};

onBeforeUnmount(() => {
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value);
  }
});
</script>
