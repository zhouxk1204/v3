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
        <Table
          class="border-t"
          v-if="dayRatioSettingList.length > 0"
          :list="dayRatioSettingList"
          :cols="dayRatioSettingCols"
          :editable="true"
          @remove="onRemove"
          @update="onUpdate"
        ></Table>
      </el-collapse-item>

      <el-collapse-item name="2">
        <template #title>
          <h1 class="flex items-center w-full h-12 text-base font-bold">
            <span>月次工分汇算</span>
          </h1>
        </template>
        <div class="flex items-center">
          <UploadExcel class="mr-3" @change="onImport" sheetName="护士"
            >导入</UploadExcel
          >
          <el-button
            type="success"
            @click="onExport"
            :disabled="reportList.length === 0"
            >导出</el-button
          >
          <el-popconfirm width="220" title="确认清空工分汇算?" @confirm="reset">
            <template #reference>
              <el-button type="danger" :disabled="reportList.length === 0"
                >清空</el-button
              >
            </template>
          </el-popconfirm>
        </div>
        <Table :list="reportList" :cols="reportCols"></Table>
        <div v-if="errorList.length > 0">
          <h2 class="my-2 font-bold">错误的工分记录</h2>
          <ul class="mt-2 ml-3 text-red-500">
            <li v-for="error in errorList">{{ error }}</li>
          </ul>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>

  <el-dialog
    v-model="dialogVisible"
    width="500"
    title="提示"
    center
    :showClose="false"
  >
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
import router from "@/router";
import useStore from "@/store";
import { IDayRecord, IReport } from "@/types";
import { generateId } from "@/utils";
import { parseExcelDateNumber, parseMonthDayTextDate } from "@/utils/date";
import * as dayjs from "dayjs";

import { storeToRefs } from "pinia";

const activeNames = ref(["1", "2"]);

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

// 删除
const onRemove = (index: number) => {
  remove(index);
};
// 更新
const onUpdate = (data: any) => {
  update(data);
};

const dialogVisible = useStore().employee.list.length === 0;

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

const initReport = () => {
  if (recordList.value.length > 0) {
    const { reports, errors, currentDate } = useReport(recordList.value);
    reportList.value = reports;
    errorList.value = errors;
    reportDate.value = currentDate;
    if (errorList.value.length > 0) {
      ElMessage.error("存在错误的工分记录，请及时检查修正！");
    }
  }
};

initReport();

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
</script>
