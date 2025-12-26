<template>
  <form class="song-form" @submit.prevent="submitForm">
    <!-- 歌曲名称 -->
    <div class="form-item">
      <label>歌曲名称</label>
      <input v-model="form.title" type="text" required />
    </div>

    <!-- 主歌手ID -->
    <div class="form-item">
      <label>主歌手ID</label>
      <input v-model="form.artist_id" type="number" required />
    </div>

    <!-- 专辑ID -->
    <div class="form-item">
      <label>所属专辑ID</label>
      <input v-model="form.album_id" type="number" />
    </div>

    <!-- 音乐类型ID -->
    <div class="form-item">
      <label>音乐类型ID</label>
      <input v-model="form.genre_id" type="number" />
    </div>

    <!-- 发布日期 -->
    <div class="form-item">
      <label>发布日期</label>
      <input v-model="form.release_date" type="date" />
    </div>

    <!-- 歌曲封面 -->
    <div class="form-item">
      <label>歌曲封面</label>
      <input type="file" accept="image/*" @change="handleCoverChange" />
      <img
        v-if="coverPreview"
        :src="coverPreview"
        class="preview"
        alt="歌曲封面预览"
      />
    </div>

    <!-- 音乐文件 -->
    <div class="form-item">
      <label>音乐文件</label>
      <input type="file" accept="audio/*" @change="handleAudioChange" />
    </div>

    <div class="form-actions">
      <button type="submit">提交</button>
      <button type="reset" @click="resetForm">重置</button>
    </div>
  </form>
</template>

<script setup>
import { useCos } from "@/hooks/useCos";
import { reactive, ref } from "vue";

const form = reactive({
  title: "",
  artist_id: "",
  album_id: "",
  genre_id: "",
  release_date: "",
  duration: 0,
  audioFile: null,
  coverFile: null
});

const coverPreview = ref("");

const handleCoverChange = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  form.coverFile = file;
  coverPreview.value = URL.createObjectURL(file);
};

const handleAudioChange = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  form.audioFile = file;

  // 获取音频时长（秒）
  const audio = new Audio(URL.createObjectURL(file));
  audio.onloadedmetadata = () => {
    form.duration = Math.floor(audio.duration);
  };
};

const submitForm = async () => {
  const formData = new FormData();
  formData.append("title", form.title);
  formData.append("artist_id", form.artist_id);
  formData.append("album_id", form.album_id);
  formData.append("genre_id", form.genre_id);
  formData.append("release_date", form.release_date);
  formData.append("duration", form.duration);

  const cos = useCos({
    bucket: "peach-1322235980",
    region: "ap-chengdu",
    prefix: "/song/",
    stsUrl: "https://api.zhouxk.fun/sts",
  });

  // 上传封面
  if (form.coverFile) {
    const coverType = form.coverFile.name.split(".").pop();
    const coverRes = await cos.upload({
      uploadBody: form.coverFile,
      type: coverType,
    });
    formData.append("cover_image", `https://${coverRes.Location}`);
  }

  // 上传音频
  if (form.audioFile) {
    const audioType = form.audioFile.name.split(".").pop();
    const audioRes = await cos.upload({
      uploadBody: form.audioFile,
      type: audioType,
    });
    formData.append("file_path", `https://${audioRes.Location}`);
  }

  console.log("提交歌曲", formData);
};

const resetForm = () => {
  coverPreview.value = "";
  Object.assign(form, {
    title: "",
    artist_id: "",
    album_id: "",
    genre_id: "",
    release_date: "",
    duration: 0,
    audioFile: null,
    coverFile: null
  });
};
</script>
