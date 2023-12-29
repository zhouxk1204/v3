<template>
  <div>
    <div class="mb-6">
      <div class="flex items-end justify-between">
        <h1 class="text-2xl font-bold">岗位班次工分倍率附加设定</h1>
        <Button type="primary" @click="openDialog">添加</Button>
      </div>
      <hr class="mt-2 mb-3" />
      <Table
        :headers="rateHeaders"
        :data="rateSettingList"
        :isAction="true"
        @edit="onEdit"
        @del="onDel"
      ></Table>
      <Dialog v-model="isOpen">
        <form
          class="absolute flex flex-col p-6 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow left-1/2 top-1/2 w-96"
        >
          <div class="flex items-center justify-between mb-4">
            <h1 class="text-xl font-bold">{{ mode.text }}工分倍率附加设定</h1>
            <Button @click="onClose"
              ><Icon icon="material-symbols:close" color="#bbb"
            /></Button>
          </div>
          <!-- 姓名 -->
          <FormItem title="姓名">
            <Select
              v-model="currentEmployee"
              placeholder="请选择员工"
              :options="employees"
              @select="onSelectEmployee"
            ></Select>
          </FormItem>
          <!-- 日期 -->
          <FormItem title="日期">
            <DatePicker v-model="form.date"></DatePicker>
          </FormItem>
          <!-- 岗位 -->
          <FormItem title="岗位">
            <Select
              v-model="currentPost"
              :options="posts"
              @select="onSelectPost"
              placeholder="请选择岗位"
            ></Select>
          </FormItem>
          <!-- 班次 -->
          <FormItem title="上班（加班）">
            <Select
              v-model="currentWorkStatus"
              placeholder="请选择上班（加班）"
              :options="workStatus"
              @select="onSelectWorkStatus"
            ></Select>
          </FormItem>
          <!-- 倍率 -->
          <FormItem title="岗位班次工分倍率">
            <Input type="number" v-model="form.rate"></Input>
          </FormItem>
          <FormItem title="原因备注">
            <textarea
              v-model="form.remark"
              rows="3"
              class="p-2 border rounded-md resize-none"
            ></textarea>
          </FormItem>
          <Button @click="submit" type="primary" :disabled="isFormValid"
            >{{ mode.text }}
          </Button>
        </form>
      </Dialog>
    </div>

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
import { Option } from "@/components/Select/types";
import { POST, WORK_STATUS } from "@/constants";
import {
  RECORD_RATE_SETTING,
  REPORT_TABLE_HEADERS,
} from "@/constants/table.header";
import { useExportExcel } from "@/hooks/exportExcel";
import { useDialog } from "@/hooks/useDialog";
import { useReport } from "@/hooks/useReport";
import { IEmployeeReport, IRateSetting, IRecord } from "@/models/report.model";
import useStore from "@/store";
import { deepCopy, isEmpty } from "@/utils";
import { parseExcelDateNumber, parseMonthDayTextDate } from "@/utils/date";
import * as dayjs from "dayjs";
import { computed, ref, toRaw } from "vue";

const headers = REPORT_TABLE_HEADERS;
const errors = ref<string[]>([]);
const date = ref<string>("");
const list = ref<IEmployeeReport[]>([]);

const iRecordList = toRaw(useStore().report.getIRecordList());

const refreshData = (iRecordList: IRecord[][]): void => {
  if (iRecordList.length === 0) return;
  const { iEmployeeReportList, errorList, currentDate } =
    useReport(iRecordList);
  date.value = currentDate;
  errors.value = errorList;
  list.value = iEmployeeReportList;
};

refreshData(iRecordList);

/**
 * 导入excel文件
 * @param data
 */
const importExcel = (data: any[]): void => {
  let header: any = {};
  const map: Map<string, IRecord[]> = new Map();
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
  useStore().report.setIRecordList(list);
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
  useStore().report.setIRecordList([]);
  list.value = [];
  errors.value = [];
};

const rateHeaders = RECORD_RATE_SETTING;
/**
 * 添加自定义岗位，上班，加班的工分倍率
 */
const { mode, isOpen, openDialog, closeDialog } = useDialog();
const emptyForm = (): IRateSetting => {
  return {
    id: "",
    no: "",
    name: "",
    date: "",
    postId: "",
    postName: "",
    statusId: "",
    statusName: "",
    rate: 3,
    remark: "",
  };
};
const form = ref<IRateSetting>(emptyForm());
const rateSettingList = useStore().rateSetting.rateSettingList;
const posts = POST;
/**
 * 岗位选择事件
 * @param {Option} option
 */
const onSelectPost = (option: Option) => {
  form.value.postId = option.code;
  form.value.postName = option.text;
};
const currentPost = ref({
  code: form.value.postId,
  text: form.value.postName,
});

const workStatus = WORK_STATUS;
/**
 * 班次选择事件
 * @param {Option} option
 */
const onSelectWorkStatus = (option: Option) => {
  form.value.statusId = option.code;
  form.value.statusName = option.text;
};
const currentWorkStatus = ref({
  code: form.value.statusId,
  text: form.value.statusName,
});

const employees = useStore().employee.employeeList.map((e) => {
  return {
    code: e.no,
    text: e.name,
  };
});
/**
 * 班次选择事件
 * @param {Option} option
 */
const onSelectEmployee = (option: Option) => {
  form.value.no = option.code;
  form.value.name = option.text;
};
const currentEmployee = ref({
  code: form.value.no,
  text: form.value.name,
});

const isFormValid = computed(() => {
  const formValues = Object.values(form.value);
  const valuesWithoutId = formValues.filter(
    (_, index) => Object.keys(form.value)[index] !== "id"
  );

  // 检查除了 id 以外的值是否都不为空
  return valuesWithoutId.some((value) => !Boolean(value));
});

/**
 * 节假日form表单事件
 */
const submit = () => {
  if (mode.value.code === "create") {
    useStore().rateSetting.add(form.value);
  } else if (mode.value.code === "update") {
    useStore().rateSetting.update(form.value);
  }
  form.value = emptyForm();

  // 刷新数据
  iRecordList.length > 0 && refreshData(iRecordList);

  closeDialog();
};

const onClose = (): void => {
  closeDialog();
};

/**
 * 编辑
 * @param {Holiday} holiday
 */
const onEdit = (iRateSetting: IRateSetting): void => {
  form.value = deepCopy(iRateSetting);
  currentEmployee.value.code = iRateSetting.no;
  currentEmployee.value.text = iRateSetting.name;
  currentWorkStatus.value.code = iRateSetting.statusId;
  currentWorkStatus.value.text = iRateSetting.statusName;
  currentPost.value.code = iRateSetting.postId;
  currentPost.value.text = iRateSetting.postName;
  openDialog(false);
};

/**
 * 删除
 * @param {IRateSetting} iRateSetting
 */
const onDel = (iRateSetting: IRateSetting): void => {
  useStore().rateSetting.remove(iRateSetting.id);
};
</script>
