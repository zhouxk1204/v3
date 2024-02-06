import { type FormItemRule } from "element-plus";

type FormItemType = "text" | "date" | "number" | "select";

interface Option {
  label: string;
  value: string | number;
}

export interface FieldItem {
  label: string;
  field: string;
  type: FormItemType;
  value: number | string;
  placeholder?: string;
  options?: Option[]; // 当 type 为 select 时，必须有 options 属性
  rules?: FormItemRule[];
  clearable?: boolean; // 是否可清空
  disabled?: boolean;
}
