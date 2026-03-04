// 关键词类型定义
export interface Keyword {
  id: string;
  text: string;
  field: 'Mesh' | 'tiab' | 'tw';
  operator: 'OR' | 'NOT';
}

// 概念块类型定义
export interface ConceptBlock {
  id: string;
  name: string;
  keywords: Keyword[];
  collapsed: boolean;
  operator: 'AND' | 'OR';
}

// 摘要章节类型定义
export interface AbstractSection {
  label: string;
  text: string;
}

// 文献文章类型定义
export interface Article {
  PMID: string;
  ArticleTitle: string;
  AbstractSections: AbstractSection[];
  Authors: string;
  Journal: string;
  PublicationDate: string;
  // 翻译相关
  translatedTitle?: string;
  translatedAbstract?: string;
  // 总结
  summary?: string;
}

// 显示模式类型
export type DisplayMode = 'original' | 'translated' | 'summary';
