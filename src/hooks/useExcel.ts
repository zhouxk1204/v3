import * as ExcelJS from "exceljs";
import * as XLSX from "xlsx";

import { UploadRawFile } from "element-plus";
import { Workbook } from "exceljs";
import saveAs from "file-saver";

export interface ExportExcelOption {
  title?: string;
  headers: string[];
  data: any[];
  startCell?: string; // A1?
  remark?: string;
}

export function useExcel() {
  /**
   * 解析excel
   * @param {File} file
   * @param {number} sheetIndex
   * @returns {Promise<any[]>}
   */
  const parseExcel = (
    file: UploadRawFile,
    sheetName: string
  ): Promise<any[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        const data = e.target!.result;
        const workbook = XLSX.read(data, { type: "array" });
        const sheet = workbook.Sheets[sheetName || workbook.SheetNames[0]];
        if (!sheet) {
          reject(`该excel中找不到sheet：${sheetName}`);
        }
        resolve(XLSX.utils.sheet_to_json(sheet));
      };

      reader.onerror = (error) => {
        reject(error);
      };

      reader.readAsArrayBuffer(file);
    });
  };

  /**
   * 导出excel
   * @param exportExcelOptions
   * @param fileName
   * @param sheetName
   */
  const exportExcel = (
    exportExcelOptions: ExportExcelOption[],
    fileName: string,
    sheetName?: string
  ) => {
    // 创建 Workbook 和 Worksheet
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet(sheetName || fileName);

    for (let exportExcelOption of exportExcelOptions) {
      const { title = "", remark = "", headers, data } = exportExcelOption;

      let startCellCode = exportExcelOption.startCell || "A1";
      let currentCellRow = +startCellCode.replace(/[a-zA-Z]+/g, ""); // 1

      // 表格标题行
      if (title.length > 0) {
        const titleCell = worksheet.getCell(startCellCode);
        titleCell.value = title;
        setCellBorder(titleCell);
        setCellAlignment(titleCell);
        // 合并单元格
        const endCellCode = getCellPosition(
          startCellCode,
          headers.length - 1,
          "right"
        );
        worksheet.mergeCells(`${startCellCode}:${endCellCode}`);
      }

      // 表头行
      currentCellRow = title.length > 0 ? currentCellRow + 1 : currentCellRow;
      startCellCode = getCellPosition(startCellCode, currentCellRow, "down");
      const headerStartCell = worksheet.getCell(startCellCode);
      for (let i = 0; i < headers.length; i++) {
        const cell = worksheet.getCell(
          headerStartCell.row,
          headerStartCell.col + i
        );
        const val = headers[i] ?? "unknown";
        cell.value = val;
        setCellBorder(cell);
        setCellAlignment(cell);
        // 设置表格宽度
        let chVal = val.match(/[\u4e00-\u9fa5]/g)
          ? val.match(/[\u4e00-\u9fa5]/g)?.join("") ?? ""
          : "";
        let engVal = val.replace(/([^\u0000-\u00FF])/g, "") || "";
        const strLen = chVal.length * 2 + engVal.length * 1.5 + 4;
        worksheet.getColumn(i + 1).width = strLen;
      }

      // 数据行
      startCellCode = getCellPosition(startCellCode, currentCellRow, "down");
      const dataStartCell = worksheet.getCell(startCellCode);
      for (let i = 0; i < data.length; i++) {
        const row = data[i];
        for (let j = 0; j < row.length; j++) {
          const cell = worksheet.getCell(
            dataStartCell.row + i,
            dataStartCell.col + j
          );
          cell.value = row[j];
          setCellBorder(cell);
          setCellAlignment(cell);
        }
      }

      // 备注行
      if (remark.length > 0) {
        currentCellRow = currentCellRow + data.length;
        startCellCode = getCellPosition(startCellCode, currentCellRow, "down");
        worksheet.getCell(startCellCode).value = remark;
      }
    }

    // 将 Workbook 写入缓冲区，并保存为 Excel 文件
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      saveAs(blob, `${fileName}.xlsx`);
    });
  };

  return {
    parseExcel,
    exportExcel,
  };
}

/**
 * 设置单元格边框
 * @param cell 单元格对象
 * @returns 无返回值，修改传入的cell对象的border属性
 */
function setCellBorder(cell: ExcelJS.Cell) {
  // 将传入的cell对象的边框属性分别设置为细线样式
  cell.border = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" },
  };
}

/**
 * 设置单元格对齐方式
 * @param cell 单元格对象
 * @param vertical 垂直对齐方式，可选值为"top"（顶部对齐）、"middle"（居中对齐，默认值）或"bottom"（底部对齐）
 * @param horizontal 水平对齐方式，可选值为"left"（左对齐）、"center"（居中对齐，默认值）或"right"（右对齐）
 * @returns 无返回值，修改传入的cell对象的alignment属性
 */
function setCellAlignment(
  cell: ExcelJS.Cell,
  vertical: "top" | "middle" | "bottom" = "middle",
  horizontal: "left" | "center" | "right" = "center"
): void {
  // 将传入的垂直和水平对齐方式赋值给cell对象的alignment属性
  cell.alignment = { vertical, horizontal };
}

/**
 * 获取移动后的位置
 * @param {string} sPosition 起始位置
 * @param {number} steps 移动距离
 * @param { "down" | "right"} direction 移动方向
 * @returns {string} cell position
 */
function getCellPosition(
  sPosition: string,
  steps: number,
  direction: "down" | "right"
): string {
  if (steps === 0) {
    return sPosition;
  }
  const row = +sPosition.replace(/[a-zA-Z]+/g, ""); // 1
  const col = sPosition.replace(/\d+/g, ""); // A
  if (direction === "right") {
    const num = colLetterToNum(col) + steps;
    return `${numToColLetter(num)}${row}`;
  } else {
    return `${col}${row + steps - 1}`;
  }
}

/**
 * 将列序号转为列字母
 * @param {number} colNum 列序号
 * @returns {string} 列字母
 */
function numToColLetter(colNum: number): string {
  const stringArray: string[] = [];
  const numToStringAction = (colNum: number) => {
    let num = colNum - 1;
    const a = parseInt((num / 26).toString());
    const b = num % 26;
    stringArray.push(String.fromCharCode(64 + parseInt((b + 1).toString())));
    if (a > 0) {
      numToStringAction(a);
    }
  };
  numToStringAction(colNum);
  return stringArray.reverse().join("");
}

/**
 * 将列字母转为列序号
 * @param {string} letter 列字母
 * @returns {number} 列序号
 */
function colLetterToNum(letter: string) {
  var str = letter.toLowerCase().split("");
  var al = str.length;
  var getCharNumber = (char: any) => {
    return char.charCodeAt() - 96;
  };
  var numout = 0;
  var charnum = 0;
  for (var i = 0; i < al; i++) {
    charnum = getCharNumber(str[i]);
    numout += charnum * Math.pow(26, al - i - 1);
  }
  return numout;
}
