export function buildTranslatePrompt(
  summaryJa: string,
  contextSrtJa: string,
  chunkSrtJa: string,
) {
  return `
你是专业的日→中字幕翻译引擎。

翻译要求：
1. 只翻译字幕文本内容（日文 → 中文）
2. 不修改编号
3. 不修改时间轴
4. 保持 SRT 原格式输出
5. 不要输出上下文字幕
6. 不要添加任何说明

【固定翻译表】
- ドラえもん → 哆啦A梦
- のび太 → 大雄
- しずか → 静香
- ジャイアン → 胖虎
- スネ夫 → 小夫

【剧情摘要（日文）】
${summaryJa}

【上下文字幕（仅供理解，不需要输出）】
${contextSrtJa}

【需要翻译的字幕块】
${chunkSrtJa}
`.trim();
}
