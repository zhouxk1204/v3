export interface TableHeader {
  key: string;
  label: string;
}

type TableCellEditType = "text" | "date" | "number" | "select";

interface Option {
  label: string;
  value: string;
}

type EditTypeName = "text" | "number" | "date";
type EditTypeName2 = "select";

type EditType<
  T extends {
    editType: EditTypeName | EditTypeName2;
    placeholder?: string;
    clearable?: boolean;
    selectType?: SelectType;
    options?: Options[];
  }
> = T["editType"] extends EditTypeName2
  ? {
      editType: EditTypeName2;
      placeholder?: string;
      clearable?: boolean;
      selectType: SelectType;
      options: Options[];
    }
  : { editType: EditTypeName; placeholder?: string; clearable?: boolean }; // 是否可清空 };

export interface TableColumnItem<T> {
  field: keyof T;
  label: string;
  edit:
    | EditType<{ editType: EditTypeName }>
    | EditType<{ editType: EditTypeName2 }>;
}
