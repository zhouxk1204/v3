import Decimal from "decimal.js";

/**
 * 对数组中的元素进行求和。
 * @param array - 要求和的数字数组。
 * @returns 数组中所有元素的总和。
 */
export function sumArray(array: number[]): number {
  // 使用 reduce 方法求和
  const sum = array
    .reduce((acc, curr) => acc.plus(curr), new Decimal(0))
    .toNumber();
  return sum;
}
