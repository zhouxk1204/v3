<template>
  <CrudPage>
    <!-- 搜索区 -->
    <template #search>
      <AlbumSearch
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
        row-key="albumId"
        :columns="columns"
        :data="tableData"
        v-model:selectedIds="selectedIds"
      >
        <template #coverImage="{ row }">
          <img :src="row.coverImage" class="w-12 h-12 rounded" />
        </template>
      </CrudTable>
    </template>

    <!-- 弹窗 -->
    <template #modal>
      <CrudModal
        v-if="showModal"
        :title="modalTitle"
      >
        <AlbumForm
          :mode="modalMode"
          :data="currentRow"
          @success="handleSuccess"
          @cancel="showModal = false"
        />
      </CrudModal>
    </template>
  </CrudPage>
</template>

<script setup lang="ts">
import CrudModal from "@/components/CrudModal/index.vue";
import CrudPage from "@/components/CrudPage/index.vue";
import CrudTable from "@/components/CrudTable/index.vue";
import CrudToolbar from "@/components/CrudToolbar/index.vue";
import { computed, reactive, ref } from "vue";
import AlbumForm from "./AlbumForm.vue";
import AlbumSearch from "./AlbumSearch.vue";

import { deleteAlbum, getAlbumList } from "@/api/music/album";
import type { AlbumSearchForm, AlbumTableData } from "@/types/music/album";

const searchForm = reactive<AlbumSearchForm>({
  title: "",
  artistId: undefined,
});

const tableData = ref<AlbumTableData[]>([]);
const selectedIds = ref<number[]>([]);

const showModal = ref(false);
const modalMode = ref<"add" | "edit">("add");
const currentRow = ref<AlbumTableData | null>(null);

const columns = [
  { title: "ID", key: "albumId" },
  { title: "专辑名称", key: "title" },
  { title: "歌手ID", key: "artistId" },
  { title: "封面", key: "coverImage" },
  { title: "发布日期", key: "releaseDate" },
];

const modalTitle = computed(() =>
  modalMode.value === "add" ? "新增专辑" : "编辑专辑"
);

const fetchTableData = async () => {
  const res = await getAlbumList(searchForm);
  tableData.value = res.data;
  selectedIds.value = [];
};

fetchTableData();

const resetSearch = () => {
  searchForm.title = "";
  searchForm.artistId = undefined;
  fetchTableData();
};

const openAdd = () => {
  modalMode.value = "add";
  currentRow.value = null;
  showModal.value = true;
};

const openEdit = () => {
  currentRow.value =
    tableData.value.find(i => i.albumId === selectedIds.value[0]) || null;
  modalMode.value = "edit";
  showModal.value = true;
};

const handleDelete = async () => {
  if (!confirm("确认删除？")) return;
  await deleteAlbum(selectedIds.value);
  fetchTableData();
};

const handleSuccess = () => {
  showModal.value = false;
  fetchTableData();
};
</script>
