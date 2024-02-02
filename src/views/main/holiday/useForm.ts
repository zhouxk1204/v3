import { FormInstance, FormRules } from "element-plus";

import { IHoliday } from "@/types";

export function useForm() {
  const formRef = ref<FormInstance>();

  const form = reactive<IHoliday>({
    id: -1,
    date: "",
    name: "",
    type: "",
    workRadio: 1,
    extraRadio: 1.5,
  });

  const rules = reactive<FormRules<IHoliday>>({
    date: [
      {
        required: true,
        message: "日期不能为空",
        trigger: "submit",
      },
    ],
    name: [
      {
        required: true,
        message: "节假日不能为空",
        trigger: "submit",
      },
    ],
    type: [
      {
        required: true,
        message: "放假/补班不能为空",
        trigger: "submit",
      },
    ],
    workRadio: [
      {
        required: true,
        message: "工作工分倍率",
        trigger: "submit",
      },
    ],
    extraRadio: [
      {
        required: true,
        message: "加班工分倍率",
        trigger: "submit",
      },
    ],
  });

  const resetFrom = () => {
    form.id = -1;
    form.date = "";
    form.name = "";
    form.type = "";
    form.workRadio = 1;
    form.extraRadio = 1.5;
  };

  return {
    form,
    rules,
    formRef,
    resetFrom,
  };
}
