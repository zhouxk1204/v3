<template>
  <CrudPage>
    <!-- 搜索 -->
    <template #search>
      <SongSearch
        v-model="searchForm"
        @search="fetchTableData"
        @reset="resetSearch"
      />
    </template>

    <!-- 工具栏 -->
    <template #toolbar>
      <CrudToolbar
        :selectedIds="selectedIds"
        @add="openAdd"
        @edit="openEdit"
        @delete="handleDelete"
      />
    </template>

    <!-- 表格 -->
    <template #table>
      <CrudTable
        row-key="songId"
        :columns="columns"
        :data="tableData"
        v-model:selectedIds="selectedIds"
      >
        <template #coverUrl="{ row }">
          <img :src="row.coverUrl" class="object-cover w-12 h-12 rounded" />
        </template>

        <template #fileUrl="{ row }">
          <audio :src="row.fileUrl" controls class="w-60" />
        </template>
      </CrudTable>
    </template>

    <!-- 弹窗 -->
    <template #modal>
      <CrudModal v-if="showModal" :title="modalTitle">
        <SongForm
          :isEdit="modalMode === 'edit'"
          :modelValue="currentRow"
          @submit="handleSubmit"
          @cancel="showModal = false"
        />
      </CrudModal>
    </template>
  </CrudPage>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";

import CrudModal from "@/components/CrudModal/index.vue";
import CrudPage from "@/components/CrudPage/index.vue";
import CrudTable from "@/components/CrudTable/index.vue";
import CrudToolbar from "@/components/CrudToolbar/index.vue";

import SongForm from "./SongForm.vue";
import SongSearch from "./SongSearch.vue";

import {
    createSong,
    deleteSongs,
    querySongList,
    updateSong,
} from "@/api/music/song";
import { useCos } from "@/hooks/useCos";
import type {
    SongCreatePayload,
    SongFormSubmit,
    SongListItem,
    SongQueryParams,
    SongUpdatePayload,
} from "@/types/music/song";
import { buildCosUrlsInArray } from "@/utils/cos";

const searchForm = ref<SongQueryParams>({
  title: "",
  artistId: "",
});

const tableData = ref<SongListItem[]>([]);
const selectedIds = ref<string[]>([]);

const showModal = ref(false);
const modalMode = ref<"add" | "edit">("add");
const currentRow = ref<SongListItem>();

const columns = [
  { title: "封面", key: "coverUrl" },
  { title: "歌曲名称", key: "title" },
  { title: "歌手", key: "artistName" },
  { title: "发布日期", key: "releaseDate" },
  { title: "音频", key: "fileUrl" },
];

const modalTitle = computed(() =>
  modalMode.value === "add" ? "新增歌曲" : "编辑歌曲",
);

const fetchTableData = async () => {
  const res = await querySongList(searchForm.value);
  // 多个字段
  const songs = buildCosUrlsInArray(res.data, ["coverUrl", "fileUrl"]);
  tableData.value = songs;
  selectedIds.value = [];
};

const resetSearch = () => {
  searchForm.value.title = "";
  searchForm.value.artistId = "";
  fetchTableData();
};

const openAdd = () => {
  modalMode.value = "add";
  currentRow.value = undefined;
  showModal.value = true;
};

const openEdit = () => {
  currentRow.value = tableData.value.find((i) => i.id === selectedIds.value[0]);
  modalMode.value = "edit";
  showModal.value = true;
};

const handleDelete = async () => {
  if (!selectedIds.value.length) return;
  if (!confirm("确认删除该歌曲？")) return;

  await deleteSongs(selectedIds.value);
  fetchTableData();
};

const cos = useCos({
  bucket: "peach-1322235980",
  region: "ap-chengdu",
  prefix: "/song/",
  stsUrl: import.meta.env.APP_COS_STS_URL,
});
const handleSubmit = async (form: SongFormSubmit) => {
  if (modalMode.value === "add") {
    const songCreatePayload: SongCreatePayload = {
      title: form.title,
      duration: form.duration,
      albumId: form.albumId,
      artistId: form.artistId,
      genreId: form.genreId,
      releaseDate: form.releaseDate,
      fileUrl: "",
      coverUrl: "",
      createdBy: "",
    };
    const { audioFile, coverFile } = form;

    if (audioFile) {
      const res: any = await cos.upload({
        uploadBody: audioFile,
        type: audioFile.name.split(".").pop() || "mp3",
      });
      songCreatePayload.fileUrl = `https://${res.Location}`;
    }
    if (coverFile) {
      const res: any = await cos.upload({
        uploadBody: coverFile,
        type: coverFile.name.split(".").pop() || "jpg",
      });
      songCreatePayload.coverUrl = `https://${res.Location}`;
    }

    await createSong(songCreatePayload);
  } else {
    const songUpdatePayload: SongUpdatePayload = {
      id: form.id ?? "",
      title: form.title,
      duration: form.duration,
      albumId: form.albumId,
      artistId: form.artistId,
      genreId: form.genreId,
      releaseDate: form.releaseDate,
      fileUrl: "",
      coverUrl: "",
    };

    await updateSong(songUpdatePayload);
  }

  showModal.value = false;
  fetchTableData();
};

fetchTableData();
</script>
