/**
 * 常量配置
 */

// API 配置
export const PUBMED_API_KEY = import.meta.env.PUBMED_API_KEY || 'fcf657ff78e5f612a9e31d3f11d2f24ed308';
export const PUBMED_API_BASE = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils';

// 分页配置
export const RESULTS_PER_PAGE = 5;
export const MAX_RESULTS = 100;

// 字段选项
export const FIELD_OPTIONS = [
  { value: 'Mesh', label: '主题词', description: '医学主题词，标准化的医学术语' },
  { value: 'tiab', label: '标题+摘要', description: '在文章标题和摘要中搜索' },
  { value: 'tw', label: '全文', description: '在文章全文中搜索' }
] as const;

// 操作符选项
export const KEYWORD_OPERATORS = [
  { value: 'OR', label: '或者满足', description: '满足任一条件即可' },
  { value: 'NOT', label: '排除', description: '排除包含该关键词的文献' }
] as const;

export const BLOCK_OPERATORS = [
  { value: 'AND', label: '同时满足', description: '必须同时满足多个条件' },
  { value: 'OR', label: '或者满足', description: '满足任一条件即可' }
] as const;

// 防抖延迟
export const SAVE_DEBOUNCE_MS = 500;
