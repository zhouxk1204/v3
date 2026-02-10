/**
 * 替换 COS URL 的域名
 * 根据环境变量配置，将 URL 中的域名替换为自定义域名或 CNAME
 * @param url - 原始 URL
 * @returns 替换后的 URL
 */
export function replaceCosUrl(url: string): string {
  if (!url) return url;

  const useCustomDomain = import.meta.env.APP_COS_USE_CUSTOM_DOMAIN === '1';
  const targetDomain = useCustomDomain 
    ? `https://${import.meta.env.APP_COS_DOMAIN}` 
    : import.meta.env.APP_COS_CNAME;

  try {
    const urlObj = new URL(url);
    // 提取路径和查询参数
    const pathAndQuery = urlObj.pathname + urlObj.search + urlObj.hash;
    // 组合新的 URL（确保 targetDomain 末尾没有斜杠，pathAndQuery 开头有斜杠）
    return targetDomain.replace(/\/$/, '') + pathAndQuery;
  } catch (error) {
    console.error('Invalid URL:', url, error);
    return url;
  }
}

/**
 * 批量替换对象数组中的 COS URL
 * @param data - 数据数组
 * @param urlFields - 需要替换的 URL 字段名数组
 * @returns 替换后的数据数组
 */
export function replaceCosUrlsInArray<T extends Record<string, any>>(
  data: T[],
  urlFields: (keyof T)[]
): T[] {
  return data.map(item => {
    const newItem = { ...item };
    urlFields.forEach(field => {
      if (newItem[field]) {
        newItem[field] = replaceCosUrl(newItem[field] as string) as T[keyof T];
      }
    });
    return newItem;
  });
}
