<template>
  <div class="overflow-auto px-4 py-8 h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
    <div class="mx-auto max-w-5xl">
      <!-- 标题 -->
      <div class="mb-8 text-center">
        <h1 class="mb-2 text-3xl font-bold text-gray-800">抽卡取名</h1>
        <p class="text-gray-600">根据父母姓名与风格，生成带寓意的好名字，点击卡片翻转查看寓意</p>
      </div>

      <!-- 输入区 -->
      <div class="p-6 mb-6 bg-white rounded-2xl shadow-xl">
        <!-- 父母姓名 -->
        <div class="grid grid-cols-1 gap-4 mb-6 sm:grid-cols-2">
          <div>
            <label class="block mb-2 text-sm font-medium text-gray-700">父亲姓名 <span class="text-red-500">*</span></label>
            <input v-model="fatherName" type="text" placeholder="请输入父亲姓名（生成的姓与父亲一致）"
              class="px-4 py-3 w-full rounded-lg border border-gray-300 transition-all focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              :disabled="isGenerating" />
            <p v-if="fatherSurname" class="mt-1 text-xs text-gray-500">本次生成的名字将姓「{{ fatherSurname }}」</p>
          </div>
          <div>
            <label class="block mb-2 text-sm font-medium text-gray-700">母亲姓名</label>
            <input v-model="motherName" type="text" placeholder="请输入母亲姓名（用于参考）"
              class="px-4 py-3 w-full rounded-lg border border-gray-300 transition-all focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              :disabled="isGenerating" />
          </div>
        </div>

        <!-- 孩子性别 -->
        <div class="mb-6">
          <label class="block mb-3 text-sm font-medium text-gray-700">孩子性别 <span class="text-red-500">*</span></label>
          <div class="inline-flex overflow-hidden rounded-lg border border-gray-200 shadow-sm">
            <button @click="childGender = 'male'" :class="[
              'px-6 py-2.5 text-sm font-medium transition-all border-r border-gray-200',
              childGender === 'male'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            ]" :disabled="isGenerating">
              男孩
            </button>
            <button @click="childGender = 'female'" :class="[
              'px-6 py-2.5 text-sm font-medium transition-all',
              childGender === 'female'
                ? 'bg-pink-500 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            ]" :disabled="isGenerating">
              女孩
            </button>
          </div>
          <p class="mt-2 text-xs text-gray-500">性别将作为取名的重要参考，影响用字风格与寓意</p>
        </div>

        <!-- 五行补缺开关 -->
        <div class="mb-6">
          <label class="block mb-3 text-sm font-medium text-gray-700">五行补缺</label>
          <div class="inline-flex overflow-hidden rounded-lg border border-gray-200 shadow-sm">
            <button @click="enableWuXing = false" :class="[
              'px-6 py-2.5 text-sm font-medium transition-all border-r border-gray-200',
              !enableWuXing
                ? 'bg-gray-500 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            ]" :disabled="isGenerating">
              关闭
            </button>
            <button @click="enableWuXing = true" :class="[
              'px-6 py-2.5 text-sm font-medium transition-all',
              enableWuXing
                ? 'bg-amber-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            ]" :disabled="isGenerating">
              启用
            </button>
          </div>
          <p class="mt-2 text-xs text-gray-500">启用后将根据八字五行生成名字，作为最高优先级规则</p>
        </div>
        
        <!-- 五行补缺输入区 -->
        <div v-if="enableWuXing" class="mb-6">
          <div class="p-4 bg-amber-50 rounded-lg border border-amber-200">
            <div class="flex items-center justify-between mb-3">
              <p class="text-sm font-medium text-amber-800">请输入孩子的出生时间（公历）</p>
              <span class="text-xs text-amber-600">💡 本工具采用节气换月的专业八字算法</span>
            </div>
            <div class="flex flex-wrap gap-3 items-end">
              <div class="flex-1 min-w-[120px]">
                <label class="block mb-1 text-xs font-medium text-amber-700">年份</label>
                <input v-model.number="birthYear" type="number" placeholder="如：2024" min="1900" max="2100"
                  @input="calculateBazi"
                  class="px-3 py-2 w-full text-sm rounded-lg border border-amber-300 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  :disabled="isGenerating" />
              </div>
              <div class="flex-1 min-w-[100px]">
                <label class="block mb-1 text-xs font-medium text-amber-700">月份</label>
                <input v-model.number="birthMonth" type="number" placeholder="1-12" min="1" max="12"
                  @input="calculateBazi"
                  class="px-3 py-2 w-full text-sm rounded-lg border border-amber-300 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  :disabled="isGenerating" />
              </div>
              <div class="flex-1 min-w-[100px]">
                <label class="block mb-1 text-xs font-medium text-amber-700">日期</label>
                <input v-model.number="birthDay" type="number" placeholder="1-31" min="1" max="31"
                  @input="calculateBazi"
                  class="px-3 py-2 w-full text-sm rounded-lg border border-amber-300 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  :disabled="isGenerating" />
              </div>
              <div class="flex-1 min-w-[180px]">
                <label class="block mb-1 text-xs font-medium text-amber-700">时辰</label>
                <div class="relative shichen-dropdown">
                  <button
                    type="button"
                    @click="shichenDropdownOpen = !shichenDropdownOpen"
                    class="px-3 py-2 w-full text-sm text-left rounded-lg border border-amber-300 bg-white focus:ring-2 focus:ring-amber-500 focus:border-transparent flex items-center justify-between"
                    :disabled="isGenerating"
                  >
                    <span>{{ shichenOptions.find(s => s.value === birthShichen)?.label || '请选择时辰' }}</span>
                    <svg class="w-4 h-4 ml-2 transition-transform" :class="{ 'rotate-180': shichenDropdownOpen }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </button>
                  
                  <!-- 下拉选项 -->
                  <div
                    v-show="shichenDropdownOpen"
                    class="absolute z-10 mt-1 w-full bg-white rounded-lg border border-amber-300 shadow-lg max-h-60 overflow-y-auto"
                  >
                    <button
                      v-for="shichen in shichenOptions"
                      :key="shichen.value"
                      type="button"
                      @click="selectShichen(shichen.value)"
                      :class="[
                        'w-full px-3 py-2 text-sm text-left hover:bg-amber-50 transition-colors',
                        birthShichen === shichen.value ? 'bg-amber-100 text-amber-800 font-medium' : 'text-gray-700'
                      ]"
                    >
                      {{ shichen.label }}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- 八字和五行分析结果 -->
            <div v-if="baziProfile" class="mt-4 p-3 bg-white rounded-lg border border-amber-200">
              <div class="mb-3">
                <span class="text-sm font-medium text-gray-700">八字：</span>
                <span class="text-sm text-gray-600">{{ baziProfile.eightChar }}</span>
              </div>

              <!-- 五行个数环形图 -->
              <div class="mb-3">
                <span class="text-sm font-medium text-gray-700 block mb-2">五行个数：</span>
                <div class="flex flex-wrap gap-4 justify-center">
                  <div v-for="(count, element) in baziProfile.wuXingCount" :key="element" class="flex flex-col items-center">
                    <!-- 环形图 -->
                    <div class="relative w-16 h-16">
                      <svg class="w-16 h-16" viewBox="0 0 36 36" style="transform: rotate(-90deg);">
                        <!-- 背景圆环 -->
                        <circle cx="18" cy="18" r="15.5" fill="none" stroke="#e5e7eb" stroke-width="3"></circle>
                        <!-- 进度圆环 - 金 -->
                        <circle 
                          v-if="element === '金'"
                          cx="18" 
                          cy="18" 
                          r="15.5" 
                          fill="none" 
                          stroke="#ca8a04"
                          stroke-width="3"
                          :stroke-dasharray="`${(count / 5) * 97.4} 97.4`"
                          stroke-linecap="round"
                        ></circle>
                        <!-- 进度圆环 - 木 -->
                        <circle 
                          v-if="element === '木'"
                          cx="18" 
                          cy="18" 
                          r="15.5" 
                          fill="none" 
                          stroke="#22c55e"
                          stroke-width="3"
                          :stroke-dasharray="`${(count / 5) * 97.4} 97.4`"
                          stroke-linecap="round"
                        ></circle>
                        <!-- 进度圆环 - 水 -->
                        <circle 
                          v-if="element === '水'"
                          cx="18" 
                          cy="18" 
                          r="15.5" 
                          fill="none" 
                          stroke="#3b82f6"
                          stroke-width="3"
                          :stroke-dasharray="`${(count / 5) * 97.4} 97.4`"
                          stroke-linecap="round"
                        ></circle>
                        <!-- 进度圆环 - 火 -->
                        <circle 
                          v-if="element === '火'"
                          cx="18" 
                          cy="18" 
                          r="15.5" 
                          fill="none" 
                          stroke="#dc2626"
                          stroke-width="3"
                          :stroke-dasharray="`${(count / 5) * 97.4} 97.4`"
                          stroke-linecap="round"
                        ></circle>
                        <!-- 进度圆环 - 土 -->
                        <circle 
                          v-if="element === '土'"
                          cx="18" 
                          cy="18" 
                          r="15.5" 
                          fill="none" 
                          stroke="#92400e"
                          stroke-width="3"
                          :stroke-dasharray="`${(count / 5) * 97.4} 97.4`"
                          stroke-linecap="round"
                        ></circle>
                      </svg>
                      <!-- 中间图标 -->
                      <div class="absolute inset-0 flex items-center justify-center text-xl">
                        {{ wuxingColors[element].icon }}
                      </div>
                    </div>
                    <!-- 标签 -->
                    <span :class="['text-xs font-medium mt-1', wuxingColors[element].text]">
                      {{ count }}个{{ element }}
                    </span>
                  </div>
                </div>
              </div>

              <div class="mb-3">
                <span class="text-sm font-medium text-gray-700">五行旺衰：</span>
                <span v-if="baziProfile.strong.length > 0" class="text-sm font-medium ml-1">
                  <span v-for="(wx, idx) in baziProfile.strong" :key="wx" :class="wuxingColors[wx].text">
                    {{ wx }}<span v-if="idx < baziProfile.strong.length - 1">、</span>
                  </span>
                  <span class="text-gray-600">旺</span>
                </span>
                <span v-if="baziProfile.lack.length > 0" class="text-sm font-medium ml-2">
                  <span class="text-gray-600">；缺</span>
                  <span v-for="(wx, idx) in baziProfile.lack" :key="wx" :class="wuxingColors[wx].text" class="ml-1">
                    {{ wx }}<span v-if="idx < baziProfile.lack.length - 1">、</span>
                  </span>
                </span>
              </div>

              <div class="p-2 bg-amber-50 rounded">
                <div class="mb-1">
                  <span class="text-sm font-bold text-amber-800">喜用神：</span>
                  <span :class="['text-sm font-bold', wuxingColors[baziProfile.priority.main].text]">
                    {{ baziProfile.priority.main }}
                  </span>
                </div>
                <div v-if="baziProfile.priority.secondary" class="mb-1">
                  <span class="text-sm font-medium text-amber-700">次补五行：</span>
                  <span :class="['text-sm font-medium', wuxingColors[baziProfile.priority.secondary].text]">
                    {{ baziProfile.priority.secondary }}
                  </span>
                </div>
                <div v-if="baziProfile.priority.avoid.length > 0">
                  <span class="text-sm font-medium text-red-700">忌加强：</span>
                  <span v-for="(wx, idx) in baziProfile.priority.avoid" :key="wx" :class="['text-sm font-medium', wuxingColors[wx].text]">
                    {{ wx }}<span v-if="idx < baziProfile.priority.avoid.length - 1" class="text-gray-600">、</span>
                  </span>
                </div>
              </div>
            </div>

            <p class="mt-2 text-xs text-amber-700">五行补缺将作为最高优先级规则，名字必须包含喜用神对应的汉字</p>
          </div>
        </div>

        <!-- 名字字数 -->
        <div class="mb-6">
          <label class="block mb-3 text-sm font-medium text-gray-700">名字字数</label>
          <div class="inline-flex overflow-hidden rounded-lg border border-gray-200 shadow-sm">
            <button v-for="(opt, idx) in nameLengthOptions" :key="opt.value" @click="nameLength = opt.value" :class="[
              'px-4 py-2.5 text-sm font-medium transition-all border-r border-gray-200 last:border-r-0',
              idx === 0 ? 'rounded-l-lg' : idx === nameLengthOptions.length - 1 ? 'rounded-r-lg' : '',
              nameLength === opt.value
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            ]" :disabled="isGenerating">
              {{ opt.label }}
            </button>
          </div>
        </div>

        <!-- 名字风格 -->
        <div class="mb-6">
          <label class="block mb-3 text-sm font-medium text-gray-700">名字风格</label>
          <div class="flex overflow-x-auto flex-nowrap gap-2 pb-1">
            <button v-for="style in nameStyles" :key="style.value" @click="selectedStyle = style.value" :class="[
              'px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap flex-shrink-0',
              selectedStyle === style.value
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            ]" :disabled="isGenerating">
              {{ style.label }}
            </button>
          </div>
        </div>

        <!-- 金色名字概率 -->
        <div class="mb-6">
          <label class="block mb-2 text-sm font-medium text-gray-700">金色名字出现概率</label>
          <div class="flex flex-wrap gap-3 items-center">
            <select v-model="goldChance"
              class="px-4 py-2.5 bg-white rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              :disabled="isGenerating">
              <option value="0">0%（不会出现金色）</option>
              <option value="0.3">30%</option>
              <option value="0.6">60%</option>
              <option value="1">100%（必有且仅有一个金色）</option>
            </select>
            <span class="text-sm text-gray-500">稀有度：最多 1 个金色、最多 2 个紫色，每次至少 1 个紫色</span>
          </div>
        </div>

        <!-- 生成按钮 -->
        <div class="flex justify-center">
          <button @click="generateNames" :disabled="isGenerating || !fatherName.trim()"
            class="flex gap-2 justify-center items-center px-8 py-3 font-medium text-white bg-indigo-600 rounded-lg transition-all hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed">
            <Icon v-if="isGenerating" icon="line-md:loading-twotone-loop" width="20" />
            <span>{{ isGenerating ? '生成中...' : '抽卡生成名字' }}</span>
          </button>
        </div>
      </div>

      <!-- 名字卡片区 -->
      <div v-if="nameCards.length > 0" class="p-6 mb-6 bg-white rounded-2xl shadow-xl">
        <h2 class="flex gap-2 items-center mb-4 text-xl font-bold text-gray-800">
          <Icon icon="mdi:cards-outline" width="24" class="text-indigo-600" />
          生成的名字（点击翻转查看寓意）
        </h2>
        <div class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
          <div v-for="(card, index) in nameCards" :key="index" class="card-3d-wrap aspect-[3/4] min-h-0 cursor-pointer"
            @click="toggleCard(index)">
            <div class="card-3d-inner" :class="{ 'is-flipped': card.flipped }">
              <!-- 正面：名字 -->
              <div
                class="flex overflow-hidden absolute inset-0 flex-col justify-center items-center font-bold rounded-xl shadow-lg card-3d-front"
                :class="card.tier === 'normal' ? 'border border-gray-200 text-gray-800' : 'border-2 border-white/20 text-white'">
                <div v-if="card.tier === 'normal'" :class="['absolute inset-0', cardFrontClass(card.tier)]"
                  aria-hidden="true" />
                <div v-else class="absolute inset-0" :style="cardFrontStyle(card.tier)" aria-hidden="true" />
                <span class="relative z-10 px-2 text-3xl text-center break-all">{{ card.name }}</span>
                <span class="relative z-10 mt-1 font-normal opacity-90">{{ tierLabel(card.tier) }}</span>
              </div>
              <!-- 背面：寓意 -->
              <div class="flex overflow-hidden absolute inset-0 flex-col rounded-xl shadow-lg card-3d-back"
                :class="card.tier === 'normal' ? 'border border-gray-200' : 'border-2 border-white/20'">
                <div v-if="card.tier === 'normal'" :class="['absolute inset-0', cardBackClass(card.tier)]"
                  aria-hidden="true" />
                <div v-else class="absolute inset-0" :style="cardBackStyle(card.tier)" aria-hidden="true" />
                <div
                  class="flex overflow-y-auto overflow-x-hidden relative z-10 flex-col gap-2 px-3 pt-2 pb-3 h-full min-h-0 leading-relaxed text-left"
                  :class="card.tier === 'normal' ? 'text-gray-700' : 'text-white'">
                  <span class="block text-2xl font-bold">{{ card.name }}</span>
                  <span class="block text-xl">寓意</span>
                  <span class="block text-lg">{{ card.meaning || '暂无寓意' }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 生成中占位 -->
      <div v-else-if="isGenerating" class="p-6 mb-6 bg-white rounded-2xl shadow-xl">
        <div class="flex gap-3 justify-center items-center py-12 text-gray-600">
          <Icon icon="line-md:loading-twotone-loop" width="24" />
          <span>正在根据父母姓名与风格生成名字...</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { BaziProfile } from '@/utils/bazi';


type Tier = 'normal' | 'rare' | 'best';

interface NameCard {
  name: string;
  meaning: string;
  tier: Tier;
  flipped: boolean;
}

const fatherName = ref('');
const motherName = ref('');
const childGender = ref<'male' | 'female'>('male');
const selectedStyle = ref('random');
const nameLength = ref<'two' | 'three' | 'four' | 'both'>('both');
const goldChance = ref<number | string>('0.6');
const enableWuXing = ref(false);
const birthYear = ref<number>();
const birthMonth = ref<number>();
const birthDay = ref<number>();
const birthShichen = ref<string>('子时');
const shichenDropdownOpen = ref(false);
const baziProfile = ref<BaziProfile>();
const isGenerating = ref(false);
const nameCards = ref<NameCard[]>([]);
/** 已出现过的名（不含姓），仅针对当前姓多次抽卡时排除；换姓会重置，见下方 watch */
const usedNameParts = ref<string[]>([]);

// 时辰选项
const shichenOptions = [
  { label: '子时（23:00-00:59）', value: '子时', hour: 0 },
  { label: '丑时（01:00-02:59）', value: '丑时', hour: 1 },
  { label: '寅时（03:00-04:59）', value: '寅时', hour: 3 },
  { label: '卯时（05:00-06:59）', value: '卯时', hour: 5 },
  { label: '辰时（07:00-08:59）', value: '辰时', hour: 7 },
  { label: '巳时（09:00-10:59）', value: '巳时', hour: 9 },
  { label: '午时（11:00-12:59）', value: '午时', hour: 11 },
  { label: '未时（13:00-14:59）', value: '未时', hour: 13 },
  { label: '申时（15:00-16:59）', value: '申时', hour: 15 },
  { label: '酉时（17:00-18:59）', value: '酉时', hour: 17 },
  { label: '戌时（19:00-20:59）', value: '戌时', hour: 19 },
  { label: '亥时（21:00-22:59）', value: '亥时', hour: 21 },
];

// 五行颜色映射
const wuxingColors: Record<string, { bg: string; text: string; ring: string; icon: string }> = {
  金: { bg: 'bg-yellow-100', text: 'text-yellow-600', ring: 'stroke-yellow-600', icon: '🔱' },
  木: { bg: 'bg-green-100', text: 'text-green-700', ring: 'stroke-green-500', icon: '🌳' },
  水: { bg: 'bg-blue-100', text: 'text-blue-700', ring: 'stroke-blue-500', icon: '💧' },
  火: { bg: 'bg-red-100', text: 'text-red-600', ring: 'stroke-red-600', icon: '🔥' },
  土: { bg: 'bg-amber-100', text: 'text-amber-800', ring: 'stroke-amber-800', icon: '⛰️' },
};

const nameLengthOptions = [
  { label: '两字', value: 'two' as const },
  { label: '三字', value: 'three' as const },
  { label: '四字', value: 'four' as const },
  { label: '都有', value: 'both' as const }
];

// 父亲姓（取首字）
const fatherSurname = computed(() => {
  const s = fatherName.value.trim();
  return s ? s.slice(0, 1) : '';
});

// 换新姓时重置：排除只针对同一姓的多次抽卡，换姓后重新开始、不再排除之前的名
watch(fatherSurname, () => {
  usedNameParts.value = [];
});

// 性别切换时，如果五行开启且字段填满，则重新计算
watch(childGender, () => {
  if (enableWuXing.value && birthYear.value && birthMonth.value && birthDay.value) {
    calculateBazi();
  }
});

// 选择时辰
const selectShichen = (value: string) => {
  birthShichen.value = value;
  shichenDropdownOpen.value = false;
  calculateBazi();
};

// 点击外部关闭下拉框
const closeShichenDropdown = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  if (!target.closest('.shichen-dropdown')) {
    shichenDropdownOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', closeShichenDropdown);
});

