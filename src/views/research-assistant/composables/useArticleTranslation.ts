/**
 * 文献翻译和总结 Composable
 */

import { ref, type Ref } from 'vue';
import { marked } from 'marked';
import type { Article } from '../types';
import { translateArticleAI, summarizeArticleAI } from '../services/ai.service';

export type DisplayMode = 'original' | 'translated' | 'summary';

export const useArticleTranslation = (articles: Ref<Article[]>) => {
  const displayMode = ref<DisplayMode>('original');
  const isTranslating = ref(false);

  /**
   * 渲染 Markdown
   */
  const renderMarkdown = (text: string): string => {
    if (!text) return '';
    return marked(text) as string;
  };

  /**
   * 拼接摘要文本
   */
  const joinAbstractSections = (article: Article): string => {
    if (!article.AbstractSections || article.AbstractSections.length === 0) return '';
    return article.AbstractSections
      .map(section => `${section.label ? section.label + ': ' : ''}${section.text}`)
      .join('\n\n');
  };

  /**
   * 翻译单篇文章
   */
  const translateSingleArticle = async (article: Article): Promise<void> => {
    if (article.translatedTitle && article.translatedAbstract) return;

    const abstractText = joinAbstractSections(article);
    const result = await translateArticleAI(article.ArticleTitle, abstractText);

    article.translatedTitle = result.title;
    article.translatedAbstract = result.abstract;
  };

  /**
   * 总结单篇文章
   */
  const summarizeSingleArticle = async (article: Article): Promise<void> => {
    if (article.summary) return;

    const abstractText = joinAbstractSections(article);
    article.summary = await summarizeArticleAI(article.ArticleTitle, abstractText);
  };

  /**
   * 批量翻译文章
   */
  const translateArticles = async () => {
    if (articles.value.length === 0) return;

    isTranslating.value = true;

    try {
      // 并发翻译所有未翻译的文章
      await Promise.all(
        articles.value
          .filter(article => !article.translatedTitle || !article.translatedAbstract)
          .map(article => translateSingleArticle(article))
      );
    } finally {
      isTranslating.value = false;
    }
  };

  /**
   * 批量归纳总结文章
   */
  const summarizeArticles = async () => {
    if (articles.value.length === 0) return;

    isTranslating.value = true;

    try {
      // 并发总结所有未总结的文章
      await Promise.all(
        articles.value
          .filter(article => !article.summary)
          .map(article => summarizeSingleArticle(article))
      );
    } finally {
      isTranslating.value = false;
    }
  };

  /**
   * 切换显示模式
   */
  const switchDisplayMode = async (mode: DisplayMode) => {
    displayMode.value = mode;

    if (mode === 'translated' && articles.value.length > 0) {
      await translateArticles();
    } else if (mode === 'summary' && articles.value.length > 0) {
      await summarizeArticles();
    }
  };

  /**
   * 清空翻译数据
   */
  const clearTranslations = () => {
    articles.value.forEach(article => {
      delete article.translatedTitle;
      delete article.translatedAbstract;
      delete article.summary;
    });
  };

  return {
    // 状态
    displayMode,
    isTranslating,

    // 方法
    renderMarkdown,
    translateArticles,
    summarizeArticles,
    switchDisplayMode,
    clearTranslations
  };
};
