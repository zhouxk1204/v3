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
        <template #coverImage="{ row }">
          <img :src="row.coverImage" class="object-cover w-12 h-12 rounded" />
        </template>

        <template #filePath="{ row }">
          <audio :src="row.filePath" controls class="w-40" />
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
import { computed, reactive, ref } from "vue";

import CrudModal from "@/components/CrudModal/index.vue";
import CrudPage from "@/components/CrudPage/index.vue";
import CrudTable from "@/components/CrudTable/index.vue";
import CrudToolbar from "@/components/CrudToolbar/index.vue";

import SongForm from "./SongForm.vue";
import SongSearch from "./SongSearch.vue";

import { addSongInfo, deleteSong, getSongList, updateSongInfo } from "@/api/music/song";

import type { SongAddInfo, SongSearchForm, SongTableData, SongUpdateInfo } from "@/types/music/song";

const searchForm = reactive<SongSearchForm>({
  title: "",
  artistId: "",
});

const tableData = ref<SongTableData[]>([]);
const selectedIds = ref<string[]>([]);

const showModal = ref(false);
const modalMode = ref<"add" | "edit">("add");
const currentRow = ref<SongTableData>();

const columns = [
  { title: "ID", key: "songId" },
  { title: "歌曲名称", key: "title" },
  { title: "歌手", key: "artistId" },
  { title: "专辑", key: "albumId" },
  // { title: "类型ID", key: "genreId" },
  { title: "封面", key: "coverImage" },
  { title: "时长(秒)", key: "duration" },
  { title: "发布日期", key: "releaseDate" },
  { title: "音频", key: "filePath" },
];

const modalTitle = computed(() =>
  modalMode.value === "add" ? "新增歌曲" : "编辑歌曲"
);

const fetchTableData = async () => {
  const res = await getSongList(searchForm);
  tableData.value = res.data;
  selectedIds.value = [];
};

fetchTableData();

const resetSearch = () => {
  searchForm.title = "";
  searchForm.artistId = "";
  fetchTableData();
};

const openAdd = () => {
  modalMode.value = "add";
  currentRow.value = undefined;
  showModal.value = true;
};

const openEdit = () => {
  currentRow.value =
    tableData.value.find((i) => i.songId === selectedIds.value[0]) ||
    undefined;
  modalMode.value = "edit";
  showModal.value = true;
};

const handleDelete = async () => {
  if (!selectedIds.value.length) return;
  if (!confirm("确认删除该歌曲？")) return;

  await deleteSong(selectedIds.value[0]);
  fetchTableData();
};

const handleSubmit = async (form: SongAddInfo | SongUpdateInfo) => {
  if (modalMode.value === "add") {
    await addSongInfo(form as SongAddInfo);
  } else {
    await updateSongInfo(form as SongUpdateInfo);
  }
  showModal.value = false;
  fetchTableData();
};
</script>