onUnmounted(() => {
  document.removeEventListener('click', closeShichenDropdown);
});

// 计算八字和五行
const calculateBazi = async () => {
  if (!birthYear.value || !birthMonth.value || !birthDay.value) {
    baziProfile.value = undefined;
    return;
  }

  // 获取时辰对应的小时
  const shichen = shichenOptions.find(s => s.value === birthShichen.value);
  const hour = shichen?.hour ?? 0;

  try {
    const { calcBaziProfile } = await import('@/utils/bazi');
    baziProfile.value = calcBaziProfile({
      year: birthYear.value,
      month: birthMonth.value,
      day: birthDay.value,
      hour: hour,
      minute: 0,
      gender: childGender.value,
    });
  } catch (error) {
    console.error('计算八字失败:', error);
    baziProfile.value = undefined;
  }
};

const nameStyles = [
  { label: '随机风格', value: 'random' },
  { label: '古风', value: 'classic' },
  { label: '文艺', value: 'literary' },
  { label: '简约', value: 'minimal' },
  { label: '寓意', value: 'meaningful' },
  { label: '诗词', value: 'poetic' }
];

const stylePromptMap: Record<string, string> = {
  random: `
风格随机组合，可混合古风、文艺、简约、寓意、诗词等多种风格。
整体风格需多样化，避免 10 个名字风格雷同。
每个名字风格可不同，但均需自然好读、适合真实取名。
  `.trim(),

  classic: `
偏古风、雅致，有传统文化气质。
可选用偏书卷气、古典意象用字（如山川、玉石、德行等象征）。
避免现代感强或口语化明显的字词，整体风格需端庄、典雅。
  `.trim(),

  literary: `
文艺清新，名字需有书卷气与温润感。
用字可偏柔和、富有情绪与意境，如光影、风月、自然意象等。
避免过于厚重或刚硬的字，整体读感要轻盈、舒展。
  `.trim(),

  minimal: `
简约大气，整体结构干净利落。
用字尽量常见、易写、易读，避免生僻字与复杂偏旁。
名字读起来要利落有力，避免过多修饰性字词堆叠。
  `.trim(),

  meaningful: `
寓意导向，名字需承载明确、美好的含义。
可围绕品德、志向、成长、自然祝福等主题展开。
寓意需清晰可解释，避免空泛或过度抽象的组合。
  `.trim(),

  poetic: `
具诗词意境或古诗文氛围，名字读来有画面感与韵味。
可参考古诗词中的自然意象、情感氛围或典雅表达方式。
不必强行引用原句，但整体需有诗性与审美层次。
  `.trim(),
};

