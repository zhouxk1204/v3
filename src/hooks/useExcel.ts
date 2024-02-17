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
