export interface IDayType {
  typeId: string;
  typeName: string;
}

export interface CodeText {
  code: string;
  text: string;
}

export interface ExcelOption {
  title?: string;
  headers: string[];
  data: any[][];
  position?: string;
  // tStartCell?: {
  //   row: string;
  //   col: string;
  // }; // A
  // tStartCol?: {
  //   row: string;
  //   col: string;
  // }; // 1
}
