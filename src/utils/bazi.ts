// src/utils/bazi.ts
import { Lunar } from 'lunar-javascript';

export type Gender = 'male' | 'female';

export interface BirthInput {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  gender: Gender;
}

export type WuXing = '金' | '木' | '水' | '火' | '土';

export interface BaziProfile {
  eightChar: string;
  pillars: string[];
  wuXingCount: Record<WuXing, number>;
  strong: WuXing[];
  lack: WuXing[];
  priority: {
    main: WuXing;
    secondary?: WuXing;
    avoid: WuXing[];
  };
  weights: Record<WuXing, number>;
}

/** 天干五行 */
const GAN_WUXING_MAP: Record<string, WuXing> = {
  甲: '木', 乙: '木',
  丙: '火', 丁: '火',
  戊: '土', 己: '土',
  庚: '金', 辛: '金',
  壬: '水', 癸: '水',
};

/** 地支五行（主气） */
const ZHI_WUXING_MAP: Record<string, WuXing> = {
  子: '水', 丑: '土',
  寅: '木', 卯: '木',
  辰: '土', 巳: '火',
  午: '火', 未: '土',
  申: '金', 酉: '金',
  戌: '土', 亥: '水',
};

export function calcBaziProfile(input: BirthInput): BaziProfile {
  const lunar: any = (Lunar as any).fromYmdHms(
    input.year,
    input.month,
    input.day,
    input.hour,
    input.minute,
    0
  );

  const eightChar: any = lunar.getEightChar();

  const pillars: string[] = [
    eightChar.getYear(),
    eightChar.getMonth(),
    eightChar.getDay(),
    eightChar.getTime(),
  ];

  const wuXingCount: Record<WuXing, number> = {
    金: 0,
    木: 0,
    水: 0,
    火: 0,
    土: 0,
  };

  pillars.forEach((gz) => {
    const gan = gz.charAt(0);
    const zhi = gz.charAt(1);

    const ganWx = GAN_WUXING_MAP[gan];
    const zhiWx = ZHI_WUXING_MAP[zhi];

    if (ganWx) wuXingCount[ganWx]++;
    if (zhiWx) wuXingCount[zhiWx]++;
  });

  const { strong, lack } = analyzeWuXing(wuXingCount);

  const priority = buildPriorityByGender(lack, strong, input.gender);

  const weights = buildWeights(priority);

  return {
    eightChar: pillars.join(' '),
    pillars,
    wuXingCount,
    strong,
    lack,
    priority,
    weights,
  };
}

function analyzeWuXing(wuXingCount: Record<WuXing, number>) {
  const entries = Object.entries(wuXingCount) as [WuXing, number][];
  const values = entries.map(([, v]) => v);

  const max = Math.max(...values);
  const min = Math.min(...values);

  const strong = entries.filter(([, v]) => v === max).map(([k]) => k);
  const lack = entries.filter(([, v]) => v === min).map(([k]) => k);

  return { strong, lack };
}

/**
 * 命理优先级构建
 * - 缺什么补什么（主逻辑）
 * - 性别只影响优先顺序，不直接决定五行
 */
function buildPriorityByGender(
  lack: WuXing[],
  strong: WuXing[],
  gender: Gender
) {
  const baseOrder = [...lack];

  if (gender === 'female') {
    const soft: WuXing[] = ['水', '木'];
    baseOrder.sort((a, b) => {
      return (soft.includes(b) ? 1 : 0) - (soft.includes(a) ? 1 : 0);
    });
  } else {
    const hard: WuXing[] = ['金', '火'];
    baseOrder.sort((a, b) => {
      return (hard.includes(b) ? 1 : 0) - (hard.includes(a) ? 1 : 0);
    });
  }

  return {
    main: baseOrder[0],
    secondary: baseOrder[1],
    avoid: strong,
  };
}

/**
 * 权重模型（命理权重核心）
 */
function buildWeights(priority: {
  main: WuXing;
  secondary?: WuXing;
  avoid: WuXing[];
}) {
  const base: Record<WuXing, number> = {
    金: 0.3,
    木: 0.3,
    水: 0.3,
    火: 0.3,
    土: 0.3,
  };

  // 主补
  base[priority.main] = 1.0;

  // 次补
  if (priority.secondary && priority.secondary !== priority.main) {
    base[priority.secondary] = 0.6;
  }

  // 忌加强（如果与主补冲突，主补优先）
  priority.avoid.forEach((wx) => {
    if (wx !== priority.main && wx !== priority.secondary) {
      base[wx] = 0.1;
    }
  });

  return base;
}