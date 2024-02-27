<template>
  <div class="flex flex-col">
    <el-collapse v-model="activeNames">
      <el-collapse-item name="1">
        <template #title>
          <h1 class="flex items-center h-12 text-base font-bold">
            添加岗位工分倍率特殊设定
          </h1>
        </template>
        <Form :form="form" @submit="handelSubmit"></Form>
        <Table class="border-t" v-if="dayRatioSettingList.length > 0" :list="dayRatioSettingList"
          :cols="dayRatioSettingCols" :editable="true" @remove="remove($event)" @update="update($event)"></Table>
      </el-collapse-item>

      <el-collapse-item name="2">
        <template #title>
          <h1 class="flex items-center w-full h-12 text-base font-bold">
            <span>月次工分汇算</span>
          </h1>
        </template>
        <div class="flex items-center">
          <UploadExcel class="mr-3" @change="onImport" sheetName="护士">导入</UploadExcel>
          <el-button type="success" @click="onExport" :disabled="reportList.length === 0">导出</el-button>
          <el-popconfirm width="220" title="确认清空工分汇算?" @confirm="onResetReport">
            <template #reference>
              <el-button type="danger" :disabled="reportList.length === 0">清空</el-button>
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
                <el-tag effect="dark" size="small" type="info" v-if="item.totalGastroscopy > 0">胃镜{{ item.totalGastroscopy
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


      </el-collapse-item>
    </el-collapse>
  </div>

  <el-dialog v-model="dialogVisible" width="500" title="提示" center :showClose="false">
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
import { FieldItem } from "@/components/Form/form";
import { DayRatioSettingForm } from "@/config/form.config";
import { DayRatioSettingTable, ReportTable } from "@/config/table.config";
import { ExportExcelOption, useExcel } from "@/hooks/useExcel";
import { useReport } from "@/hooks/useReport";
import { IRecord } from "@/models/report.model";
import router from "@/router";
import useStore from "@/store";
import { IDayRecord, IReport } from "@/types";
import { generateId } from "@/utils";
import { parseExcelDateNumber, parseMonthDayTextDate } from "@/utils/date";
import dayjs from "dayjs";
import { storeToRefs } from "pinia";

const activeNames = ref(["2"]);

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

const dialogVisible = useStore().employee.list.length <= 0;

const onDialogConfirm = () => {
  router.push("/main/employee");
};

// 月次工分汇算
const reportCols = ReportTable;

const recordStore = useStore().record;
const { list: recordList } = storeToRefs(recordStore);
const { reset } = recordStore;

const reportList = ref<IReport[]>([]);
const errorList = ref<string[]>([]);
const reportDate = ref<string>("");

const initReport = (list: IRecord[][], showSuccess: boolean = true) => {
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

initReport(recordList.value, false);

// 导入
const onImport = (data: any[]) => {
  if (data.length === 0) return;

  let header: any = {};
  const map: Map<string, IDayRecord[]> = new Map();
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
  recordStore.insert(list);
  initReport(list);
};

// 导出
const onExport = (): void => {
  const sheetName = dayjs(reportDate.value).format("YYYY年MM月");
  const fileName = `${sheetName}上班（加班）工分汇算`;
  const exportExcelOptions: ExportExcelOption[] = [
    {
      title: fileName,
      headers: reportCols.map((e) => e.label),
      data: reportList.value.map((item) =>
        reportCols.map((e) => e.field).map((key) => item[key])
      ),
      remark: "时间总工分 = 其他岗位总工分 + 胃2岗位总工分 * 1.2",
    },
  ];
  useExcel().exportExcel(exportExcelOptions, fileName);
};

const onResetReport = () => {
  reset();
  reportList.value = [];
  errorList.value = [];
  reportDate.value = "";
};
</script>
