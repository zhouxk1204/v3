export interface SearchFormItem {
  label: string;
  field: string;
  type: "text" | "select" | "month" | "number" | "textarea";
  value: string;
  placeholder?: string;
  options?: { label: string; value: string }[];
}
