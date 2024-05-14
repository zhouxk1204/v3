export interface FileSearchForm {
  name: string;
  typeId: string;
  statusId: string; // '0' '1'
}

export interface FileInfo {
  no: number;
  name: string;
  type: string;
  typeId: string;
  status: string; // '0' '1'
  statusId: string;
  url: string;
  remark: string;
  createBy: string;
  createTime: string;
  updateBy: string;
  updateTime: string;
}

export interface FileForm {
  name: string;
  typeId: string;
  statusId: string;
  remark: string;
  url: string;
  createBy: string;
  updateBy: string;
}