const MAX_VALIDATION_RETRIES = 3;

/** 构建「步骤 + 校验」式提示词（仅 user 内容，system 固定） */
function buildStructuredPrompt(options: {
  surname: string;
  usedNameParts: string[];
  mother: string;
  gender: 'male' | 'female';
  styleLabel: string;
  styleDesc: string;
  nameLength: 'two' | 'three' | 'four' | 'both';
  baziProfile?: BaziProfile;
}): string {
  const { surname, usedNameParts, mother, gender, styleLabel, styleDesc, nameLength, baziProfile } = options;
  const disableSection =
    usedNameParts.length > 0 ? `以下名（不含姓）禁止出现或重复：\n${usedNameParts.join('、')}` : '无（本次为首轮抽卡）';
  const genderDesc =
    gender === 'male'
      ? '男孩：用字应阳刚、大气、有力量感，可选用如：宇、轩、浩、睿、博、翔、峰、磊、刚、毅等字'
      : '女孩：用字应柔美、优雅、有气质，可选用如：婷、雅、诗、涵、琳、萱、瑶、馨、蕊、颖等字';
  const wordRule =
    nameLength === 'two'
      ? '全部为两字名（如：X姓X）'
      : nameLength === 'three'
        ? '全部为三字名（如：X姓XX）'
        : nameLength === 'four'
          ? '全部为四字名（如：X姓XXX）'
          : `10 个名字中：至少 1 个两字名（如：${surname}X）、至少 1 个三字名（如：${surname}XX）、至少 1 个四字名（如：${surname}XXX），其余随意，必须同时包含两字名、三字名和四字名`;

  // 五行补缺规则（最高优先级）
  const wuXingSection = baziProfile
    ? `【一、命理五行约束（最高优先级，不可违背）】
- 喜用神：${baziProfile.priority.main}（名字中必须至少包含 1 个${baziProfile.priority.main}属性汉字）
${baziProfile.priority.secondary ? `- 次补五行：${baziProfile.priority.secondary}（在满足补${baziProfile.priority.main}前提下，可适当加入 1 个${baziProfile.priority.secondary}属性汉字）` : ''}
- 忌加强五行：${baziProfile.priority.avoid.join('、')}（避免名字中出现明显${baziProfile.priority.avoid.join('、')}属性偏旁或意象的字）

【二、五行执行规则（强约束）】
- 每个名字必须包含 ≥1 个${baziProfile.priority.main}属性字
  * ${baziProfile.priority.main === '金' ? '金属性字：铭、钧、锐、锦、铠、锋、鑫、珂、钰、铎、锡、钊、铮、钦、镇、银、钢、铁、钏、锌、铄、钲、锟、镜等金意象字或带金字旁的字' : ''}
  * ${baziProfile.priority.main === '木' ? '木属性字：梓、桐、森、楠、林、栩、柏、松、杨、柳、枫、桦、榕、彬、茂、荣、芳、芸、蓝、萱、莉、菲、蕾、薇等木意象字或带木字旁的字' : ''}
  * ${baziProfile.priority.main === '水' ? '水属性字：涵、泽、清、润、海、洋、江、河、湖、波、涛、浩、淼、沐、溪、澜、渊、沁、洁、淳、漫、潇、滨、汐等水意象字或带水字旁的字' : ''}
  * ${baziProfile.priority.main === '火' ? '火属性字：炎、焱、烨、煜、炜、灿、烁、焕、辉、晖、晨、昊、旭、明、晴、曦、阳、昱、晔、炳、熙、耀、灵、煌等火意象字或带火字旁的字' : ''}
  * ${baziProfile.priority.main === '土' ? '土属性字：坤、培、城、堂、墨、坚、垚、埔、均、圣、地、境、增、壁、尘、坦、垣、塘、基、堡、域、野、壮等土意象字或带土字旁的字' : ''}
${baziProfile.priority.secondary ? `- 若出现${baziProfile.priority.secondary}属性字，仅作为辅助，不得喧宾夺主` : ''}
- 避免连续或叠加出现${baziProfile.priority.avoid.join('/')}意象的字及其偏旁部首

【三、姓氏规则】
- 所有名字必须以「${surname}」开头。

【四、禁用名规则】
- ${disableSection}

【五、父母参考规则】
- 父亲姓：${surname}（仅供风格参考）
- 母亲姓名：${mother || '未提供'}
- 不得直接使用父母完整名字（如名不能等于母亲姓名）。
- 名（除姓外的部分）若为两字及以上，其中来自父亲姓或母亲姓名的字最多只能出现 1 个（可不用）；即不能使用父母名字中的两个字或更多。

【六、性别规则（重要）】
- ${genderDesc}
- 性别是取名的核心参考，用字必须符合性别特征，寓意也要贴合性别气质。

【七、风格偏好】
- 优先风格：${styleLabel}（${styleDesc}）
- 风格仅作为审美参考，不得违反五行补缺规则
- 10 个名字需风格多样化，不可全部相似。

【八、字数规则】
- ${wordRule}

【九、稀有度规则】
- 稀有度字段仅可为：普通 / 稀有 / 最佳
- 最多 1 个「最佳」
- 最多 2 个「稀有」
- 至少 1 个「稀有」

【十、输出格式（严格）】
- 每行一个名字
- 格式：名字|寓意|稀有度
- 不要输出任何多余解释

【十一、内部规划（不需要输出给用户）】
在生成最终结果前，请先在内部完成以下规划：
- 先确定字数分配（如"都有"模式：2个两字名、5个三字名、3个四字名）
- 再为每个名字分配稀有度（确保比例合法：最多1个最佳、最多2个稀有、至少1个稀有）
- 然后逐个生成名字，确保：
  1. 名字中至少包含1个${baziProfile.priority.main}属性汉字（这是最重要的）
  2. 不与禁用名重复
  3. 不直接使用父母完整名字
  4. 名中来自父母姓名的字最多1个
  5. 用字符合性别特征
  6. 符合风格要求
  7. 避免使用${baziProfile.priority.avoid.join('、')}属性的字
- 最后逐条检查所有规则是否全部满足

确认全部合规后，再一次性输出最终 10 行结果。

【十二、执行要求】
- 必须先完成内部规划，再输出结果
- 输出前必须自检所有规则
- 若发现违规，必须修正后再输出
- 只输出最终的 10 行结果，不输出规划过程`
    : `【一、姓氏规则】
- 所有名字必须以「${surname}」开头。

【二、禁用名规则】
- ${disableSection}

【三、父母参考规则】
- 父亲姓：${surname}（仅供风格参考）
- 母亲姓名：${mother || '未提供'}
- 不得直接使用父母完整名字（如名不能等于母亲姓名）。
- 名（除姓外的部分）若为两字及以上，其中来自父亲姓或母亲姓名的字最多只能出现 1 个（可不用）；即不能使用父母名字中的两个字或更多。

【四、性别规则（重要）】
- ${genderDesc}
- 性别是取名的核心参考，用字必须符合性别特征，寓意也要贴合性别气质。

【五、风格规则】
- ${styleLabel}：${styleDesc}
- 10 个名字需风格多样化，不可全部相似。

【六、字数规则】
- ${wordRule}

【七、稀有度规则】
- 稀有度字段仅可为：普通 / 稀有 / 最佳
- 最多 1 个「最佳」
- 最多 2 个「稀有」
- 至少 1 个「稀有」

【八、输出格式（严格）】
- 每行一个名字
- 格式：名字|寓意|稀有度
- 不要输出任何多余解释

【九、内部规划（不需要输出给用户）】
在生成最终结果前，请先在内部完成以下规划：
- 先确定字数分配（如"都有"模式：2个两字名、5个三字名、3个四字名）
- 再为每个名字分配稀有度（确保比例合法：最多1个最佳、最多2个稀有、至少1个稀有）
- 然后逐个生成名字，确保：
  1. 不与禁用名重复
  2. 不直接使用父母完整名字
  3. 名中来自父母姓名的字最多1个
  4. 用字符合性别特征
  5. 符合风格要求
- 最后逐条检查所有规则是否全部满足

确认全部合规后，再一次性输出最终 10 行结果。

【十、执行要求】
- 必须先完成内部规划，再输出结果
- 输出前必须自检所有规则
- 若发现违规，必须修正后再输出
- 只输出最终的 10 行结果，不输出规划过程`;

  return wuXingSection;
}

