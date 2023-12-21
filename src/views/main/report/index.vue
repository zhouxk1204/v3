<template>
  <div>
    <div class="flex items-end justify-between">
      <h1 class="text-2xl font-bold">月次工分汇算</h1>
      <div class="flex">
        <Upload @data="importExcel">
          <div class="flex items-center">
            <span>导入</span>
          </div>
        </Upload>
        <Button
          type="primary"
          class="ml-2"
          @click="exportExcel"
          :disabled="errors.length || list.length === 0"
          >导出
        </Button>
        <Button
          type="danger"
          class="ml-2"
          @click="clear"
          :disabled="list.length === 0"
          >清空</Button
        >
      </div>
    </div>
    <hr class="mt-2 mb-3" />
    <Table :headers="headers" :data="list"></Table>

    <div class="mt-4 mb-10 font-bold" v-if="errors.length">
      <h1 class="pb-1 text-xl border-b border-gray-200">异常记录</h1>
      <ul>
        <li v-for="item in errors" class="mt-2 ml-3 text-sm text-red-500">
          {{ item }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { REPORT_TABLE_HEADERS } from "@/constants/table.header";
import { useExportExcel } from "@/hooks/exportExcel";
import { useReport } from "@/hooks/useReport";
import { IDailyRecord, IEmployeeReport, IRecord } from "@/models/report.model";
import useStore from "@/store";
import { isEmpty } from "@/utils";
import { parseExcelDateNumber, parseMonthDayTextDate } from "@/utils/date";
import * as dayjs from "dayjs";
import { ref, toRaw } from "vue";

const headers = REPORT_TABLE_HEADERS;
const errors = ref<string[]>([]);
const date = ref<string>("");
const list = ref<IEmployeeReport[]>([]);

const origin = toRaw(useStore().report.getIRecordList());

const refreshData = (value: IRecord[][]): void => {
  if (value.length === 0) return;
  const { iEmployeeReportList, errorList, currentDate } = useReport(value);
  date.value = currentDate;
  errors.value = errorList;
  list.value = iEmployeeReportList;
};

refreshData(origin);

/**
 * 导入excel文件
 * @param data
 */
const importExcel = (data: any[]): void => {
  let header: any = {};
  const map: Map<string, IDailyRecord[]> = new Map();
  data.forEach((item) => {
    const employeeName = item["__EMPTY"];
    if (!employeeName) {
      // 表头日期行
      header = item;
    } else {
      const dailyRecordList = map.get(employeeName) ?? [];
      const items = Object.keys(item).filter((e) => e !== "__EMPTY");
      const l = items.map((e2) => {
        const date = isEmpty(header)
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
  useStore().report.saveIRecordList(list);
  refreshData(list);
};

/**
 * 导出结果
 */
const exportExcel = (): void => {
  const sheetName = dayjs(date.value).format("YYYY年MM月");
  const fileName = `${sheetName}月上班（加班）工分汇算`;
  useExportExcel(
    [
      {
        title: fileName,
        headers: REPORT_TABLE_HEADERS.map((e) => e.label),
        data: list.value.map((item: any) =>
          REPORT_TABLE_HEADERS.map((e) => e.key).map((key) => item[key])
        ),
      },
    ],
    fileName,
    sheetName
  );
};

/**
 * 清空结果
 */
const clear = (): void => {
  list.value = [];
  useStore().report.clear();
};
</script>
