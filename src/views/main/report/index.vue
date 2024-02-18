<template>
  <div class="flex flex-col">
    <el-collapse v-model="activeNames">
      <el-collapse-item name="1">
        <template #title>
          <h1 class="flex items-center h-12 text-base font-bold">
            添加岗位工分倍率特殊设定
          </h1>
        </template>
        <div>
          <!--  -->
          <Form :form="form" @submit="handelSubmit"></Form>
        </div>
        <div v-if="list.length > 0" class="border-t">
          <Table
            :list="list"
            :cols="cols"
            :editable="true"
            @remove="onRemove"
            @update="onUpdate"
          ></Table>
        </div>
      </el-collapse-item>

      <el-collapse-item name="2">
        <template #title>
          <h1 class="flex items-center w-full h-12 text-base font-bold">
            <span>月次工分汇算</span>
          </h1>
        </template>
        <div class="flex items-center gap-5">
          <UploadExcel @change="onChange" sheetName="护士"
            >选择文件导入</UploadExcel
          >
          <el-button type="success">导出</el-button>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>

  <!-- 月次工分汇算 -->
  <!-- <PageTitle title="月次工分汇算">
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
    </PageTitle>
    <Table :headers="headers" :data="list"></Table>
    <div class="mt-4 mb-10 font-bold" v-if="errors.length">
      <PageTitle title="异常记录"></PageTitle>
      <ul>
        <li v-for="item in errors" class="mt-2 ml-3 text-sm text-red-500">
          {{ item }}
        </li>
      </ul>
    </div>
  </div> -->
</template>

<script setup lang="ts">
import { FieldItem } from "@/components/Form/form";
import { TableColumnItem } from "@/components/Table/type";
import { DayRatioSettingForm } from "@/config/form.config";
import { DayRatioSettingTable } from "@/config/table.config";
import { useReport } from "@/hooks/useReport";
import useStore from "@/store";
import { IDayRatioSetting, IDayRecord } from "@/types";
import { generateId } from "@/utils";
import { parseExcelDateNumber, parseMonthDayTextDate } from "@/utils/date";

// import { useTable } from "@/hooks/useTable";
// import useStore from "@/store";
// import { IDayRatio } from "@/types";
// import * as dayjs from "dayjs";
// import * as _ from "lodash";
import { storeToRefs } from "pinia";
// import { useForm } from "./useForm";

// const activeNames = ref(["1"]);

// 岗位工分倍率特殊设定
const store = useStore().dayRatioSetting;
const { list } = storeToRefs(store);
const { insert, remove, update } = store;

const form = ref<FieldItem[]>(DayRatioSettingForm);
const handelSubmit = (data: any) => {
  data.id = generateId();
  insert(data);
};

const cols: TableColumnItem<IDayRatioSetting>[] = DayRatioSettingTable;
const onRemove = (index: number) => {
  remove(index);
};

const onUpdate = (data: any) => {
  update(data);
};

const onChange = (data: any[]) => {
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
  useReport(list);
  console.log("%c Line:116 🍡 list", "color:#e41a6a", list);
};

const activeNames = ref(["1"]);
// const { form, rules, formRef, resetFrom } = useForm();

// const store = useStore().dayRatio;
// const { list } = storeToRefs(store);
// const { handleInsert, handleRemove, handleUpdate } = store;
// // 表格
// const { editRowTemp, editRowIndex, edit, cancel } = useTable<IDayRatio>();

// const update = () => {
//   const data = _.cloneDeep(editRowTemp.value) as IDayRatio;
//   handleUpdate(data);
//   editRowIndex.value = -1;
// };

// const handelSubmit = () => {
//   if (!formRef.value) return;
//   formRef.value.validate((valid, fields) => {
//     if (valid) {
//       const data = _.cloneDeep(form);
//       data.id = dayjs().valueOf();
//       if (!handleInsert(data)) {
//         resetFrom();
//       }
//     } else {
//       console.error("error submit!", fields);
//     }
//   });
// };

