import * as _ from "lodash";

import useStore from "@/store";

/**
 * 引用类型深拷贝
 * @param {T} source
 * @returns {T}
 */
export function deepCopy<T>(source: T): T {
  if (source === null || typeof source !== "object") {
    return source;
  }

  if (Array.isArray(source)) {
    const arrayCopy: any[] = [];
    for (let item of source) {
      arrayCopy.push(deepCopy(item));
    }
    return arrayCopy as T;
  }

  const objectCopy: Record<string, any> = {};
  for (let key in source) {
    if (source.hasOwnProperty(key)) {
      objectCopy[key] = deepCopy(source[key]);
    }
  }

  return objectCopy as T;
}

/**
 * 职工是否存在
 * @param {string} name
 * @returns {boolean} true: employee is exist; false: employee is not exist
 */
export function isEmployeeExist(name: string): boolean {
  return (
    useStore().employee.employeeList.find((e) => e.name === name) !== undefined
  );
}

/**
 * 某字符串是否存在某数组中的元素
 * @param {string} target 某字符串
 * @param {string[]} array
 * @returns {boolean} true: exist; false: not exist
 */
export function isStringExistArrayElement(
  target: string,
  array: string[]
): boolean {
  return array.map((item) => target.indexOf(item) > -1).some((el) => el);
}

type Value = string | number | boolean | object | null | undefined;
export function isEmpty(value: Value): boolean {
  if (value === null || value === undefined) {
    return true;
  }

  if (typeof value === "string" && value.trim() === "") {
    return true;
  }

  if (Array.isArray(value) && value.length === 0) {
    return true;
  }

  if (typeof value === "object" && Object.keys(value).length === 0) {
    return true;
  }

  return false;
}

/**
 * 将相对路径转换为 new URL
 * @param {string} relativePath 相对路径
 * @param {string} baseURL 当前模块的 URL
 * @returns {string} 绝对路径
 */
export function createURL(
  relativePath: string,
  baseURL: string = import.meta.url
): string {
  const absoluteURL = new URL(relativePath, baseURL).href;
  return absoluteURL;
}

/**
 *
 * @param obj1
 * @param obj2
 * @param excludedProperty
 * @returns
 */
export function compareObjectsWithoutProperty(
  obj1: Object,
  obj2: Object,
  excludedProperty: string
) {
  // 复制对象并删除指定属性
  const copy1 = _.omit(obj1, excludedProperty);
  const copy2 = _.omit(obj2, excludedProperty);

  // 使用 _.isEqual 比较对象
  return _.isEqual(copy1, copy2);
}
