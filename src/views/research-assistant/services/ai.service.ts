/**
 * AI 服务
 */

import { chatCompletions } from '@/api/deepseek/index.api';
import type { ChatRequestBody } from '@/api/deepseek/index.api';
import type { ConceptBlock } from '../types';
import {
  compactPrompt,
  generateConceptBlocksPrompt,
  translateArticlePrompt,
  translateKeywordsPrompt,
  summarizeArticlePrompt
} from '../prompt';

/**
 * AI 生成概念块
 */
export const generateConceptBlocksAI = async (
  topic: string,
  keywords: string,
  clinicalObservation: string
): Promise<ConceptBlock[]> => {
  const requestBody: ChatRequestBody = {
    context: [
      {
        role: 'system',
        content: compactPrompt(generateConceptBlocksPrompt.system)
      },
      {
        role: 'user',
        content: compactPrompt(
          generateConceptBlocksPrompt.user(topic, keywords, clinicalObservation)
        )
      }
    ],
    model: 'deepseek-chat',
    temperature: 0.5
  };

  const response = await chatCompletions(requestBody, 60000);
  const result = response?.choices?.[0]?.message?.content || '';

  if (!result) {
    throw new Error('AI 未返回结果');
  }

  // 解析 JSON 响应
  const jsonMatch = result.match(/\[[\s\S]*\]/);
  if (!jsonMatch) {
    throw new Error('AI 返回格式错误，无法解析');
  }

  const concepts = JSON.parse(jsonMatch[0]);

  // 转换为 ConceptBlock 类型
  return concepts.map((concept: { name: string; keywords: Array<{ text: string; field?: string }> }, index: number) => ({
    id: `block-${Date.now()}-${index}`,
    name: concept.name,
    keywords: concept.keywords.map((kw, kwIndex: number) => ({
      id: `kw-${Date.now()}-${index}-${kwIndex}`,
      text: kw.text,
      field: kw.field || 'tiab',
      operator: 'OR'
    })),
    collapsed: false,
    operator: 'AND'
  }));
};

/**
 * AI 翻译关键词
 */
export const translateKeywordsAI = async (keywords: string[]): Promise<Record<string, string>> => {
  const requestBody: ChatRequestBody = {
    context: [
      {
        role: 'system',
        content: compactPrompt(translateKeywordsPrompt.system)
      },
      {
        role: 'user',
        content: compactPrompt(translateKeywordsPrompt.user(keywords))
      }
    ],
    model: 'deepseek-chat',
    temperature: 0.3
  };

  const response = await chatCompletions(requestBody, 60000);
  const result = response?.choices?.[0]?.message?.content || '';

  if (!result) {
    throw new Error('AI 未返回结果');
  }

  const jsonMatch = result.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('AI 返回格式错误，无法解析');
  }

  return JSON.parse(jsonMatch[0]);
};

/**
 * AI 翻译文章
 */
export const translateArticleAI = async (
  title: string,
  abstract: string
): Promise<{ title: string; abstract: string }> => {
  const requestBody: ChatRequestBody = {
    context: [
      {
        role: 'system',
        content: compactPrompt(translateArticlePrompt.system)
      },
      {
        role: 'user',
        content: compactPrompt(translateArticlePrompt.user(title, abstract))
      }
    ],
    model: 'deepseek-chat',
    temperature: 0.3
  };

  const response = await chatCompletions(requestBody, 60000);
  const result = response?.choices?.[0]?.message?.content || '';

  if (!result) {
    throw new Error('AI 未返回结果');
  }

  const titleMatch = result.match(/【标题】\s*([\s\S]*?)(?=【摘要】|$)/);
  const abstractMatch = result.match(/【摘要】\s*([\s\S]*?)$/);

  return {
    title: titleMatch ? titleMatch[1].trim() : title,
    abstract: abstractMatch ? abstractMatch[1].trim() : abstract
  };
};

/**
 * AI 归纳总结文章
 */
export const summarizeArticleAI = async (
  title: string,
  abstract: string
): Promise<string> => {
  const requestBody: ChatRequestBody = {
    context: [
      {
        role: 'system',
        content: compactPrompt(summarizeArticlePrompt.system)
      },
      {
        role: 'user',
        content: compactPrompt(summarizeArticlePrompt.user(title, abstract))
      }
    ],
    model: 'deepseek-chat',
    temperature: 0.3
  };

  const response = await chatCompletions(requestBody, 60000);
  const result = response?.choices?.[0]?.message?.content || '';

  if (!result) {
    throw new Error('AI 未返回结果');
  }

  return result.trim();
};