/** 本地校验：重复、禁用、父母字、字数、稀有度 */
function validateNameCards(
  cards: NameCard[],
  options: {
    surname: string;
    usedNameParts: string[];
    mother: string;
    nameLength: 'two' | 'three' | 'four' | 'both';
  }
): { valid: boolean; errors: string[] } {
  const { surname, usedNameParts, mother, nameLength } = options;
  const errors: string[] = [];
  const nameParts = cards.map((c) => (c.name.startsWith(surname) ? c.name.slice(surname.length) : c.name));

  // 本批内重复
  const seen = new Set<string>();
  for (const p of nameParts) {
    if (seen.has(p)) {
      errors.push(`名重复：${p}`);
      break;
    }
    seen.add(p);
  }

  // 禁用列表
  for (const p of nameParts) {
    if (usedNameParts.includes(p)) errors.push(`命中禁用名：${p}`);
  }

  // 父母字：①不得直接使用父母完整名字 ②名中来自父母姓名的字最多 1 个（含 1 个合法，不报错）
  const parentChars = new Set([surname, ...(mother ? mother.split('').filter((c) => c.trim()) : [])]);
  for (const card of cards) {
    const part = card.name.startsWith(surname) ? card.name.slice(surname.length) : card.name;
    if (mother && part === mother) {
      errors.push(`名直接使用母亲名字：${card.name}`);
      continue;
    }
    const parentCharCount = [...part].filter((c) => parentChars.has(c)).length;
    // 仅当超过 1 个父母字时报错；等于 1 个（如「青岚映雪」含「映」）合法
    if (parentCharCount >= 2) {
      errors.push(`名中来自父母姓名的字超过 1 个（${parentCharCount} 个）：${card.name}`);
    }
  }

  // 字数
  if (nameLength === 'both') {
    const two = cards.filter((c) => c.name.length === 2).length;
    const three = cards.filter((c) => c.name.length === 3).length;
    const four = cards.filter((c) => c.name.length === 4).length;
    if (two < 1) errors.push(`两字名不足 1 个（当前 ${two}）`);
    if (three < 1) errors.push(`三字名不足 1 个（当前 ${three}）`);
    if (four < 1) errors.push(`四字名不足 1 个（当前 ${four}）`);
  } else if (nameLength === 'two') {
    const invalid = cards.filter((c) => c.name.length !== 2);
    if (invalid.length) errors.push(`存在非两字名：${invalid.map((c) => c.name).join('、')}`);
  } else if (nameLength === 'three') {
    const invalid = cards.filter((c) => c.name.length !== 3);
    if (invalid.length) errors.push(`存在非三字名：${invalid.map((c) => c.name).join('、')}`);
  } else if (nameLength === 'four') {
    const invalid = cards.filter((c) => c.name.length !== 4);
    if (invalid.length) errors.push(`存在非四字名：${invalid.map((c) => c.name).join('、')}`);
  }

  // 稀有度
  const bestCount = cards.filter((c) => c.tier === 'best').length;
  const rareCount = cards.filter((c) => c.tier === 'rare').length;
  if (bestCount > 1) errors.push(`「最佳」最多 1 个（当前 ${bestCount}）`);
  if (rareCount > 2) errors.push(`「稀有」最多 2 个（当前 ${rareCount}）`);
  if (rareCount < 1 && bestCount < 1) errors.push('至少需要 1 个「稀有」或「最佳」');

  return { valid: errors.length === 0, errors };
}

