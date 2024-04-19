import Decimal from "decimal.js";

/**
 * 定义操作符枚举类型
 */
export enum OperatorEnum {
  ADD = "+",
  SUBTRACT = "-",
  MULTIPLY = "*",
  DIVIDE = "/",
}

/**
 * 执行加法、减法、乘法或除法，并对结果进行舍入。
 * @param {string | number | Decimal} a - 第一个操作数。
 * @param {string | number | Decimal} b - 第二个操作数。
 * @param {Operator} operator - 操作符，可以是 Operator 枚举类型中的值。
 * @param {number} [precision=2] - 结果的精度，保留小数点后几位，默认为2。
 * @param {Decimal.Rounding} [roundingMode='round'] - 舍入模式，默认为 RoundingMode 枚举类型中的值。number: integer, 包含 0 到 8默认值: 4 (ROUND_HALF_UP 向上靠近最近值)
 * round, toBinary, toDecimalPlaces, toExponential, toFixed, toHexadecimal, toNearest, toOctal, toPrecision, toSignificantDigits
 * @returns {string} 计算结果，保留指定精度并根据指定舍入模式舍入。
 */
export function calculate(
  a: string | number | Decimal,
  b: string | number | Decimal,
  operator: OperatorEnum,
  precision: number = 2,
  roundingMode: Decimal.Rounding = 4
): number {
  // 将输入转换为 Decimal 对象
  const num1 = new Decimal(a);
  const num2 = new Decimal(b);

  // 根据操作符执行相应的运算
  let result: Decimal;
  switch (operator) {
    case OperatorEnum.ADD:
      result = num1.plus(num2);
      break;
    case OperatorEnum.SUBTRACT:
      result = num1.minus(num2);
      break;
    case OperatorEnum.MULTIPLY:
      result = num1.times(num2);
      break;
    case OperatorEnum.DIVIDE:
      result = num1.dividedBy(num2);
      break;
    default:
      throw new Error("Invalid operator");
  }

  // 对结果进行舍入，并保留指定的小数位数
  return result.toDecimalPlaces(precision, roundingMode).toNumber();
}
