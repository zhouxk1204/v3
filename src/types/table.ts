/*
 * @Author: 周小康
 * @Date: 2024-08-20 20:27:30
 * @LastEditors: 周小康
 * @LastEditTime: 2024-08-28 17:04:29
 * @Description: 
 */
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
      } |
      {
        type: "css";
        style: Record<string, string>;
      }
    | undefined;
  width?: number;
}