// 普通：白底浅渐变；稀有/最佳用内联渐变确保显示
const cardFrontClass = (tier: Tier): string => {
  if (tier === 'normal') return 'bg-gradient-to-br from-gray-50 to-white';
  return '';
};

const cardFrontStyle = (tier: Tier): Record<string, string> => {
  if (tier === 'best') return { background: 'linear-gradient(to bottom right, #fbbf24, #eab308, #d97706)' };
  if (tier === 'rare') return { background: 'linear-gradient(to bottom right, #a855f7, #7c3aed, #6d28d9)' };
  return {};
};

// 卡片背面样式（普通白底渐变，稀有/最佳内联渐变）
const cardBackClass = (tier: Tier): string => {
  if (tier === 'normal') return 'bg-gradient-to-br from-white to-gray-100';
  return '';
};

const cardBackStyle = (tier: Tier): Record<string, string> => {
  if (tier === 'best') return { background: 'linear-gradient(to bottom right, #d97706, #b45309, #92400e)' };
  if (tier === 'rare') return { background: 'linear-gradient(to bottom right, #7c3aed, #6d28d9, #5b21b6)' };
  return {};
};

const tierLabel = (tier: Tier): string => {
  if (tier === 'best') return '最佳';
  if (tier === 'rare') return '稀有';
  return '普通';
};

