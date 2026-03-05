# AI 课题科研助手 - 优化文档

## 📁 优化后的文件结构

```
src/views/research-assistant/
├── index.vue                    # 主组件（从 1100+ 行优化到 ~180 行）
├── meta.ts                     # 路由元数据
├── types.ts                    # TypeScript 类型定义
├── prompt.ts                   # AI Prompt 模板
├── constants.ts                # 常量配置
├── components/                 # 子组件
│   ├── index.ts               # 组件导出
│   ├── LoadingModal.vue        # 全屏加载遮罩
│   ├── TopicInput.vue          # 课题信息输入
│   ├── ConceptBlockEditor.vue  # 概念块编辑器
│   └── ArticleList.vue        # 文献列表
├── composables/                # 组合式函数
│   ├── index.ts               # Composables 导出
│   ├── useConceptBlocks.ts    # 概念块管理
│   ├── usePubMedSearch.ts     # PubMed 搜索
│   ├── useArticleTranslation.ts # 文献翻译总结
│   └── useCopyToClipboard.ts  # 复制功能
└── services/                   # API 服务
    ├── index.ts               # 服务导出
    ├── pubmed.service.ts      # PubMed API
    └── ai.service.ts         # AI API
```

## ✨ 优化亮点

### 1. 代码拆分
- **主组件从 1100+ 行减少到 ~180 行**
- 将复杂逻辑拆分为独立的 composables
- 将大型组件拆分为可复用的子组件

### 2. 架构优化

#### Services 层
- **[pubmed.service.ts](services/pubmed.service.ts)** - PubMed API 封装
  - 搜索文献 ID
  - 获取文献详情
  - XML 解析

- **[ai.service.ts](services/ai.service.ts)** - AI API 封装
  - 生成概念块
  - 翻译关键词
  - 翻译文献
  - 归纳总结

#### Composables 层
- **[useConceptBlocks.ts](composables/useConceptBlocks.ts)** - 概念块管理
  - 添加/删除概念块
  - 添加/删除关键词
  - 拖拽排序
  - 生成检索式

- **[usePubMedSearch.ts](composables/usePubMedSearch.ts)** - PubMed 搜索
  - 搜索文献
  - 分页管理
  - 结果缓存

- **[useArticleTranslation.ts](composables/useArticleTranslation.ts)** - 翻译总结
  - 批量翻译（并发）
  - 批量总结（并发）
  - 显示模式切换

- **[useCopyToClipboard.ts](composables/useCopyToClipboard.ts)** - 复制功能
  - 剪贴板操作
  - 成功提示

#### Components 层
- **[LoadingModal.vue](components/LoadingModal.vue)** - 加载遮罩
  - 可配置标题、消息、提示
  - 过渡动画

- **[TopicInput.vue](components/TopicInput.vue)** - 输入表单
  - 双向绑定支持
  - 表单验证

- **[ConceptBlockEditor.vue](components/ConceptBlockEditor.vue)** - 检索式编辑器
  - 可视化编辑
  - 拖拽排序
  - 实时预览

- **[ArticleList.vue](components/ArticleList.vue)** - 文献列表
  - 多种显示模式
  - 分页支持
  - Markdown 渲染

### 3. 代码质量提升

#### 类型安全
- 移除所有 `any` 类型
- 完整的 TypeScript 类型定义
- 严格的类型检查

#### 错误处理
- 统一的错误处理机制
- 使用 Element Plus 消息提示
- 友好的用户反馈

#### 常量管理
- **[constants.ts](constants.ts)** - 集中管理配置
  - API 配置
  - 分页配置
  - 字段选项

#### 性能优化
- 批量翻译/总结（并发请求）
- 防抖保存（500ms）
- 按需加载数据

### 4. 可维护性提升

- 清晰的文件结构
- 职责分离
- 易于测试
- 易于扩展

### 5. 用户体验改进

- 统一的加载状态
- 友好的错误提示
- 流畅的过渡动画
- 更好的响应式设计

## 🚀 使用方式

### 在主组件中使用

```typescript
import { useConceptBlocks, usePubMedSearch, useArticleTranslation } from './composables';
import { LoadingModal, TopicInput, ConceptBlockEditor, ArticleList } from './components';

// 使用 composables
const {
  conceptBlocks,
  addConceptBlock,
  generateTerm
} = useConceptBlocks();

const { searchPubMed, pubmedResults } = usePubMedSearch();

const { switchDisplayMode, displayMode } = useArticleTranslation(pubmedResults);
```

### 直接使用 Services

```typescript
import { searchPubMedIds, fetchPubMedArticles } from './services';
import { generateConceptBlocksAI, translateArticleAI } from './services';

// 搜索文献
const { totalResults, pmidList } = await searchPubMedIds(term);
const articles = await fetchPubMedArticles(pmidList);

// AI 生成概念块
const blocks = await generateConceptBlocksAI(topic, keywords, observation);

// AI 翻译文献
const { title, abstract } = await translateArticleAI(title, abstract);
```

## 📝 开发建议

### 添加新功能
1. 确定功能属于哪个层次（Service / Composable / Component）
2. 在对应目录创建文件
3. 在 `index.ts` 中导出
4. 在主组件中引入使用

### 修改现有功能
1. 找到对应的 Service / Composable / Component
2. 修改对应文件
3. 主组件通常无需修改

### 测试建议
- 单元测试：测试 Services 和 Composables
- 组件测试：测试各个子组件
- E2E 测试：测试完整流程

## 🔧 配置说明

### 环境变量

在 `.env.development` 或 `.env.production` 中配置：

```env
# PubMed API Key（可选）
PUBMED_API_KEY=your_api_key_here
```

如果未配置，将使用默认的 API Key。

## 📦 依赖说明

- `marked` - Markdown 渲染
- `element-plus` - UI 组件库
- `@/api/deepseek` - DeepSeek API 客户端
- `@/store/paper` - 课题信息 Store

## 🎯 后续优化建议

1. **添加单元测试**
   - 为 Services 添加测试
   - 为 Composables 添加测试

2. **性能监控**
   - 添加 API 响应时间监控
   - 添加错误日志收集

3. **国际化**
   - 将文本提取到 i18n 配置
   - 支持多语言

4. **离线支持**
   - 添加 Service Worker
   - 缓存已翻译的文章

5. **高级功能**
   - 保存检索历史
   - 导出文献为 PDF
   - 批量导出功能
