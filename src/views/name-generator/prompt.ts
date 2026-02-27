// src/views/name/prompt.ts
import { BaziProfile } from '@/utils/bazi';

export interface PromptOptions {
  surname: string;
  usedNameParts: string[];
  mother: string;
  gender: 'male' | 'female';
  styleLabel: string;
  styleDesc: any; // 改为any类型以支持JSON对象
  nameLength: 2 | 3 | 4;
  nameCount: number;
  baziProfile?: BaziProfile;
  enableZibei?: boolean;
  zibeiChar?: string;
}

/** 构建JSON格式提示词，姓名风格权重最高 */
export function buildStructuredPrompt(options: PromptOptions): string {
  const {
    surname,
    usedNameParts,
    mother,
    gender,
    styleLabel,
    styleDesc,
    nameLength,
    nameCount,
    baziProfile,
    enableZibei,
    zibeiChar
  } = options;

  // 禁用的字辈组合
  const forbiddenZibeiCombos: string[] = [];

  // 构建JSON格式的约束规则
  const constraints: any = {
    priority: "姓名风格是最高优先级，其他规则在满足风格的前提下执行",
    requestId: Date.now(),
    rules: {
      // 优先级1：姓名风格（最高）
      style: {
        priority: 1,
        name: styleLabel,
        details: styleDesc,
        requirement: "所有名字必须严格符合此风格，这是最重要的约束"
      },
      
      // 优先级2：基础规则
      basic: {
        priority: 2,
        surname: surname,
        gender: gender === 'male' 
          ? '男孩：用字应阳刚、大气、有力量感' 
          : '女孩：用字应柔美、优雅、有气质',
        count: nameCount,
        uniqueness: "所有名字必须互不相同"
      },
      
      // 优先级3：字辈规则（如果启用）
      zibei: enableZibei && zibeiChar ? {
        priority: 3,
        enabled: true,
        char: zibeiChar,
        format: `${surname}${zibeiChar}X`,
        requirement: `所有名字必须为三字名，第二个字固定为「${zibeiChar}」`
      } : {
        enabled: false
      },
      
      // 优先级4：字数规则
      length: {
        priority: 4,
        requirement: enableZibei && zibeiChar 
          ? `全部为三字名，格式：${surname}${zibeiChar}X`
          : nameLength === 2 
            ? '全部为两字名' 
            : nameLength === 3
              ? '全部为三字名'
              : nameLength === 4
                ? '全部为四字名'
                : '包含两字名、三字名、四字名各至少1个'
      },
      
      // 优先级5：五行补缺（如果启用）
      wuxing: baziProfile ? {
        priority: 5,
        enabled: true,
        main: baziProfile.priority.main,
        secondary: baziProfile.priority.secondary,
        avoid: baziProfile.priority.avoid,
        requirement: `名字中必须包含≥1个「${baziProfile.priority.main}」属性字，避免强化${baziProfile.priority.avoid.join('、')}属性`,
        self_check: [
          "逐行检查五行属性",
          "发现不符合必须重新生成",
          "所有名字通过检查后才允许输出"
        ]
      } : {
        enabled: false
      },
      
      // 优先级6：稀有度
      rarity: {
        priority: 6,
        options: ["普通", "稀有", "最佳"],
        limits: {
          best: { max: 1, description: "最多1个「最佳」" },
          rare: { max: 2, min: 1, description: "至少1个「稀有」" }
        }
      },
      
      // 禁用规则
      forbidden: {
        usedNames: usedNameParts.length > 0 ? usedNameParts : [],
        combinations: forbiddenZibeiCombos,
        parentNames: {
          mother: mother || "未提供",
          requirement: "不得直接使用母亲完整姓名"
        }
      }
    },
    
    output: {
      format: "名字|寓意|稀有度",
      count: nameCount,
      example: `${surname}明|光明磊落，前程似锦|稀有`,
      strict: "只输出指定格式的结果，不要任何解释或额外文本"
    }
  };

  return `请根据以下JSON约束生成${nameCount}个中文名字。注意：姓名风格是最高优先级，所有名字必须严格符合指定风格。

${JSON.stringify(constraints, null, 2)}

重要提醒：
1. 姓名风格「${styleLabel}」是最高优先级，必须严格遵守
2. 在满足风格的前提下，再依次满足其他规则
3. 每行输出格式：名字|寓意|稀有度
4. 不要输出任何解释或额外内容`;
}
