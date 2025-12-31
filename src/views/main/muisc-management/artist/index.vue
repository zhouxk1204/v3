<template>
  <CrudPage>
    <!-- 搜索区 -->
    <template #search>
      <ArtistSearch
        v-model="artistQueryParams"
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
        row-key="id"
        :columns="columns"
        :data="tableData"
        v-model:selectedIds="selectedIds"
      >
        <template #avatarUrl="{ row }">
          <img
            :src="row.avatarUrl"
            class="object-cover w-12 h-12 rounded-full"
          />
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
import { computed, ref } from "vue";

import CrudModal from "@/components/CrudModal/index.vue";
import CrudPage from "@/components/CrudPage/index.vue";
import CrudTable from "@/components/CrudTable/index.vue";
import CrudToolbar from "@/components/CrudToolbar/index.vue";

import ArtistForm from "./ArtistForm.vue";
import ArtistSearch from "./ArtistSearch.vue";

import { useCos } from "@/hooks/useCos";
import { useArtistStore } from "@/store/music/artist";

import type {
  ArtistCreatePayload,
  ArtistFormSubmit,
  ArtistListItem,
  ArtistQueryParams,
  ArtistUpdatePayload,
} from "@/types/music/artist";

const artistStore = useArtistStore();

/** 查询参数 */
const artistQueryParams = ref<ArtistQueryParams>({
  name: "",
  country: "",
});

/** 表格数据 */
const tableData = computed(() => artistStore.artistList);

/** 选中行 */
const selectedIds = computed<string[]>({
  get: () => artistStore.selectedIds,
  set: (val) => (artistStore.selectedIds = val),
});

/** 弹窗状态 */
const showModal = ref(false);
const modalMode = ref<"add" | "edit">("add");
const currentRow = ref<ArtistListItem | undefined>();

/** 表格列 */
const columns = [
  { title: "头像", key: "avatarUrl", slot: "avatarUrl" },
  { title: "歌手", key: "name" },
  { title: "国籍", key: "country" },
  { title: "出生日期", key: "birthDate" },
];

const modalTitle = computed(() =>
  modalMode.value === "add" ? "新增歌手" : "编辑歌手"
);

/** 查询 */
const fetchTableData = async () => {
  await artistStore.loadArtistList(artistQueryParams.value);
};

fetchTableData();

/** 重置查询 */
const resetSearch = () => {
  artistQueryParams.value.name = "";
  artistQueryParams.value.country = "";
  fetchTableData();
};

/** 新增 */
const openAdd = () => {
  modalMode.value = "add";
  currentRow.value = undefined;
  showModal.value = true;
};

/** 编辑 */
const openEdit = () => {
  if (!selectedIds.value.length) return;
  currentRow.value = artistStore.getArtistById(selectedIds.value[0]);
  modalMode.value = "edit";
  showModal.value = true;
};

/** 删除 */
const handleDelete = async () => {
  if (!selectedIds.value.length) return;
  if (!confirm("确认删除该歌手？")) return;
  await artistStore.removeArtists(selectedIds.value);
};

/** COS 上传 */
const cos = useCos({
  bucket: "peach-1322235980",
  region: "ap-chengdu",
  prefix: "/artist/",
  stsUrl: "https://api.zhouxk.fun/sts",
});

/** 表单提交 */
const handleSubmit = async (
  form: ArtistFormSubmit
) => {
  // 新增
  if (modalMode.value === "add") {
    const {avatarUrl, ...rest} = form;

    if (avatarUrl instanceof File) {
      const res: any = await cos.upload({
        uploadBody: avatarUrl,
        type: avatarUrl.name.split(".").pop() || "jpg",
      });
      const url = `https://${res.Location}`;
      const artistCreatePayload: ArtistCreatePayload = {...rest, avatarUrl: url};
      await artistStore.addArtist(artistCreatePayload);
    }
  } else {
    await artistStore.editArtist(form as ArtistUpdatePayload);
  }

  showModal.value = false;
};
</script>
