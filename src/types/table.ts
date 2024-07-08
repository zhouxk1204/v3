export enum TagType {
  primary = "primary",
  danger = "danger",
  warning = "warning",
  info = "info",
  success = "success",
}

export interface TableColumn {
  field: string;
  label: string;
  style?:
    | {
        type: "tag";
        color: (...args: any[]) => TagType;
      }
    | undefined;
  width?: number;
}
