/**
 * 概念块管理 Composable
 */

import { ref } from 'vue';
import type { ConceptBlock, Keyword } from '../types';

export const useConceptBlocks = () => {
  const conceptBlocks = ref<ConceptBlock[]>([]);
  const newKeywordText = ref('');

  /**
   * 添加新概念块
   */
  const addConceptBlock = () => {
    conceptBlocks.value.push({
      id: `block-${Date.now()}`,
      name: '新概念',
      keywords: [],
      collapsed: false,
      operator: 'AND'
    });
  };

  /**
   * 删除概念块
   */
  const deleteConceptBlock = (blockId: string) => {
    conceptBlocks.value = conceptBlocks.value.filter(b => b.id !== blockId);
  };

  /**
   * 切换概念块折叠状态
   */
  const toggleCollapse = (blockId: string) => {
    const block = conceptBlocks.value.find(b => b.id === blockId);
    if (block) {
      block.collapsed = !block.collapsed;
    }
  };

  /**
   * 添加关键词到指定概念块
   */
  const addKeywordToBlock = (blockId: string) => {
    if (!newKeywordText.value.trim()) return;

    const block = conceptBlocks.value.find(b => b.id === blockId);
    if (block) {
      block.keywords.push({
        id: `kw-${Date.now()}`,
        text: newKeywordText.value.trim(),
        field: 'tiab',
        operator: 'OR'
      });
      newKeywordText.value = '';
    }
  };

  /**
   * 删除关键词
   */
  const deleteKeyword = (blockId: string, keywordId: string) => {
    const block = conceptBlocks.value.find(b => b.id === blockId);
    if (block) {
      block.keywords = block.keywords.filter(k => k.id !== keywordId);
    }
  };

  /**
   * 拖拽相关状态
   */
  const draggedKeyword = ref<{ blockId: string; keywordId: string } | null>(null);

  /**
   * 拖拽开始
   */
  const onDragStart = (blockId: string, keywordId: string) => {
    draggedKeyword.value = { blockId, keywordId };
  };

  /**
   * 拖拽结束
   */
  const onDragEnd = () => {
    draggedKeyword.value = null;
  };

  /**
   * 放置关键词
   */
  const onDrop = (targetBlockId: string, targetIndex: number) => {
    if (!draggedKeyword.value) return;

    const sourceBlock = conceptBlocks.value.find(b => b.id === draggedKeyword.value!.blockId);
    const targetBlock = conceptBlocks.value.find(b => b.id === targetBlockId);

    if (!sourceBlock || !targetBlock) return;

    const keywordIndex = sourceBlock.keywords.findIndex(k => k.id === draggedKeyword.value!.keywordId);
    if (keywordIndex === -1) return;

    const [keyword] = sourceBlock.keywords.splice(keywordIndex, 1);
    targetBlock.keywords.splice(targetIndex, 0, keyword);

    draggedKeyword.value = null;
  };

  /**
   * 生成检索式
   */
  const generateTerm = (blocks: ConceptBlock[], useEnglish = false, translations?: Record<string, string>): string => {
    if (blocks.length === 0) return '';

    const blockTerms = blocks.map((block, blockIndex) => {
      if (block.keywords.length === 0) return '';

      const keywordTerms = block.keywords.map((keyword, kwIndex) => {
        const text = useEnglish && translations ? translations[keyword.text] || keyword.text : keyword.text;
        const prefix = kwIndex > 0 ? ` ${keyword.operator} ` : '';
        return `${prefix}"${text}"[${keyword.field}]`;
      }).join('');

      const blockTerm = block.keywords.length > 1 ? `(${keywordTerms})` : keywordTerms;
      const operator = blockIndex > 0 ? ` ${block.operator} ` : '';

      return `${operator}${blockTerm}`;
    }).filter(t => t).join('');

    return blockTerms;
  };

  /**
   * 清空所有概念块
   */
  const clearConceptBlocks = () => {
    conceptBlocks.value = [];
    newKeywordText.value = '';
  };

  /**
   * 收集所有关键词
   */
  const collectAllKeywords = (blocks: ConceptBlock[]): string[] => {
    return blocks.flatMap(block => block.keywords.map(kw => kw.text));
  };

  return {
    // 状态
    conceptBlocks,
    newKeywordText,
    draggedKeyword,

    // 方法
    addConceptBlock,
    deleteConceptBlock,
    toggleCollapse,
    addKeywordToBlock,
    deleteKeyword,
    onDragStart,
    onDragEnd,
    onDrop,
    generateTerm,
    clearConceptBlocks,
    collectAllKeywords
  };
};