// const parseExcel = (file: any) => {
//   const reader = new FileReader();
//   reader.onload = (e) => {
//     const data = e.target!.result;
//     const workbook = XLSX.read(data, { type: "array" });

//     const sheetName = workbook.SheetNames[0];
//     const sheet = workbook.Sheets[sheetName];

//     const excelData: any[] = XLSX.utils.sheet_to_json(sheet);

//     let header: any = {};
//     const map: Map<string, IDayRecord[]> = new Map();
//     excelData.forEach((item) => {
//       const employeeName = item["__EMPTY"];
//       if (!employeeName) {
//         // 表头日期行
//         header = item;
//       } else {
//         const dailyRecordList = map.get(employeeName) ?? [];
//         const items = Object.keys(item).filter((e) => e !== "__EMPTY");
//         const l = items.map((e2) => {
//           const date =
//             Object.keys(header).length === 0
//               ? parseMonthDayTextDate(e2)
//               : parseExcelDateNumber(header[e2] as number);

//           return {
//             date,
//             record: item[e2].toString(),
//             employeeName,
//           };
//         });
//         dailyRecordList.push(...l);
//         map.set(employeeName, dailyRecordList);
//       }
//     });
//     // const list2 = Array.from(map.values());
//   };

//   reader.readAsArrayBuffer(file);
// };
// import { Option } from "@/components/Select/types";
// import { POST, WORK_STATUS } from "@/constants";
// import {
//   RECORD_RATE_SETTING,
//   REPORT_TABLE_HEADERS,
// } from "@/constants/table.header";
// import { useExportExcel } from "@/hooks/exportExcel";
// import { useDialog } from "@/hooks/useDialog";
// import { useReport } from "@/hooks/useReport";
// import { IEmployeeReport, IRateSetting, IRecord } from "@/models/report.model";
// import useStore from "@/store";
// import { deepCopy, isEmpty } from "@/utils";
// import { parseExcelDateNumber, parseMonthDayTextDate } from "@/utils/date";
// import * as dayjs from "dayjs";
// import { computed, ref, toRaw } from "vue";

// const headers = REPORT_TABLE_HEADERS;
// const errors = ref<string[]>([]);
// const date = ref<string>("");
// const list = ref<IEmployeeReport[]>([]);

// const iRecordList = toRaw(useStore().report.getIRecordList());

// const refreshData = (iRecordList: IRecord[][]): void => {
//   if (iRecordList.length === 0) return;
//   const { iEmployeeReportList, errorList, currentDate } =
//     useReport(iRecordList);
//   date.value = currentDate;
//   errors.value = errorList;
//   list.value = iEmployeeReportList;
// };

// refreshData(iRecordList);

// /**
//  * 导入excel文件
//  * @param data
//  */
// const importExcel = (data: any[]): void => {
//   let header: any = {};
//   const map: Map<string, IRecord[]> = new Map();
//   data.forEach((item) => {
//     const employeeName = item["__EMPTY"];
//     if (!employeeName) {
//       // 表头日期行
//       header = item;
//     } else {
//       const dailyRecordList = map.get(employeeName) ?? [];
//       const items = Object.keys(item).filter((e) => e !== "__EMPTY");
//       const l = items.map((e2) => {
//         const date = isEmpty(header)
//           ? parseMonthDayTextDate(e2)
//           : parseExcelDateNumber(header[e2] as number);

//         return {
//           date,
//           record: item[e2].toString(),
//           employeeName,
//         };
//       });
//       dailyRecordList.push(...l);
//       map.set(employeeName, dailyRecordList);
//     }
//   });
//   const list = Array.from(map.values());
//   useStore().report.setIRecordList(list);
//   refreshData(list);
// };

