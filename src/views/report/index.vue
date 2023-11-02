<template>
  <div class="flex">
    <Upload @data="onData">
      <div class="flex items-center">
        <span>一键导入</span>
        <Icon icon="material-symbols:upload" class="ml-1" :width="22"></Icon>
      </div>
    </Upload>
  </div>
</template>

<script setup lang="ts">
import { DEFAULT } from "@/constants";
import { DailyRecord } from "@/models/report.model";
import { getDateStringFromMonthDay } from "@/utils/date";
import * as dayjs from "dayjs";

const onData = (data: any[]): void => {
  let header: string[] = [];
  const dailyRecordList: DailyRecord[] = [];

  data.forEach((item) => {
    const name = item["__EMPTY"];
    if (name === undefined) {
      // 表头日期行
      header = Object.values(item).map((e) =>
        dayjs("1900-01-01")
          .add((e as number) - 2, "day")
          .format(DEFAULT.DATE_FORMAT)
      );
    } else {
      const list = Object.keys(item)
        .filter((e) => e !== "__EMPTY")
        .map((e2, i) => {
          return new DailyRecord({
            date:
              header.length === 0 ? getDateStringFromMonthDay(e2) : header[i],
            record: item[e2] + "",
            employeeName: name,
          });
        });
      dailyRecordList.push(...list);
    }
  });

  console.log(
    "%c Line:48 🍉 dailyRecordList",
    "color:#42b983",
    dailyRecordList
  );
};
</script>
<style lang="scss" scoped></style>
