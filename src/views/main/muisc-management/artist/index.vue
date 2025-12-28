<template>
  <CrudPage>
    <!-- 搜索区 -->
    <template #search>
      <ArtistSearch
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
        row-key="artistId"
        :columns="columns"
        :data="tableData"
        v-model:selectedIds="selectedIds"
      >
        <template #avatar="{ row }">
          <img :src="row.avatar" class="object-cover w-12 h-12 rounded-full" />
        </template>
      </CrudTable>
    </template>

    <!-- 弹窗 -->
    <template #modal>
      <CrudModal v-if="showModal" :title="modalTitle">
        <ArtistForm
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

import ArtistForm from "./ArtistForm.vue";
import ArtistSearch from "./ArtistSearch.vue";


import { useCos } from "@/hooks/useCos";
import { useArtistStore } from "@/store/music/artist";
import type {
  ArtistAddInfo,
  ArtistSearchForm,
  ArtistTableData,
  ArtistUpdateInfo,
} from "@/types/music/artist";

const artistStore = useArtistStore();
const searchForm = reactive<ArtistSearchForm>({
  name: "",
  country: "",
});

const tableData = computed(() => artistStore.artistList);
const selectedIds = computed({
  get: () => artistStore.selectedIds,
  set: (val) => (artistStore.selectedIds = val),
});

const showModal = ref(false);
const modalMode = ref<"add" | "edit">("add");
const currentRow = ref<ArtistTableData>();

  const columns = [
  { title: "歌手", key: "name" },
  { title: "国籍", key: "country" },
  { title: "头像", key: "avatar" },
  { title: "出生日期", key: "birthDate" },
];

const modalTitle = computed(() =>
  modalMode.value === "add" ? "新增歌手" : "编辑歌手"
);

const fetchTableData = async () => {
  artistStore.fetchArtistList(searchForm);
};

fetchTableData();

const resetSearch = () => {
  searchForm.name = "";
  searchForm.country = "";
  fetchTableData();
};

const openAdd = () => {
  modalMode.value = "add";
  currentRow.value = undefined;
  showModal.value = true;
};

const openEdit = () => {
  currentRow.value = artistStore.getArtistById(selectedIds.value[0]);
  modalMode.value = "edit";
  showModal.value = true;
};

const handleDelete = async () => {
  if (!selectedIds.value.length) return;
  if (!confirm("确认删除该歌手？")) return;
  await artistStore.removeArtist(selectedIds.value);
};

const cos = useCos({
  bucket: "peach-1322235980",
  region: "ap-chengdu",
  prefix: "/artist/",
  stsUrl: "https://api.zhouxk.fun/sts",
});

const handleSubmit = async (form: ArtistAddInfo | ArtistUpdateInfo) => {
  if (modalMode.value === "add") {
    const file = form.avatar as unknown as File;
    if (file) {
      const res: any = await cos.upload({
        uploadBody: file,
        type: file.name.split(".").pop() || "jpg",
      });
      form.avatar = `https://${res.Location}`;
    }
    await artistStore.addArtist(form as ArtistAddInfo);
  } else {
    await artistStore.updateArtist(form as ArtistUpdateInfo);
  }
  showModal.value = false;
};
</script>
