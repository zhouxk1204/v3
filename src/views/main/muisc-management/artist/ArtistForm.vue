<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <!-- 歌手名称 -->
    <div class="space-y-1">
      <label class="text-sm font-medium text-gray-700">歌手名称</label>
      <input
        v-model="form.name"
        required
        type="text"
        class="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500"
      />
    </div>

    <!-- 国家 -->
    <div class="space-y-1">
      <label class="text-sm font-medium text-gray-700">国家</label>
      <input
        v-model="form.country"
        type="text"
        class="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500"
      />
    </div>

    <!-- 出生日期 -->
    <div class="space-y-1">
      <label class="text-sm font-medium text-gray-700">出生日期</label>
      <input
        v-model="form.birthDate"
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
  ArtistFormSubmit,
  ArtistListItem
} from "@/types/music/artist";
import { computed, onBeforeUnmount, reactive, ref } from "vue";

/**
 * UI 表单模型（只服务于表单）
 */
interface ArtistFormModel {
  id?: string;
  name: string;
  country?: string;
  birthDate?: string;
  avatarUrl?: string | File;
}

const props = defineProps<{
  modelValue?: ArtistListItem;
  isEdit?: boolean;
}>();

const emit = defineEmits<{
  (e: "submit", payload: ArtistFormSubmit): void;
  (e: "cancel"): void;
}>();

const isEdit = computed(() => props.isEdit ?? false);

/** 本地表单状态 */
const form = reactive<ArtistFormModel>({
  id: props.modelValue?.id,
  name: props.modelValue?.name || "",
  country: props.modelValue?.country,
  birthDate: props.modelValue?.birthDate,
  avatarUrl: props.modelValue?.avatarUrl,
});

/** 头像预览 */
const previewUrl = ref<string | undefined>(
  typeof form.avatarUrl === "string" ? form.avatarUrl : undefined
);

const handleAvatarChange = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (!file) return;

  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value);
  }

  form.avatarUrl = file;
  previewUrl.value = URL.createObjectURL(file);
};

const handleSubmit = () => {
  if (isEdit.value) {
    emit("submit", {
      id: form.id!,
      name: form.name,
      country: form.country,
      birthDate: form.birthDate,
      avatarUrl: form.avatarUrl,
    });
  } else {
    emit("submit", {
      name: form.name,
      country: form.country,
      birthDate: form.birthDate,
      avatarUrl: form.avatarUrl,
    });
  }
};

onBeforeUnmount(() => {
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value);
  }
});
</script>
