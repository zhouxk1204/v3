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
