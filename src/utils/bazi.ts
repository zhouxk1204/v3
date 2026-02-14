// src/utils/bazi.ts
// lunar-javascript 没有官方类型，这里用 any 兜底
// 你也可以自己补 d.ts
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

  const priority = buildPriorityByGender(strong, lack, input.gender);

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

function buildPriorityByGender(
  lack: WuXing[],
  strong: WuXing[],
  gender: Gender
) {
  const baseOrder = [...lack]; // 缺什么补什么

  // 性别只影响排序，不直接指定五行
  if (gender === 'female') {
    // 柔性五行稍微靠前
    baseOrder.sort((a, b) => {
      const soft = ['水', '木'];
      return (soft.includes(b) ? 1 : 0) - (soft.includes(a) ? 1 : 0);
    });
  } else {
    // 刚性五行稍微靠前
    baseOrder.sort((a, b) => {
      const hard = ['金', '火'];
      return (hard.includes(b) ? 1 : 0) - (hard.includes(a) ? 1 : 0);
    });
  }

  return {
    main: baseOrder[0],
    secondary: baseOrder[1],
    avoid: strong,
  };
}

function buildWeights(priority: {
  main: WuXing;
  secondary?: WuXing;
  avoid: WuXing[];
}) {
  const base: Record<WuXing, number> = {
    金: 0.2,
    木: 0.2,
    水: 0.2,
    火: 0.2,
    土: 0.2,
  };

  base[priority.main] = 1.0;

  if (priority.secondary) {
    base[priority.secondary] = 0.6;
  }

  priority.avoid.forEach((wx) => {
    base[wx] = 0.1;
  });

  return base;
}
