<template>
  <form class="artist-form" @submit.prevent="submitForm">
    <!-- 歌手姓名 -->
    <div class="form-item">
      <label>歌手姓名</label>
      <input
        v-model="form.name"
        type="text"
        placeholder="请输入歌手姓名"
        required
      />
    </div>

    <!-- 国家/地区 -->
    <div class="form-item">
      <label>国家 / 地区</label>
      <input v-model="form.country" type="text" placeholder="如：中国、美国" />
    </div>

    <!-- 出生日期 -->
    <div class="form-item">
      <label>出生日期</label>
      <input v-model="form.birthDate" type="date" />
    </div>

    <!-- 歌手图片 -->
    <div class="form-item">
      <label>歌手图片</label>
      <input type="file" accept="image/*" @change="handleFileChange" />
      <img v-if="previewUrl" :src="previewUrl" class="preview" alt="预览图" />
    </div>

    <!-- 歌手简介 -->
    <div class="form-item">
      <label>歌手简介</label>
      <textarea
        v-model="form.bio"
        placeholder="请输入歌手简介"
        rows="4"
      ></textarea>
    </div>

    <!-- 操作按钮 -->
    <div class="form-actions">
      <button type="submit">提交</button>
      <button type="reset" @click="resetForm">重置</button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { addArtistInfo, getArtistList } from "@/api/music/artist";
import { useCos } from "@/hooks/useCos";
import type { ArtistAddInfo } from "@/types/music/artist";
import { onBeforeUnmount, reactive, ref } from "vue";

interface ArtistForm {
  name: string;
  country: string;
  birthDate: string;
  bio: string;
  image: File | null;
}

const form = reactive<ArtistForm>({
  name: "",
  country: "",
  birthDate: "",
  bio: "",
  image: null,
});

const previewUrl = ref<string>("");

/** 获取列表（示例） */
getArtistList().then((res) => {
  console.log(res);
});

/** 选择图片 */
const handleFileChange = (e: Event) => {
  const input = e.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;

  // 释放旧的 URL，防止内存泄漏
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value);
  }

  form.image = file;
  previewUrl.value = URL.createObjectURL(file);
};

/** 提交表单 */
const submitForm = async () => {
  if (!form.image) {
    alert("请上传歌手图片");
    return;
  }

  const artistAddInfo: ArtistAddInfo = {
    name: form.name,
    country: form.country,
    birth_date: form.birthDate,
    bio: form.bio,
    avatar: "",
  };

  // 更安全的获取文件后缀
  const ext = form.image.name.split(".").pop() || "jpg";

  const cos = useCos({
    bucket: "peach-1322235980",
    region: "ap-chengdu",
    prefix: "/artist/",
    stsUrl: "https://api.zhouxk.fun/sts",
  });

  try {
    const data = await cos.upload({
      uploadBody: form.image,
      type: ext,
    }) as unknown as { Location: string };

    artistAddInfo.avatar = `https://${data.Location}`;

    await addArtistInfo(artistAddInfo);

    console.log("提交成功", artistAddInfo);
    resetForm();
  } catch (err) {
    console.error("提交失败", err);
  }
};

/** 重置 */
const resetForm = () => {
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value);
  }

  previewUrl.value = "";
  Object.assign(form, {
    name: "",
    country: "",
    birthDate: "",
    bio: "",
    image: null,
  });
};

/** 组件卸载时释放 URL */
onBeforeUnmount(() => {
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value);
  }
});
</script>
