<template>
  <div>
    <div class="flex mb-4">
      <Upload @data="importExcel">
        <div class="flex items-center">
          <span>一键导入</span>
          <Icon icon="material-symbols:upload" class="ml-1" :width="22"></Icon>
        </div>
      </Upload>
      <Button type="primary" class="ml-2" @click="exportExcel">导出</Button>
      <Button type="danger" class="ml-2" @click="clear">清空</Button>
    </div>
    <Table :headers="headers" :data="dataList"></Table>

    <div class="mt-4">
      <h3>以下记录无法识别，请检查</h3>
      <div
        v-for="item in reportErrorList"
        class="mt-3 ml-3 text-sm text-red-500"
      >
        {{ item }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { REPORT_TABLE_HEADERS } from "@/constants/table.header";
import { useExportExcel } from "@/hooks/exportExcel";
import { useReport } from "@/hooks/useReport";
import { IDailyRecord } from "@/models/report.model";
import useStore from "@/store";
import { getDateStringFromMonthDay, parseExcelDateNumber } from "@/utils/date";
import { ref } from "vue";

const headers = REPORT_TABLE_HEADERS;
const reportErrorList = ref(useStore().report.reportErrorList);
const reportDate = ref(useStore().report.reportDate);
const dataList = ref(useStore().report.iEmployeeReportList);

const importExcel = (data: any[]): void => {
  let header: string[] = [];
  const map: Map<string, IDailyRecord[]> = new Map();
  data.forEach((item) => {
    const employeeName = item["__EMPTY"];
    if (!employeeName) {
      // 表头日期行
      header = Object.values(item).map((e) =>
        parseExcelDateNumber(e as number)
      );
    } else {
      const dailyRecordList = map.get(employeeName) ?? [];
      const l = Object.keys(item)
        .filter((e) => e !== "__EMPTY")
        .map((e2, i) => {
          return {
            date:
              header.length === 0 ? getDateStringFromMonthDay(e2) : header[i],
            record: item[e2].toString(),
            employeeName,
          };
        });
      dailyRecordList.push(...l);
      map.set(employeeName, dailyRecordList);
    }
  });
  const { iEmployeeReportList } = useReport(Array.from(map.values()));
  useStore().report.save(iEmployeeReportList);
};

const exportExcel = () => {
  useExportExcel(
    [
      {
        title: reportDate.value,
        headers: REPORT_TABLE_HEADERS.map((e) => e.label),
        data: dataList.value.map((item: any) =>
          REPORT_TABLE_HEADERS.map((e) => e.key).map((key) => item[key])
        ),
      },
    ],
    reportDate.value
  );
};

const clear = () => {
  dataList.value = [];
  useStore().report.clear();
};
</script>