// 解析流式返回：每行 名字|寓意|稀有度（稀有度为 普通/稀有/最佳）
const parseNameLines = (text: string): NameCard[] => {
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
  const cards: NameCard[] = [];
  const tierMap: Record<string, Tier> = { 普通: 'normal', 稀有: 'rare', 最佳: 'best' };
  for (const line of lines) {
    const parts = line.split('|').map((p) => p.trim());
    if (parts.length >= 2) {
      const name = parts[0];
      const meaning = parts[1];
      let tier: Tier = 'normal';
      if (parts.length >= 3) {
        const t = parts[2];
        tier = tierMap[t] ?? (t === '最佳' || t === 'best' ? 'best' : t === '稀有' || t === 'rare' ? 'rare' : 'normal');
      }
      if (name) cards.push({ name, meaning, tier, flipped: false });
    }
  }
  return cards;
};

// 强制满足：最多1个最佳、最多2个稀有、至少1个稀有；再按 goldChance 决定是否保留最佳
const enforceTiers = (cards: NameCard[]): void => {
  const bestIdx = cards.findIndex((c) => c.tier === 'best');
  const chance = Number(goldChance.value) || 0;

  // 先限制数量：最多1个最佳
  if (bestIdx >= 0) {
    cards.forEach((c, i) => {
      if (c.tier === 'best' && i !== bestIdx) c.tier = 'rare';
    });
  }
  // 稀有最多2个（从后往前改为普通）
  let rareCount = cards.filter((c) => c.tier === 'rare').length;
  if (rareCount > 2) {
    for (let i = cards.length - 1; i >= 0 && rareCount > 2; i--) {
      if (cards[i].tier === 'rare') {
        cards[i].tier = 'normal';
        rareCount--;
      }
    }
  }
  // 至少1个稀有：若没有稀有且没有最佳，把第一个普通改为稀有；若只有最佳没有稀有，把一个普通改为稀有
  const hasRare = cards.some((c) => c.tier === 'rare');
  const hasBest = cards.some((c) => c.tier === 'best');
  if (!hasRare) {
    const firstNormal = cards.findIndex((c) => c.tier === 'normal');
    if (firstNormal >= 0) cards[firstNormal].tier = 'rare';
  }
  // 金色概率：0 则取消最佳；1 则保证有一个最佳；否则按概率随机
  if (hasBest && chance === 0) {
    cards.forEach((c) => {
      if (c.tier === 'best') c.tier = 'rare';
    });
  } else if (!hasBest && chance === 1) {
    const firstRare = cards.findIndex((c) => c.tier === 'rare');
    if (firstRare >= 0) cards[firstRare].tier = 'best';
  } else if (hasBest && chance > 0 && chance < 1 && Math.random() > chance) {
    cards.forEach((c) => {
      if (c.tier === 'best') c.tier = 'rare';
    });
  }
};

