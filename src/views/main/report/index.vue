<template>
  <div class="flex flex-col gap-5">
    <div>
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
      <div class="flex gap-3 mb-2">
        <el-date-picker v-model="calcMonth" type="month" placeholder="选择汇算月份" format="YYYY/MM" value-format="YYYY/MM"
          @change="onCalcMonthChange" />

        <UploadExcel @change="onImport" sheetName="护士" class="ml-auto">
          <el-button type="primary" :icon="Upload">导入</el-button>
        </UploadExcel>
        <el-button-group>
          <el-button type="primary" :icon="Download" @click="onExport">导出</el-button>
          <el-button type="primary" :icon="Setting" @click="dialogTableVisible = true" />
        </el-button-group>
        <el-dialog v-model="dialogTableVisible" title="导出表头项目设置">
          <el-checkbox-group v-model="checkList" class="flex flex-col border-t">
            <div v-for="item of reportCols" class="px-2 border-b hover:bg-gray-200">
              <el-checkbox :label="item.label" :value="item.field" size="large" />
            </div>
          </el-checkbox-group>

          <div class="flex justify-end mt-5">
            <el-button @click="toggleSelect">{{ checkList.length === 0 ? '全选' : '全不选' }}</el-button>
            <el-button type="primary" @click="onConfirmHeader">确认</el-button>
          </div>

        </el-dialog>

        <el-popconfirm width="220" title="确认清空工分汇算?" @confirm="onResetReport">
          <template #reference>
            <el-button type="danger">清空</el-button>
          </template>
        </el-popconfirm>

      </div>

      <Table :list="reportList" :cols="reportCols" class="max-[450px]:hidden"></Table>

      <div class="hidden max-[450px]:flex max-[450px]:flex-col max-[450px]:gap-1 mt-3">
        <div class="p-2 border rounded-md" v-for="item in reportList">
          <div class="flex items-center gap-2">
            <el-avatar :size="42" class="flex-none" shape="square">
              <span class="text-xs">{{ item.employeeName }}</span>
            </el-avatar>
            <div class="flex flex-wrap gap-1">
              <el-tag effect="dark" type="warning" size="small">{{ item.factor }}</el-tag>
              <el-tag effect="dark" size="small" type="info">手术{{ item.totalOther }}</el-tag>
              <el-tag effect="dark" size="small" type="info" v-if="item.totalGastroscopy > 0">胃镜{{
          item.totalGastroscopy
        }}</el-tag>
              <el-tag effect="dark" size="small" type="danger">时间{{ item.total }}</el-tag>
              <el-tag effect="dark" size="small" type="success">出勤{{ item.workDayCount }}天</el-tag>
              <el-tag effect="dark" type="success" size="small" v-if="item.annual > 0">年休{{ item.annual }}天</el-tag>
              <el-tag effect="dark" type="success" size="small" v-if="item.leave > 0">休假{{ item.leave }}天</el-tag>
              <el-tag effect="dark" size="small" v-if="item.serve > 0">科务{{ item.serve }}天</el-tag>
            </div>
          </div>
        </div>
      </div>
      <div v-if="errorList.length > 0">
        <h2 class="my-2 font-bold">错误的工分记录</h2>
        <ul class="mt-2 ml-3 text-red-500">
          <li v-for="error in errorList">{{ error }}</li>
        </ul>
      </div>
    </div>
  </div>

  <el-dialog v-model="dialogVisible" title="提示" center :showClose="false" :lose-on-click-modal="false"
    :close-on-press-escape="false">
    <div class="font-bold text-center">
      您还没有添加员工信息，请添加员工信息后重试！
    </div>

    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="onDialogConfirm"> 确认 </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { getRecordList, updateRecords } from "@/api/report.api";
import { FieldItem } from "@/components/Form/form";
import { DayRatioSettingForm } from "@/config/form.config";
import { DayRatioSettingTable, ReportTable } from "@/config/table.config";
import { ExportExcelOption, useExcel } from "@/hooks/useExcel";
import { useReport } from "@/hooks/useReport";
import router from "@/router";
import useStore from "@/store";
import { Record, Report } from "@/types/report";
import { generateId } from "@/utils";
import { parseExcelDateNumber, parseMonthDayTextDate } from "@/utils/date";
import { Download, Plus, Setting, Upload } from '@element-plus/icons-vue';
import dayjs from "dayjs";
import _ from "lodash";
import { storeToRefs } from "pinia";

const formVisible = ref<boolean>(false);

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

const employeeStore = useStore().employee;
const dialogVisible = employeeStore.employeeTempList.length <= 0;

const onDialogConfirm = () => {
  router.push("/main/employee");
};

// 月次工分汇算
const reportCols = ReportTable;

const reportList = ref<Report[]>([]);
const errorList = ref<string[]>([]);
const reportDate = ref<string>("");

const originData = ref<Record[]>([]);
const initReport = (list: Record[][], showSuccess: boolean = true) => {
  if (list.length > 0) {
    const { reports, errors, currentDate } = useReport(list);
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
const onImport = (data: any[]) => {
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
          record: item[e2].toString(),
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
const onExport = async () => {
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
  calcMonth.value = "";
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

const onConfirmHeader = () => {
  if (checkList.value.length === 0) {
    ElMessage.error("请至少选择一项");
  } else {
    localStorage.setItem('exportHeaders', JSON.stringify(checkList.value));
    dialogTableVisible.value = false;
  }
}

const toggleSelect = () => {
  if (checkList.value.length === 0) {
    checkList.value = reportCols.map(e => e.field);
  } else {
    checkList.value = [];
  }
}

const calcMonth = ref('');
const onCalcMonthChange = async (value: string) => {
  const res = await getRecordList(value);
  const { data } = res;
  const groupedData = _.groupBy(data, 'employeeName');
  if (data.length === 0) {
    ElMessage.warning(`未查询到${calcMonth.value}的工分汇算结果，请手动导入工作表后重试`);
    reportList.value = [];
  } else {
    const result = Object.values(groupedData);
    initReport(result, false);
  }
}
</script>
@/models/report