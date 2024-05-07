<template>
  <el-form :inline="true" :model="form" class="mb-2" v-if="visible">
    <el-form-item label="字典名称">
      <el-select v-model="form.dictId" placeholder="字典名称" clearable class="min-w-36">
        <el-option :label="item.dictName" :value="item.dictId" v-for="item in dictTypeList" />
      </el-select>
    </el-form-item>
    <el-form-item label="字典标签">
      <el-input v-model="form.dictLabel" placeholder="请输入字典标签" clearable />
    </el-form-item>
    <el-form-item label="状态">
      <el-select v-model="form.status" placeholder="状态" clearable class="min-w-36">
        <el-option label="正常" value="0" />
        <el-option label="停用" value="1" />
      </el-select>
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="handleSearch" :icon="Search">搜索</el-button>
    </el-form-item>
    <el-form-item>
      <el-button @click="handleReset" :icon="Refresh">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang='ts'>
import { getDictTypeList } from "@/api/dict.api";
import { DictDetailSearchForm, DictVO } from "@/types/dict";
import { Refresh, Search } from "@element-plus/icons-vue";

const props = defineProps<{
  visible: boolean,
  dictId: number,
}>();

const emit = defineEmits<{
  (e: "search", data: DictDetailSearchForm): void;
  (e: "reset", data: null): void;
  (e: "dictType", data: String): void;
}>();

const form = reactive<DictDetailSearchForm>({
  dictId: props.dictId,
  dictLabel: '',
  status: '',
})

const handleSearch = () => {
  emit("dictType", dictType.value);
  emit("search", form);
}

const handleReset = () => {
  form.dictId = -1;
  form.dictLabel = '';
  form.status = '';
  emit("reset", null);
}

const dictTypeList = ref<DictVO[]>([])
const getAllDictTypeList = () => {
  getDictTypeList().then(res => {
    dictTypeList.value = res.data;
    console.log("%c Line:65 🥥 dictTypeList.value", "color:#2eafb0", dictTypeList.value);
    emit("dictType", dictType.value);
  });
}
getAllDictTypeList();

const dictType = computed(() => dictTypeList.value.find(el => el.dictId == form.dictId)?.dictType ?? '');

</script>