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
import { DailyRecord } from "@/models/report.model";
import { isEmployeeExist } from "@/utils";
import { getDateStringFromMonthDay } from "@/utils/date";
import * as dayjs from "dayjs";

const onData = (data: any[]): void => {
  const map = new Map<string, DailyRecord[]>();
  let header: string[] = [];

  for (let item of data) {
    const name = item["__EMPTY"];
    if (name === undefined) {
      header = Object.values(item).map((e) =>
        dayjs("1900-01-01")
          .add((e as number) - 2, "day")
          .format("YYYY/MM/DD")
      );
    } else {
      if (!isEmployeeExist(name)) {
        continue;
      } else {
        const arr = map.get(name);
        const list = Object.keys(item)
          .filter((e) => e !== "__EMPTY")
          .map((e2, i) => {
            return new DailyRecord({
              date:
                header.length === 0 ? getDateStringFromMonthDay(e2) : header[i],
              record: item[e2] + "",
            });
          });
        if (arr && arr.length > 0) {
          arr.push(...list);
        } else {
          map.set(name, list);
        }
      }
    }
  }
  console.log("%c Line:40 🍉 map", "color:#42b983", map);
};
</script>
<style lang="scss" scoped></style>
