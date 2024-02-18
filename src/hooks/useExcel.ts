import * as XLSX from "xlsx";

import { UploadRawFile } from "element-plus";

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
        console.log("%c Line:23 🍪 sheet", "color:#42b983", sheet);
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

  return {
    parseExcel,
  };
}
