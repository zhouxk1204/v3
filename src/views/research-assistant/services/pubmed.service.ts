/**
 * PubMed API 服务
 */

import { MAX_RESULTS, PUBMED_API_BASE, PUBMED_API_KEY } from '../constants';
import type { Article } from '../types';

/**
 * PubMed 搜索响应
 */
export interface PubMedSearchResponse {
  esearchresult: {
    count: string;
    idlist: string[];
  };
}

/**
 * 搜索 PubMed 文献 ID 列表
 */
export const searchPubMedIds = async (term: string): Promise<{
  totalResults: number;
  pmidList: string[];
}> => {
  const searchUrl = `${PUBMED_API_BASE}/esearch.fcgi?db=pubmed&term=${encodeURIComponent(term)}&retmax=${MAX_RESULTS}&retmode=json&api_key=${PUBMED_API_KEY}`;

  const response = await fetch(searchUrl);
  if (!response.ok) {
    throw new Error(`PubMed 搜索失败: ${response.status}`);
  }

  const data: PubMedSearchResponse = await response.json();

  return {
    totalResults: parseInt(data.esearchresult.count, 10),
    pmidList: data.esearchresult.idlist || []
  };
};

/**
 * 获取文献详细信息
 */
export const fetchPubMedArticles = async (pmids: string[]): Promise<Article[]> => {
  if (pmids.length === 0) return [];

  const idParam = pmids.join(',');
  const fetchUrl = `${PUBMED_API_BASE}/efetch.fcgi?db=pubmed&id=${idParam}&retmode=xml&api_key=${PUBMED_API_KEY}`;

  const response = await fetch(fetchUrl);
  if (!response.ok) {
    throw new Error(`PubMed 文献获取失败: ${response.status}`);
  }

  const xmlText = await response.text();
  return parsePubMedXml(xmlText);
};

/**
 * 月份映射
 */
const MONTH_MAP: Record<string, string> = {
  'Jan': '01', 'January': '01',
  'Feb': '02', 'February': '02',
  'Mar': '03', 'March': '03',
  'Apr': '04', 'April': '04',
  'May': '05',
  'Jun': '06', 'June': '06',
  'Jul': '07', 'July': '07',
  'Aug': '08', 'August': '08',
  'Sep': '09', 'September': '09',
  'Oct': '10', 'October': '10',
  'Nov': '11', 'November': '11',
  'Dec': '12', 'December': '12'
};

/**
 * 格式化发布日期
 */
const formatPublicationDate = (year: string, month?: string, day?: string): string => {
  let formattedDate = year;

  if (month) {
    const monthNum = MONTH_MAP[month] || month.padStart(2, '0');
    formattedDate += `-${monthNum}`;

    if (day) {
      formattedDate += `-${day.padStart(2, '0')}`;
    }
  }

  return formattedDate;
};

/**
 * 解析 PubMed XML 响应
 */
const parsePubMedXml = (xmlText: string): Article[] => {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
  const articles: Article[] = [];

  const articleNodes = xmlDoc.getElementsByTagName('PubmedArticle');

  for (let i = 0; i < articleNodes.length; i++) {
    const articleNode = articleNodes[i];

    const pmid = getFirstTextContent(articleNode, 'PMID') || '';
    const title = getFirstTextContent(articleNode, 'ArticleTitle') || '';
    const journalTitle = getFirstTextContent(articleNode, 'Journal', 'Title') || '';
    const authors = parseAuthors(articleNode);

    const abstractSections = parseAbstractSections(articleNode);
    const publicationDate = parsePublicationDate(articleNode);

    articles.push({
      PMID: pmid,
      ArticleTitle: title,
      AbstractSections: abstractSections,
      Authors: authors,
      Journal: journalTitle,
      PublicationDate: publicationDate
    });
  }

  return articles;
};

/**
 * 获取第一个匹配节点的文本内容
 */
const getFirstTextContent = (parentNode: Element, ...tagNames: string[]): string => {
  let currentElement = parentNode;

  for (const tagName of tagNames) {
    const nodes = currentElement.getElementsByTagName(tagName);
    if (nodes.length === 0) return '';
    currentElement = nodes[0];
  }

  return currentElement.textContent || '';
};

/**
 * 解析作者信息
 */
const parseAuthors = (articleNode: Element): string => {
  const authorNodes = articleNode.getElementsByTagName('Author');
  const authors: string[] = [];

  for (let j = 0; j < authorNodes.length; j++) {
    const lastName = getFirstTextContent(authorNodes[j], 'LastName');
    const foreName = getFirstTextContent(authorNodes[j], 'ForeName');

    if (lastName && foreName) {
      authors.push(`${lastName} ${foreName}`);
    }
  }

  return authors.join(', ');
};

/**
 * 解析摘要章节
 */
const parseAbstractSections = (articleNode: Element): Array<{ label: string; text: string }> => {
  const abstractNodes = articleNode.getElementsByTagName('Abstract');
  const sections: Array<{ label: string; text: string }> = [];

  if (abstractNodes.length > 0) {
    const abstractTextNodes = abstractNodes[0].getElementsByTagName('AbstractText');

    for (let j = 0; j < abstractTextNodes.length; j++) {
      const textNode = abstractTextNodes[j];
      const label = textNode.getAttribute('Label') || '';
      const text = textNode.textContent || '';

      if (text) {
        sections.push({ label, text });
      }
    }
  }

  return sections;
};

/**
 * 解析发布日期
 */
const parsePublicationDate = (articleNode: Element): string => {
  const pubDateNodes = articleNode.getElementsByTagName('PubDate');
  if (pubDateNodes.length === 0) return '';

  const year = getFirstTextContent(pubDateNodes[0], 'Year');
  const month = getFirstTextContent(pubDateNodes[0], 'Month');
  const day = getFirstTextContent(pubDateNodes[0], 'Day');

  return formatPublicationDate(year, month, day);
};