const toggleCard = (index: number) => {
  nameCards.value[index].flipped = !nameCards.value[index].flipped;
};

/** 请求接口并解析为名字卡片（不校验） */
async function fetchNameCards(promptUser: string): Promise<NameCard[]> {
  const response = await fetch(import.meta.env.APP_API_BASE_URL + '/chat/ask', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      context: [
        {
          role: 'system',
          content: '你是一个严格遵守规则的中文取名系统，请逐条执行用户给出的规则，不允许违反。按【八、自检要求】在输出前自检，若发现违规请自行修正后再输出。只输出 10 行，每行格式：名字|寓意|稀有度。',
          reasoning_content: ''
        },
        { role: 'user', content: promptUser, reasoning_content: '' }
      ],
      model: 'deepseek-chat',
      temperature: 0.9
    })
  });

  const reader = response.body?.getReader();
  if (!reader) throw new Error('无法读取响应');

  const decoder = new TextDecoder('utf-8');
  let buffer = '';
  let fullText = '';

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';
    for (const line of lines) {
      if (line.startsWith('data:')) {
        const jsonString = line.replace('data: ', '').trim();
        if (jsonString === '[DONE]') continue;
        try {
          const data = JSON.parse(jsonString);
          const content = data?.choices?.[0]?.delta?.content || '';
          if (content) fullText += content;
        } catch (_e) {
          /* ignore */
        }
      }
    }
  }

  return parseNameLines(fullText);
}

