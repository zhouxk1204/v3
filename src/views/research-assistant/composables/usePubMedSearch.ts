/**
 * PubMed 搜索 Composable
 */

import { ref, computed } from 'vue';
import { RESULTS_PER_PAGE } from '../constants';
import type { Article } from '../types';
import { fetchPubMedArticles, searchPubMedIds } from '../services/pubmed.service';

export const usePubMedSearch = () => {
  const isSearching = ref(false);
  const pubmedResults = ref<Article[]>([]);
  const totalResults = ref(0);
  const currentPage = ref(1);
  const pmidList = ref<string[]>([]);

  /**
   * 总页数
   */
  const totalPages = computed(() => {
    return Math.ceil(pmidList.value.length / RESULTS_PER_PAGE);
  });

  /**
   * 搜索 PubMed
   */
  const searchPubMed = async (term: string) => {
    if (!term) return;

    isSearching.value = true;
    pubmedResults.value = [];
    currentPage.value = 1;

    try {
      const result = await searchPubMedIds(term);
      totalResults.value = result.totalResults;
      pmidList.value = result.pmidList;

      if (pmidList.value.length === 0) {
        throw new Error('未找到相关文献');
      }

      await fetchPageData(1);
    } finally {
      isSearching.value = false;
    }
  };

  /**
   * 获取指定页的数据
   */
  const fetchPageData = async (page: number) => {
    isSearching.value = true;

    try {
      const startIndex = (page - 1) * RESULTS_PER_PAGE;
      const endIndex = Math.min(startIndex + RESULTS_PER_PAGE, pmidList.value.length);
      const pagePmids = pmidList.value.slice(startIndex, endIndex);

      if (pagePmids.length === 0) {
        pubmedResults.value = [];
        return;
      }

      pubmedResults.value = await fetchPubMedArticles(pagePmids);
    } finally {
      isSearching.value = false;
    }
  };

  /**
   * 下一页
   */
  const nextPage = async () => {
    if (currentPage.value < totalPages.value) {
      currentPage.value++;
      await fetchPageData(currentPage.value);
    }
  };

  /**
   * 上一页
   */
  const prevPage = async () => {
    if (currentPage.value > 1) {
      currentPage.value--;
      await fetchPageData(currentPage.value);
    }
  };

  /**
   * 清空搜索结果
   */
  const clearResults = () => {
    pubmedResults.value = [];
    totalResults.value = 0;
    currentPage.value = 1;
    pmidList.value = [];
  };

  return {
    // 状态
    isSearching,
    pubmedResults,
    totalResults,
    currentPage,
    totalPages,
    pmidList,

    // 方法
    searchPubMed,
    fetchPageData,
    nextPage,
    prevPage,
    clearResults
  };
};
