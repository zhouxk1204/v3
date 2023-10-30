import { RECORD_MARK } from "@/constants";

/**
 * 去除字符串中所有的空格
 * @param {string} inputString
 * @returns {string}
 */
export function removeSpaces(inputString: string): string {
  // 使用正则表达式替换所有空格字符（全角空格和半角空格）
  return inputString.replace(/[\s\u3000]/g, "");
}

/**
 * 将字符串中的全角符号转换为半角符号
 * @param {string} inputString
 * @returns {string}
 */
export function fullWidthToHalfWidth(inputString: string): string {
  // 替换特殊的符号
  RECORD_MARK.forEach((e) => {
    const mark = e.split("");
    const regexPattern = new RegExp(mark[0], "g");
    inputString = inputString.replace(regexPattern, mark[1]);
  });
  // 使用正则表达式替换全角符号
  return inputString.replace(/[\uFF00-\uFFEF]/g, function (match) {
    const charCode = match.charCodeAt(0) - 65248;
    return String.fromCharCode(charCode);
  });
}