const generateNames = async () => {
  const surname = fatherSurname.value;
  if (!surname) return;

  if (nameCards.value.length > 0) {
    const parts = nameCards.value.map((c) =>
      c.name.startsWith(surname) ? c.name.slice(surname.length) : c.name
    );
    usedNameParts.value = [...usedNameParts.value, ...parts];
  }

  isGenerating.value = true;
  nameCards.value = [];

  const styleLabel = nameStyles.find((s) => s.value === selectedStyle.value)?.label ?? selectedStyle.value;
  const styleDesc = stylePromptMap[selectedStyle.value] ?? '风格不限';
  const mother = motherName.value.trim();

  // 使用已计算的八字结果
  if (enableWuXing.value && !baziProfile.value) {
    ElMessage.error('请先填写完整的出生时间');
    isGenerating.value = false;
    return;
  }

  const promptUser = buildStructuredPrompt({
    surname,
    usedNameParts: usedNameParts.value,
    mother,
    gender: childGender.value,
    styleLabel,
    styleDesc,
    nameLength: nameLength.value,
    baziProfile: enableWuXing.value ? baziProfile.value : undefined
  });

  const validationOptions = {
    surname,
    usedNameParts: usedNameParts.value,
    mother,
    nameLength: nameLength.value
  };

  let lastParsed: NameCard[] = [];
  let validated = false;

  try {
    for (let attempt = 0; attempt < MAX_VALIDATION_RETRIES; attempt++) {
      const parsed = await fetchNameCards(promptUser);
      lastParsed = parsed;

      if (parsed.length === 0) {
        lastParsed = [{ name: '解析失败', meaning: '请重试', tier: 'normal', flipped: false }];
        break;
      }

      const { valid, errors } = validateNameCards(parsed, validationOptions);
      if (valid) {
        enforceTiers(parsed);
        nameCards.value = parsed;
        validated = true;
        break;
      }
      if (attempt < MAX_VALIDATION_RETRIES - 1) {
        console.warn('校验未通过，重试中:', errors);
      }
    }

    if (!validated && lastParsed.length > 0 && lastParsed[0].name !== '解析失败') {
      enforceTiers(lastParsed);
      nameCards.value = lastParsed;
      console.warn('已达最大重试次数，展示最后一次结果，部分项可能未通过校验');
    } else if (!validated && lastParsed.length > 0 && lastParsed[0].name === '解析失败') {
      nameCards.value = lastParsed;
    }
  } catch (error) {
    console.error('生成失败:', error);
    nameCards.value = [{ name: '生成失败', meaning: '请检查网络或稍后重试', tier: 'normal', flipped: false }];
  } finally {
    isGenerating.value = false;
  }
};
</script>

<style scoped>
/* 3D 翻转容器：设置透视，子元素才能有 3D 空间 */
.card-3d-wrap {
  perspective: 1000px;
}

.card-3d-inner {
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  -webkit-transform-style: preserve-3d;
  transition: transform 0.6s ease;
}

.card-3d-inner.is-flipped {
  transform: rotateY(180deg);
  -webkit-transform: rotateY(180deg);
}

/* 正面：初始朝向用户 */
.card-3d-front {
  transform: rotateY(0deg) translateZ(0);
  -webkit-transform: rotateY(0deg) translateZ(0);
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  border-radius: 0.75rem;
}

/* 背面：初始背对用户，翻转 180° 后朝向用户；translateZ(1px) 确保背面单独成层、正确绘制 */
.card-3d-back {
  transform: rotateY(180deg) translateZ(1px);
  -webkit-transform: rotateY(180deg) translateZ(1px);
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  border-radius: 0.75rem;
}
</style>
