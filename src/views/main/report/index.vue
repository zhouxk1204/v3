<template>
  <div class="flex flex-col gap-5">
    <div class="hidden">
      <div class="mb-2">
        <el-button type="primary" :icon="Plus" @click="formVisible = true">添加岗位工分倍率特殊设定</el-button>
        <el-dialog v-model="formVisible" title="添加岗位工分倍率特殊设定" width="500" destroy-on-close :append-to-body="true"
          :close-on-click-modal="false">
          <Form :form="form" @submit="handelSubmit"></Form>
        </el-dialog>
      </div>
      <Table :list="dayRatioSettingList" :cols="dayRatioSettingCols" :editable="true" @remove="remove($event)"
        @update="update($event)"></Table>
    </div>

    <div>
      <div class="flex flex-wrap gap-3 mb-2">
        <UploadExcel @change="importData" sheetName="护士">
          <el-button type="primary" plain :icon="Upload">导入</el-button>
        </UploadExcel>
        <el-button-group>
          <el-button type="primary" plain :icon="Download" @click="exportData">导出</el-button>
          <el-button type="primary" plain :icon="Setting" @click="dialogTableVisible = true" />
        </el-button-group>


        <el-date-picker v-model="currentMonth" class="max-w-28" type="month" placeholder="选择汇算月份" format="YYYY/MM"
          value-format="YYYY/MM" @change="selectMonth" />

        <el-button-group>
          <el-button type="success" :icon="ArrowLeft" @click="changeMonth(-1)">上月</el-button>
          <el-button :disabled="isNextDisabled" type="success" @click="changeMonth(1)">
            下月<el-icon class="el-icon--right">
              <ArrowRight />
            </el-icon>
          </el-button>
        </el-button-group>

        <el-popconfirm width="220" title="确认清空工分汇算?" @confirm="onResetReport">
          <template #reference>
            <el-button size="default" plain :icon="Delete">清空</el-button>
          </template>
        </el-popconfirm>
      </div>

      <Table :list="reportList" :cols="reportCols" class="hidden-sm-and-down"></Table>

      <el-space :fill="true" wrap class="font-bold hidden-sm-and-up">
        <el-watermark v-for="item in reportList" :content="item.employeeName" :gap="[50, 50]">
          <el-card v-if="item.total > 0">
            <template #header>
              <div class="flex items-center justify-between">
                <h2 class="text-xl font-bold">{{ item.employeeName }}
                </h2>
                <p>系数：<span class="text-xl text-red-500">{{ item.factor }}</span></p>
              </div>
            </template>
            <div class="flex flex-col gap-2">
              <p>其他岗位工分：<el-tag type="primary" effect="dark">{{ item.totalOther }}</el-tag></p>
              <p>胃镜岗位工分：<el-tag type="danger" effect="dark">{{ item.totalGastroscopy }}</el-tag></p>
              <p>时间工分合计：<el-tag type="success" effect="dark">{{ item.total }}</el-tag></p>
              <p>本月上班天数：<span class="text-red-500">{{ item.workDayCount
                  }}&nbsp;天</span></p>
              <p v-if="item.leave > 0">本月补休天数：<el-text type="success" size="large">{{ item.leave
                  }}&nbsp;天</el-text></p>
              <p v-if="item.serve > 0">本月科务天数：<span class="text-purple-500" size="large">{{ item.serve
                  }}&nbsp;天</span></p>
            </div>
          </el-card>
        </el-watermark>
      </el-space>

      <div v-if="errorList.length > 0">
        <h2 class="my-2 font-bold">错误的工分记录</h2>
        <ul class="mt-2 ml-3 text-red-500">
          <li v-for="error in errorList">{{ error }}</li>
        </ul>
      </div>
    </div>

    <teleport to="body">
      <el-dialog v-model="dialogTableVisible" title="导出工分汇算表头设置" destroy-on-close align-center :width="dialogWidth"
        class="max-h-[80%] md:max-h-full overflow-auto">
        <el-checkbox-group v-model="checkList" class="flex flex-col w-full border-t border-ep">
          <div v-for="item of reportCols" class="px-2 border-b border-ep">
            <el-checkbox :label="item.label" :value="item.field" size="large" />
          </div>
        </el-checkbox-group>

        <div class="flex justify-between mt-5">
          <el-checkbox @change="toggleSelect" v-model="isCheckAll" label="全选 / 全不选" size="large" />
          <el-button type="primary" @click="saveAndExport">保存设置并导出</el-button>
        </div>
      </el-dialog>
    </teleport>
  </div>
</template>

<script setup lang="ts">
import { getRecordList, updateRecords } from "@/api/report.api";
import { FieldItem } from "@/components/Form/form";
import { DayRatioSettingForm } from "@/config/form.config";
import { DayRatioSettingTable, ReportTable } from "@/config/table.config";
import useDate from "@/hooks/useDate";
import { ExportExcelOption, useExcel } from "@/hooks/useExcel";
import { useReport } from "@/hooks/useReport";
import useStore from "@/store";
import { Record, Report } from "@/types/report";
import { generateId } from "@/utils";
import { getYearMonthFromDate, parseExcelDateNumber, parseMonthDayTextDate } from "@/utils/date";
import { fullToHalf, trim } from "@/utils/string";
import { ArrowLeft, ArrowRight, Delete, Download, Plus, Setting, Upload } from '@element-plus/icons-vue';
import dayjs from "dayjs";
import _ from "lodash";
import { storeToRefs } from "pinia";

const formVisible = ref<boolean>(false);

// 弹窗宽度
const dialogWidth = ref('90%');
const updateDialogWidth = () => {
  dialogWidth.value = window.innerWidth < 768 ? '90%' : '50%';
};

onMounted(() => {
  updateDialogWidth();
  window.addEventListener('resize', updateDialogWidth);
});

