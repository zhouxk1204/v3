/**
 * 拼接 COS URL
 * 根据环境变量配置，将相对路径拼接为完整 COS 访问地址
 * @param path - 相对路径，如: song/xxx.jpg 或 /song/xxx.jpg
 * @returns 完整 URL
 */
export function buildCosUrl(path: string): string {
  if (!path) return path;

  const baseUrl = import.meta.env.APP_COS_CNAME; // 末尾已带 /

  // 如果已经是完整 URL，直接返回（兼容老数据/第三方链接）
  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  // 去掉 path 开头的 /
  const normalizedPath = path.replace(/^\/+/, "");

  // baseUrl 已保证末尾有 /
  return `${baseUrl}${normalizedPath}`;
}

/**
 * 批量拼接对象数组中的 COS URL
 * @param data - 数据数组
 * @param urlFields - 需要拼接的 URL 字段名数组
 * @returns 处理后的数据数组
 */
export function buildCosUrlsInArray<T extends Record<string, any>>(
  data: T[],
  urlFields: (keyof T)[],
): T[] {
  return data.map((item) => {
    const newItem = { ...item };
    urlFields.forEach((field) => {
      const value = newItem[field];
      if (typeof value === "string" && value) {
        newItem[field] = buildCosUrl(value) as T[keyof T];
      }
    });
    return newItem;
  });
}
