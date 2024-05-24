export interface SearchFormItem {
  label: string;
  field: string;
  type: "input" | "select";
  value: string;
  placeholder?: string;
  options?: { label: string; value: string }[];
}