onUnmounted(() => {
  window.removeEventListener('resize', updateDialogWidth);
});
// 弹窗宽度

// 岗位工分倍率特殊设定
const dayRatioSettingCols = DayRatioSettingTable;
const store = useStore().dayRatioSetting;
const { list: dayRatioSettingList } = storeToRefs(store);
const { insert, remove, update } = store;

const form = ref<FieldItem[]>(DayRatioSettingForm);
const handelSubmit = (data: any) => {
  data.id = generateId();
  insert(data);
};

// 月次工分汇算
const reportCols = ReportTable;

const reportList = ref<Report[]>([]);
const errorList = ref<string[]>([]);
const reportDate = ref<string>("");

const originData = ref<Record[]>([]);
const initReport = async (list: Record[][], showSuccess: boolean = true) => {
  if (list.length > 0) {
    getValidateData(list);
    const { reports, errors, currentDate } = await useReport(list);
    reportList.value = reports;
    errorList.value = errors;
    reportDate.value = currentDate;
    if (errorList.value.length > 0) {
      ElMessage.error("存在错误的工分记录，请及时检查修正！");
    } else {
      if (showSuccess) {
        ElMessage.success("工分汇算成功🎉🎉🎉");
      }
    }
  }
};

// 导入
const importData = (data: any[]) => {
  if (data.length === 0) return;

  let header: any = {};
  const map: Map<string, Record[]> = new Map();
  data.forEach((item) => {
    const employeeName = item["__EMPTY"];
    if (!employeeName) {
      // 表头日期行
      header = item;
    } else {
      const dailyRecordList = map.get(employeeName) ?? [];
      const items = Object.keys(item).filter((e) => e !== "__EMPTY");
      const l = items.map((e2) => {
        const date =
          Object.keys(header).length === 0
            ? parseMonthDayTextDate(e2)
            : parseExcelDateNumber(header[e2] as number);

        return {
          date,
          record: trim(fullToHalf(item[e2].toString())), // 去掉空格和大写转小写
          employeeName,
        };
      });
      dailyRecordList.push(...l);
      map.set(employeeName, dailyRecordList);
    }
  });
  const list = Array.from(map.values());
  originData.value = list.flat();

  initReport(list);
};

// 导出
const exportData = async () => {
  const sheetName = dayjs(reportDate.value).format("YYYY年MM月");
  const fileName = `${sheetName}上班（加班）工分汇算`;


  const data = reportList.value.map(item => {
    return checkList.value.map(key => item[key as keyof Report]);
  });

  const exportExcelOptions: ExportExcelOption[] = [
    {
      title: fileName,
      headers: exportHeaders.value,
      data,
      remark: "时间总工分 = 其他岗位总工分 + 胃2岗位总工分 * 1.2",
    },
  ];
  useExcel().exportExcel(exportExcelOptions, fileName);
  if (originData.value.length > 0) {
    await updateRecords(originData.value);
  }
  ElMessage.success("工分汇算结果导出成功🎉🎉🎉");
};

const onResetReport = () => {
  reportList.value = [];
  errorList.value = [];
  reportDate.value = "";
  currentMonth.value = "";
};

const dialogTableVisible = ref<boolean>(false);

const checkList = ref<(keyof Report)[]>([]);
const local = localStorage.getItem('exportHeaders');
if (local) {
  checkList.value = JSON.parse(local);
} else {
  checkList.value = reportCols.map(e => e.field);
}

const exportHeaders = computed(() => {
  return reportCols.filter(e => checkList.value.includes(e.field)).map((e) => e.label);
});

const saveAndExport = () => {
  if (checkList.value.length === 0) {
    ElMessage.error("请至少选择一项");
  } else {
    localStorage.setItem('exportHeaders', JSON.stringify(checkList.value));
    dialogTableVisible.value = false;
    exportData();
  }
}

const isCheckAll = ref(false);
const toggleSelect = () => {
  if (checkList.value.length === 0) {
    checkList.value = reportCols.map(e => e.field);
    isCheckAll.value = true;
  } else {
    checkList.value = [];
    isCheckAll.value = false;
  }
}

// 月份切换操作
let offsetTemp = 1;
const currentMonth = ref(getYearMonthFromDate(offsetTemp * -1));
// 选择月份
const selectMonth = async (value: string | undefined) => {
  if (!value) {
    reportList.value = [];
    return;
  }
  const res = await getRecordList(value);
  const { data } = res;
  const groupedData = _.groupBy(data, 'employeeName');
  if (data.length === 0) {
    reportList.value = [];
    offsetTemp += 1;
    currentMonth.value = getYearMonthFromDate(offsetTemp * -1)
    selectMonth(currentMonth.value)
    ElMessage.warning(`未查询到${value}的工分汇算结果，目前已切换到${currentMonth.value}的工分汇算结果`);
  } else {
    const result = Object.values(groupedData);
    initReport(result, false);
  }
}
// 切换月份
const changeMonth = (offset: number) => {
  if (!currentMonth.value || currentMonth.value.length === 0) {
    currentMonth.value = getYearMonthFromDate(-1);
  }
  if (offset > 0) {
    const now = dayjs().add(offsetTemp * -1, 'month').format('YYYY/MM');
    if (currentMonth.value === now) {
      return;
    }
  }
  const date = dayjs(currentMonth.value).add(offset, 'month').format('YYYY/MM');
  currentMonth.value = date
  selectMonth(date);
};

const isNextDisabled = computed(() => {
  return currentMonth.value === dayjs().add(offsetTemp * -1, 'month').format('YYYY/MM');
})

selectMonth(currentMonth.value);

const getValidateData = async (list: Record[][]) => {
  await useDate(currentMonth.value, 1, list)
}


</script>