// /**
//  * 导出结果
//  */
// const exportExcel = (): void => {
//   const sheetName = dayjs(date.value).format("YYYY年MM月");
//   const fileName = `${sheetName}月上班（加班）工分汇算`;
//   useExportExcel(
//     [
//       {
//         title: fileName,
//         headers: REPORT_TABLE_HEADERS.map((e) => e.label),
//         data: list.value.map((item: any) =>
//           REPORT_TABLE_HEADERS.map((e) => e.key).map((key) => item[key])
//         ),
//       },
//     ],
//     fileName,
//     sheetName
//   );
// };

// /**
//  * 清空结果
//  */
// const clear = (): void => {
//   useStore().report.setIRecordList([]);
//   list.value = [];
//   errors.value = [];
// };

// const rateHeaders = RECORD_RATE_SETTING;
// /**
//  * 添加自定义岗位，上班，加班的工分倍率
//  */
// const { mode, isOpen, openDialog, closeDialog } = useDialog();
// const emptyForm = (): IRateSetting => {
//   return {
//     id: "",
//     no: "",
//     name: "",
//     date: "",
//     postId: "",
//     postName: "",
//     statusId: "",
//     statusName: "",
//     rate: 3,
//     remark: "",
//   };
// };
// const form = ref<IRateSetting>(emptyForm());
// const rateSettingList = useStore().rateSetting.rateSettingList;
// const posts = POST;
// /**
//  * 岗位选择事件
//  * @param {Option} option
//  */
// const onSelectPost = (option: Option) => {
//   form.value.postId = option.code;
//   form.value.postName = option.text;
// };
// const currentPost = ref({
//   code: form.value.postId,
//   text: form.value.postName,
// });

// const workStatus = WORK_STATUS;
// /**
//  * 班次选择事件
//  * @param {Option} option
//  */
// const onSelectWorkStatus = (option: Option) => {
//   form.value.statusId = option.code;
//   form.value.statusName = option.text;
// };
// const currentWorkStatus = ref({
//   code: form.value.statusId,
//   text: form.value.statusName,
// });

// const employees = useStore().employee.employeeList.map((e) => {
//   return {
//     code: e.no,
//     text: e.name,
//   };
// });
// /**
//  * 班次选择事件
//  * @param {Option} option
//  */
// const onSelectEmployee = (option: Option) => {
//   form.value.no = option.code;
//   form.value.name = option.text;
// };
// const currentEmployee = ref({
//   code: form.value.no,
//   text: form.value.name,
// });

// const isFormValid = computed(() => {
//   const formValues = Object.values(form.value);
//   const valuesWithoutId = formValues.filter(
//     (_, index) => Object.keys(form.value)[index] !== "id"
//   );

//   // 检查除了 id 以外的值是否都不为空
//   return valuesWithoutId.some((value) => !Boolean(value));
// });

// /**
//  * 节假日form表单事件
//  */
// const submit = () => {
//   if (mode.value.code === "create") {
//     useStore().rateSetting.add(form.value);
//   } else if (mode.value.code === "update") {
//     useStore().rateSetting.update(form.value);
//   }
//   form.value = emptyForm();

//   // 刷新数据
//   iRecordList.length > 0 && refreshData(iRecordList);

//   closeDialog();
// };

// const onClose = (): void => {
//   closeDialog();
// };

// /**
//  * 编辑
//  * @param {Holiday} holiday
//  */
// const onEdit = (iRateSetting: IRateSetting): void => {
//   form.value = deepCopy(iRateSetting);
//   currentEmployee.value.code = iRateSetting.no;
//   currentEmployee.value.text = iRateSetting.name;
//   currentWorkStatus.value.code = iRateSetting.statusId;
//   currentWorkStatus.value.text = iRateSetting.statusName;
//   currentPost.value.code = iRateSetting.postId;
//   currentPost.value.text = iRateSetting.postName;
//   openDialog(false);
// };

// /**
//  * 删除
//  * @param {IRateSetting} iRateSetting
//  */
// const onDel = (iRateSetting: IRateSetting): void => {
//   useStore().rateSetting.remove(iRateSetting.id);
// };

// const handleChange = (val: string[]) => {
//   console.log(val);
// };
</script>
