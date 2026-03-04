// 统一管理所有 AI Prompt

// 工具函数：压缩 Prompt，节省 token
export const compactPrompt = (text: string): string => {
  return text.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();
};

// 生成检索概念块
export const generateConceptBlocksPrompt = {
  system: `医学文献检索专家。根据课题生成结构化检索概念块，关键词须为中文。
输出JSON：
[{"name":"概念名称","keywords":[{"text":"关键词","field":"Mesh|tiab|tw"}]}]
字段：Mesh=医学主题词，tiab=标题摘要，tw=全文。只输出JSON。`,

  user: (topic: string, keywords: string, clinicalObservation: string) =>
    `课题：${topic}\n关键词：${keywords}\n临床观察：${clinicalObservation || '无'}\n生成3-5个概念块，每块2-5个中文关键词。`
};

// 翻译关键词为英文
export const translateKeywordsPrompt = {
  system: `医学术语翻译专家。将中文医学关键词译为准确的英文专业术语。
输出JSON：{"中文词":"English term"}。只输出JSON。`,

  user: (keywords: string[]) => `翻译为英文医学术语：\n${keywords.join('\n')}`
};

// 翻译文献
export const translateArticlePrompt = {
  system: `医学文献翻译专家。将英文文献译为中文，保持专业术语准确性。`,

  user: (title: string, abstract: string) =>
    `翻译以下文献：\n标题：${title}\n摘要：${abstract}\n格式：\n【标题】\n译文\n【摘要】\n译文`
};

// 归纳总结文献
export const summarizeArticlePrompt = {
  system: `医学文献分析专家。请用简洁中文分点归纳文献核心内容，保留关键数据和结果，便于快速确立研究课题。`,

  user: (title: string, abstract: string) =>
    `请归纳以下文献的核心信息，每部分保持1-2句，必要时保留数字或统计结果：\n
标题：${title}\n
摘要：${abstract}\n
请按照以下格式输出：\n
【研究目的】\n
【研究对象与分组】\n
【研究方法】\n
【主要结果】\n
【结论】\n
【课题启发 / Takeaway】\n
其中“课题启发”要求总结这篇文献对未来研究或课题设计的参考价值。`
};