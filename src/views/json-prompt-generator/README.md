# Prompt IDE - 自然语言 → JSON Prompt 生成工具

## 项目概述

这是一个专为 AI 工具（Cursor / DeepSeek / ChatGPT API）设计的 Prompt 配置生成器。它能将自然语言描述转换为结构化的 JSON Prompt 配置。

## 核心功能

### 1. 双栏布局
- **左侧**：自然语言输入区
- **右侧**：JSON Prompt 预览和编辑区

### 2. 两种模式

#### 快速模式（Fast）
生成简化的 JSON 结构：
```json
{
  "task": "任务描述",
  "instruction": "详细指令",
  "output_format": "输出格式说明"
}
```

#### 专业模式（Pro）
生成完整的 JSON 结构：
```json
{
  "meta": {
    "version": "1.0",
    "mode": "pro"
  },
  "model": {
    "name": "模型名称",
    "temperature": 0.7
  },
  "roles": {
    "system": "系统角色描述",
    "user_template": "用户输入模板"
  },
  "constraints": ["约束1", "约束2"],
  "output_schema": {
    "字段名": "类型和说明"
  }
}
```

### 3. 工作流程

1. **输入自然语言**：在左侧输入框描述你想要的 Prompt
2. **选择模式**：选择快速模式或专业模式
3. **生成 JSON**：点击"生成 JSON Prompt"按钮
4. **编辑调整**：在右侧编辑器中修改生成的 JSON
5. **校验格式**：点击"校验 JSON"确保格式正确
6. **导出文件**：点击"导出 TS 文件"生成 TypeScript 代码

### 4. 导出格式

导出的 TS 文件格式：
```typescript
export const buildPrompt = () => {
  return {
    // 你的 JSON 配置
  }
}
```

## 使用示例

### 示例 1：肾结石饮食分析

**输入（自然语言）**：
```
创建一个肾结石饮食分析的 Prompt，需要分析用户的饮食记录，
输出风险评分和改善建议。要求只输出 JSON 格式，不要解释文字。
```

**输出（快速模式）**：
```json
{
  "task": "kidney_stone_diet_risk_analysis",
  "instruction": "分析用户饮食记录，评估肾结石风险，提供改善建议",
  "output_format": "JSON with risk_score and suggestions"
}
```

### 示例 2：代码审查助手

**输入（自然语言）**：
```
创建一个代码审查助手，检查代码质量、安全问题和性能优化建议。
需要支持多种编程语言，输出结构化的审查报告。
```

**输出（专业模式）**：
```json
{
  "meta": {
    "version": "1.0",
    "mode": "pro"
  },
  "model": {
    "name": "deepseek-chat",
    "temperature": 0.3
  },
  "roles": {
    "system": "你是代码审查专家，检查代码质量、安全和性能",
    "user_template": "请审查以下代码：{code}"
  },
  "constraints": [
    "只输出 JSON 格式",
    "必须包含具体的改进建议",
    "标注问题的严重程度"
  ],
  "output_schema": {
    "quality_score": "number (0-100)",
    "issues": "array of {type, severity, description, suggestion}",
    "summary": "string"
  }
}
```

## 技术栈

- **前端框架**：Vue 3 + TypeScript
- **UI 框架**：Tailwind CSS + Element Plus
- **AI API**：DeepSeek Chat API
- **代码编辑**：原生 textarea（可升级为 Monaco Editor）

## API 配置

使用 DeepSeek API，配置在 `src/api/deepseek/index.api.ts`：
- 模型：`deepseek-chat`
- Temperature：0.3（确保输出稳定）
- 超时时间：60 秒

## 特性

✅ 实时 JSON 预览  
✅ JSON 格式校验  
✅ 可编辑的 JSON  
✅ 一键导出 TS 文件  
✅ 快速/专业双模式  
✅ 错误提示和状态反馈  
✅ 响应式布局  

## 未来优化方向

1. **代码编辑器升级**：集成 Monaco Editor，提供语法高亮和自动补全
2. **历史记录**：保存生成历史，支持快速复用
3. **模板库**：预设常用 Prompt 模板
4. **批量生成**：支持批量处理多个自然语言输入
5. **版本管理**：支持 Prompt 版本控制和对比
6. **协作功能**：支持团队共享和协作编辑

## 注意事项

- 生成的 JSON 需要人工审核和调整
- 建议先用快速模式测试，再用专业模式细化
- 导出前务必校验 JSON 格式
- 自然语言描述越详细，生成结果越准确
