<template>
  <div>
    <div class="flex mb-4">
      <Upload @data="onData">
        <div class="flex items-center">
          <span>一键导入</span>
          <Icon icon="material-symbols:upload" class="ml-1" :width="22"></Icon>
        </div>
      </Upload>
    </div>
    <Table :headers="headers" :data="dataList"></Table>
  </div>
</template>

<script setup lang="ts">
import { REPORT_TABLE_HEADERS } from "@/constants/table.header";
import { useReport } from "@/hooks/useReport";
import { IDailyRecord } from "@/models/report.model";
import useStore from "@/store";
import { getDateStringFromMonthDay, parseExcelDateNumber } from "@/utils/date";

const headers = REPORT_TABLE_HEADERS;

const dataList = useStore().report.iEmployeeReportList;

const onData = (data: any[]): void => {
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
</script>
