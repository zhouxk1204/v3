<template>
  <div>
    <div class="flex mb-4">
      <Upload @data="importExcel">
        <div class="flex items-center">
          <span>一键导入</span>
        </div>
      </Upload>
      <Button
        type="primary"
        class="ml-2"
        @click="exportExcel"
        :disabled="errors.length || !list"
        >导出
      </Button>
      <Button type="danger" class="ml-2" @click="clear"> 清空 </Button>
    </div>
    <Table :headers="headers" :data="list"></Table>

    <div class="mt-4 mb-10 font-bold" v-if="errors.length">
      <h1 class="pb-1 text-xl border-b border-gray-200">异常记录</h1>
      <ul>
        <li
          v-for="item in errors"
          class="mt-2 ml-3 text-sm text-red-500"
        >
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
import { IDailyRecord, IRecord } from "@/models/report.model";
import useStore from "@/store";
import { getDateStringFromMonthDay, parseExcelDateNumber } from "@/utils/date";
import * as dayjs from "dayjs";
import {  ref, toRaw, watch } from "vue";

const headers = REPORT_TABLE_HEADERS;
const errors = ref<string[]>([]);
const date = ref<string>('');
const list = ref();

const origin = toRaw(useStore().report.getIRecordList());
const iRecordList = ref(origin);

const refreshData = (value: IRecord[][]) => {
  if(value.length === 0) return;
  const {iEmployeeReportList, errorList, currentDate} = useReport(value);
  date.value = currentDate;
  errors.value = errorList;
  list.value = iEmployeeReportList;
}

refreshData(iRecordList.value)

watch(iRecordList, (value)=>{
  refreshData(value);
})

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
        const date = parseExcelDateNumber(header[e2] as number);
        return {
          date: header.length === 0 ? getDateStringFromMonthDay(e2) : date,
          record: item[e2].toString(),
          employeeName,
        };
      });
      dailyRecordList.push(...l);
      map.set(employeeName, dailyRecordList);
    }
  });
  const list = Array.from(map.values());
  iRecordList.value = list;
  useStore().report.saveIRecordList(list); 
};

/**
 * 导出结果
 */
const exportExcel = () => {
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
const clear = () => {
  iRecordList.value = [];
};
</script>
