import { SelectTypeEnum } from "@/constants";

export interface FormItem {
  label: string;
  field: string;
  type: "text" | "select" | "month" | "number" | "textarea";
  value: string;
  placeholder?: string;
  options?: { label: string; value: string }[];
  step?: number;
}

export type SelectType = (typeof SelectTypeEnum)[keyof typeof SelectTypeEnum];

export interface SelectOption {
  label: string;
  value: string;
}
