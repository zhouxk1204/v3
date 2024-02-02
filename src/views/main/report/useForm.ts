import { FormInstance, FormRules } from "element-plus";

import { IDayRatio } from "@/types";

export function useForm() {
  const formRef = ref<FormInstance>();

  const form = reactive<IDayRatio>({
    id: -1,
    date: "",
    employeeId: "",
    jobId: "",
    statusId: "",
    ratio: 1,
    remark: "",
  });

  const rules = reactive<FormRules<IDayRatio>>({
    date: [
      {
        required: true,
        message: "日期不能为空",
        trigger: "submit",
      },
    ],
    employeeId: [
      {
        required: true,
        message: "姓名不能为空",
        trigger: "submit",
      },
    ],
    jobId: [
      {
        required: true,
        message: "岗位不能为空",
        trigger: "submit",
      },
    ],
    statusId: [
      {
        required: true,
        message: "上班/加班不能为空",
        trigger: "submit",
      },
    ],
    ratio: [
      {
        required: true,
        message: "工分倍率不能为空",
        trigger: "submit",
      },
    ],
    remark: [
      {
        required: true,
        message: "原因备注不能为空",
        trigger: "submit",
      },
    ],
  });

  const resetFrom = () => {
    form.id = -1;
    form.date = "";
    form.employeeId = "";
    form.statusId = "";
    form.jobId = "";
    form.ratio = 1;
    form.remark = "";
  };

  return {
    form,
    rules,
    formRef,
    resetFrom,
  };
}
