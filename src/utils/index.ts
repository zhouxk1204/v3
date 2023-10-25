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
