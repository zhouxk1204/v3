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
              @input="validateAndCleanName('father')"
              class="px-4 py-3 w-full rounded-lg border border-gray-300 transition-all focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              :disabled="isGenerating" />
            <p v-if="fatherNameError" class="mt-1 text-xs text-red-500">{{ fatherNameError }}</p>
            <p v-else-if="fatherSurname" class="mt-1 text-xs text-gray-500">本次生成的名字将姓「{{ fatherSurname }}」</p>
          </div>
          <div>
            <label class="block mb-2 text-sm font-medium text-gray-700">母亲姓名</label>
            <input v-model="motherName" type="text" placeholder="请输入母亲姓名（用于参考）"
              @input="validateAndCleanName('mother')"
              class="px-4 py-3 w-full rounded-lg border border-gray-300 transition-all focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              :disabled="isGenerating" />
            <p v-if="motherNameError" class="mt-1 text-xs text-red-500">{{ motherNameError }}</p>
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
              <div class="flex-1 min-w-[200px]">
                <label class="block mb-1 text-xs font-medium text-amber-700">出生日期</label>
                <input 
                  v-model="birthDate" 
                  type="date" 
                  @change="onBirthDateChange"
                  class="px-3 py-2 w-full text-sm rounded-lg border border-amber-300 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  :disabled="isGenerating" 
                  :max="new Date().toISOString().split('T')[0]"
                />
              </div>
              <div class="flex-1 min-w-[180px]">
                <label class="block mb-1 text-xs font-medium text-amber-700">时辰</label>
                <div class="relative shichen-dropdown">
                  <button type="button" @click="shichenDropdownOpen = !shichenDropdownOpen"
                    class="px-3 py-2 w-full text-sm text-left rounded-lg border border-amber-300 bg-white focus:ring-2 focus:ring-amber-500 focus:border-transparent flex items-center justify-between"
                    :disabled="isGenerating">
                    <span>{{shichenOptions.find(s => s.value === birthShichen)?.label || '请选择时辰'}}</span>
                    <svg class="w-4 h-4 ml-2 transition-transform" :class="{ 'rotate-180': shichenDropdownOpen }"
                      fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </button>

                  <!-- 下拉选项 -->
                  <div v-show="shichenDropdownOpen"
                    class="absolute z-10 mt-1 w-full bg-white rounded-lg border border-amber-300 shadow-lg max-h-60 overflow-y-auto">
                    <button v-for="shichen in shichenOptions" :key="shichen.value" type="button"
                      @click="selectShichen(shichen.value)" :class="[
                        'w-full px-3 py-2 text-sm text-left hover:bg-amber-50 transition-colors',
                        birthShichen === shichen.value ? 'bg-amber-100 text-amber-800 font-medium' : 'text-gray-700'
                      ]">
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
                  <div v-for="(count, element) in baziProfile.wuXingCount" :key="element"
                    class="flex flex-col items-center">
                    <!-- 环形图 -->
                    <div class="relative w-16 h-16">
                      <svg class="w-16 h-16" viewBox="0 0 36 36" style="transform: rotate(-90deg);">
                        <!-- 背景圆环 -->
                        <circle cx="18" cy="18" r="15.5" fill="none" stroke="#e5e7eb" stroke-width="3"></circle>
                        <!-- 进度圆环 - 金 -->
                        <circle v-if="element === '金'" cx="18" cy="18" r="15.5" fill="none" stroke="#ca8a04"
                          stroke-width="3" :stroke-dasharray="`${(count / 5) * 97.4} 97.4`" stroke-linecap="round">
                        </circle>
                        <!-- 进度圆环 - 木 -->
                        <circle v-if="element === '木'" cx="18" cy="18" r="15.5" fill="none" stroke="#22c55e"
                          stroke-width="3" :stroke-dasharray="`${(count / 5) * 97.4} 97.4`" stroke-linecap="round">
                        </circle>
                        <!-- 进度圆环 - 水 -->
                        <circle v-if="element === '水'" cx="18" cy="18" r="15.5" fill="none" stroke="#3b82f6"
                          stroke-width="3" :stroke-dasharray="`${(count / 5) * 97.4} 97.4`" stroke-linecap="round">
                        </circle>
                        <!-- 进度圆环 - 火 -->
                        <circle v-if="element === '火'" cx="18" cy="18" r="15.5" fill="none" stroke="#dc2626"
                          stroke-width="3" :stroke-dasharray="`${(count / 5) * 97.4} 97.4`" stroke-linecap="round">
                        </circle>
                        <!-- 进度圆环 - 土 -->
                        <circle v-if="element === '土'" cx="18" cy="18" r="15.5" fill="none" stroke="#92400e"
                          stroke-width="3" :stroke-dasharray="`${(count / 5) * 97.4} 97.4`" stroke-linecap="round">
                        </circle>
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
                  <span v-for="(wx, idx) in baziProfile.priority.avoid" :key="wx"
                    :class="['text-sm font-medium', wuxingColors[wx].text]">
                    {{ wx }}<span v-if="idx < baziProfile.priority.avoid.length - 1" class="text-gray-600">、</span>
                  </span>
                </div>
              </div>
            </div>

            <p class="mt-2 text-xs text-amber-700">五行补缺将作为最高优先级规则，名字必须包含喜用神对应的汉字</p>
          </div>
        </div>

        <!-- 字辈开关 -->
        <div class="mb-6">
          <label class="block mb-3 text-sm font-medium text-gray-700">字辈</label>
          <div class="inline-flex overflow-hidden rounded-lg border border-gray-200 shadow-sm">
            <button @click="enableZibei = false; zibeiChar = ''" :class="[
              'px-6 py-2.5 text-sm font-medium transition-all border-r border-gray-200',
              !enableZibei
                ? 'bg-gray-500 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            ]" :disabled="isGenerating">
              关闭
            </button>
            <button @click="enableZibei = true; nameLength = 3" :class="[
              'px-6 py-2.5 text-sm font-medium transition-all',
              enableZibei
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            ]" :disabled="isGenerating">
              启用
            </button>
          </div>
          <p class="mt-2 text-xs text-gray-500">启用后名字固定为三字，第二个字为字辈</p>
        </div>

        <!-- 字辈输入 -->
        <div v-if="enableZibei" class="mb-6">
          <label class="block mb-2 text-sm font-medium text-gray-700">字辈字 <span class="text-red-500">*</span></label>
          <input v-model="zibeiChar" type="text" maxlength="1" placeholder="请输入一个字作为字辈"
            class="px-4 py-3 w-full max-w-xs rounded-lg border border-gray-300 transition-all focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            :disabled="isGenerating" />
          <p class="mt-1 text-xs text-gray-500">例如：输入"国"，生成的名字为"X国X"格式</p>
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
            ]" :disabled="isGenerating || enableZibei">
              {{ opt.label }}
            </button>
          </div>
          <p v-if="enableZibei" class="mt-2 text-xs text-amber-600">⚠️ 启用字辈后，名字字数固定为三字</p>
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

        <!-- 生成名字个数 -->
        <div class="mb-6">
          <label class="block mb-2 text-sm font-medium text-gray-700">生成名字个数</label>
          <div class="flex flex-wrap gap-3 items-center">
            <select v-model.number="nameCount"
              class="px-4 py-2.5 bg-white rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              :disabled="isGenerating">
              <option :value="5">5个</option>
              <option :value="10">10个</option>
            </select>
            <span class="text-sm text-gray-500">一次性生成的名字数量</span>
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
import { chatCompletions } from '@/api/deepseek/index.api';
import { BaziProfile } from '@/utils/bazi';
import { buildStructuredPrompt } from './prompt';


type Tier = 'normal' | 'rare' | 'best';

interface NameCard {
  name: string;
  meaning: string;
  tier: Tier;
  flipped: boolean;
}

const fatherName = ref('');
const motherName = ref('');
const fatherNameError = ref('');
const motherNameError = ref('');
const childGender = ref<'male' | 'female'>('male');
const selectedStyle = ref('random');
const nameLength = ref<2 | 3 | 4>(3);
const goldChance = ref<number | string>('0.6');
const nameCount = ref<number>(5);
const enableZibei = ref(false);
const zibeiChar = ref('');
const enableWuXing = ref(false);
const birthDate = ref('');
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
  { label: '两字', value: 2 as const },
  { label: '三字', value: 3 as const },
  { label: '四字', value: 4 as const },
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

// 性别切换时，如果五行开启且字段填满，则重新计算；同时清空usedNameParts
watch(childGender, () => {
  usedNameParts.value = [];
  if (enableWuXing.value && birthYear.value && birthMonth.value && birthDay.value) {
    calculateBazi();
  }
});

// 名字个数切换时，清空已生成的名字
watch(nameCount, () => {
  nameCards.value = [];
});

// 名字字数切换时，清空usedNameParts
watch(nameLength, () => {
  usedNameParts.value = [];
});

// 风格切换时，清空usedNameParts
watch(selectedStyle, () => {
  usedNameParts.value = [];
});

// 同步年月日到日期选择器
watch([birthYear, birthMonth, birthDay], () => {
  if (birthYear.value && birthMonth.value && birthDay.value) {
    const year = birthYear.value;
    const month = String(birthMonth.value).padStart(2, '0');
    const day = String(birthDay.value).padStart(2, '0');
    birthDate.value = `${year}-${month}-${day}`;
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

// 验证并清理姓名（只允许汉字，自动去除空格）
const validateAndCleanName = (type: 'father' | 'mother') => {
  const nameRef = type === 'father' ? fatherName : motherName;
  const errorRef = type === 'father' ? fatherNameError : motherNameError;
  
  // 自动去除所有空格
  const cleaned = nameRef.value.replace(/\s+/g, '');
  
  // 检查是否全为汉字
  const chineseRegex = /^[\u4e00-\u9fa5]+$/;
  
  if (cleaned && !chineseRegex.test(cleaned)) {
    errorRef.value = '姓名只能包含汉字';
    // 只保留汉字部分
    nameRef.value = cleaned.replace(/[^\u4e00-\u9fa5]/g, '');
  } else {
    errorRef.value = '';
    nameRef.value = cleaned;
  }
};

// 处理日期选择器变化
const onBirthDateChange = () => {
  if (birthDate.value) {
    const date = new Date(birthDate.value);
    birthYear.value = date.getFullYear();
    birthMonth.value = date.getMonth() + 1;
    birthDay.value = date.getDate();
    calculateBazi();
  } else {
    birthYear.value = undefined;
    birthMonth.value = undefined;
    birthDay.value = undefined;
    baziProfile.value = undefined;
  }
};

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
  { label: '文人气', value: 'classic' },
  { label: '画面感', value: 'poetic' },
  { label: '情绪柔和', value: 'literary' },
  { label: '家国责任', value: 'national' },
  { label: '喜庆光明', value: 'national_day' },
  { label: '克制高级', value: 'modern' }
];

const stylePromptMap: Record<string, any> = {
  random: {
    name: "随机混合风格",
    core_requirement: "每个名字风格必须明显不同",
    style_types: ["古风", "文艺", "简约", "寓意", "诗词"],
    rules: [
      "10个名字中至少包含3种不同风格",
      "相邻名字风格不能相同",
      "整体需多样化，避免雷同"
    ],
    forbidden: ["所有名字风格相似", "只使用一种风格"]
  },

  classic: {
    name: "古典文人风格",
    core_requirement: "必须具有传统文化气质",
    character_traits: {
      atmosphere: ["典雅", "端庄", "书卷气"],
      imagery: ["山川", "玉石", "德行", "文墨", "琴棋"],
      tone: "厚重、雅致"
    },
    preferred_chars: {
      examples: ["文", "雅", "书", "墨", "玉", "琴", "棋", "诗", "礼", "德"],
      radicals: ["玉旁", "文旁", "言旁"]
    },
    forbidden: ["现代感强的字", "口语化字词", "网络流行字"]
  },

  literary: {
    name: "文艺清新风格",
    core_requirement: "必须有书卷气与温润感",
    character_traits: {
      atmosphere: ["柔和", "温润", "清新", "文艺"],
      imagery: ["自然", "光影", "风月", "季节", "情绪"],
      tone: "轻盈、舒展"
    },
    preferred_chars: {
      examples: ["清", "雨", "风", "月", "云", "溪", "晨", "暮", "柔", "静"],
      types: ["自然意象字", "情绪感字"]
    },
    forbidden: ["厚重字", "刚硬字", "过于古板的字"]
  },

  minimal: {
    name: "极简现代风格",
    core_requirement: "结构干净利落，易读易写",
    character_traits: {
      atmosphere: ["简约", "大气", "克制", "清晰"],
      structure: "笔画少、结构简单",
      tone: "利落有力"
    },
    preferred_chars: {
      examples: ["一", "之", "可", "宁", "安", "平", "正", "明", "远", "行"],
      requirements: ["常见字", "笔画≤10", "结构简单"]
    },
    forbidden: ["生僻字", "复杂偏旁", "笔画繁多的字", "过度修饰"]
  },

  meaningful: {
    name: "寓意导向风格",
    core_requirement: "名字必须承载明确美好的含义",
    character_traits: {
      themes: ["品德", "志向", "成长", "祝福", "智慧"],
      clarity: "寓意清晰可解释",
      tone: "积极向上"
    },
    preferred_chars: {
      examples: ["德", "智", "慧", "志", "远", "成", "达", "贤", "善", "仁"],
      types: ["品德字", "志向字", "成长字"]
    },
    forbidden: ["空泛抽象", "寓意不明", "消极含义"]
  },

  poetic: {
    name: "诗意风格",
    core_requirement: "必须有诗词意境或画面感",
    character_traits: {
      atmosphere: ["含蓄", "意境", "韵味", "画面感"],
      imagery: ["古诗词意象", "自然景物", "情感氛围"],
      tone: "诗性、审美"
    },
    preferred_chars: {
      examples: ["烟", "雨", "霜", "雪", "江", "山", "月", "风", "云", "梦"],
      types: ["诗词常用字", "意象字", "情感字"]
    },
    forbidden: ["直接引用诗句", "过于直白", "缺乏意境"],
    note: "不必强行引用原句，但需有诗性"
  },

  nation: {
    name: "年代责任感风格",
    core_requirement: "体现家国情怀与时代责任",
    character_traits: {
      atmosphere: ["稳重", "理想", "家国", "担当"],
      themes: ["建设", "奋斗", "理想", "责任"],
      tone: "厚重、有力"
    },
    preferred_chars: {
      examples: ["国", "建", "强", "伟", "志", "勇", "军", "民", "华", "兴"],
      types: ["家国字", "理想字", "责任字"]
    },
    forbidden: ["轻浮字", "过于个人化", "缺乏责任感"]
  },

  national_day: {
    name: "喜庆光明风格",
    core_requirement: "必须体现喜庆、光明、希望",
    character_traits: {
      atmosphere: ["喜庆", "光明", "希望", "繁荣"],
      imagery: ["光", "明", "盛", "辉", "耀", "庆"],
      tone: "明亮、积极"
    },
    preferred_chars: {
      examples: ["光", "明", "辉", "耀", "盛", "庆", "欢", "喜", "昌", "荣"],
      types: ["光明字", "喜庆字", "繁荣字"]
    },
    forbidden: ["暗淡字", "消极字", "冷色调字"]
  },

  nature: {
    name: "自然风格",
    core_requirement: "名字中必须包含自然意象",
    character_traits: {
      atmosphere: ["自然", "清新", "广阔", "生机"],
      imagery: ["山", "川", "风", "林", "海", "云", "雨", "雪"],
      tone: "开阔、自然"
    },
    preferred_chars: {
      examples: ["山", "川", "林", "海", "风", "云", "雨", "雪", "松", "竹"],
      requirements: ["必须含自然元素", "至少1个自然意象字"]
    },
    forbidden: ["人工意象", "城市意象", "无自然元素"],
    strict_rule: "每个名字必须包含≥1个自然意象字"
  },

  modern: {
    name: "现代高级风格",
    core_requirement: "体现现代审美与高级感",
    character_traits: {
      atmosphere: ["克制", "冷静", "高级", "精致"],
      style: "简约不简单",
      tone: "现代、精致"
    },
    preferred_chars: {
      examples: ["一", "之", "然", "若", "可", "宁", "予", "言", "思", "行"],
      types: ["现代感字", "简约字", "高级感字"]
    },
    forbidden: ["过于传统", "老气", "复杂繁琐", "土气"]
  }
};

const MAX_VALIDATION_RETRIES = 3;

/** 构建「步骤 + 校验」式提示词（仅 user 内容，system 固定） */
/** 本地校验：重复、禁用、父母字、字数、稀有度、字辈 */
function validateNameCards(
  cards: NameCard[],
  options: {
    surname: string;
    usedNameParts: string[];
    mother: string;
    nameLength: 2 | 3 | 4 | 'both';
    enableZibei?: boolean;
    zibeiChar?: string;
  }
): { valid: boolean; errors: string[] } {
  const { surname, usedNameParts, mother, nameLength, enableZibei, zibeiChar } = options;
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
    if (usedNameParts.includes(p)) {
      console.warn(`命中禁用名：${p}`);
    }
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

  // 字辈校验
  if (enableZibei && zibeiChar) {
    for (const card of cards) {
      if (card.name.length !== 3) {
        errors.push(`字辈模式下名字必须为三字：${card.name}`);
      } else {
        const namePart = card.name.slice(surname.length);
        if (namePart.length !== 2 || namePart[0] !== zibeiChar) {
          errors.push(`字辈格式错误，应为「${surname}${zibeiChar}X」：${card.name}`);
        }
      }
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
  } else if (nameLength === 2) {
    const invalid = cards.filter((c) => c.name.length !== 2);
    if (invalid.length) errors.push(`存在非两字名：${invalid.map((c) => c.name).join('、')}`);
  } else if (nameLength === 3) {
    const invalid = cards.filter((c) => c.name.length !== 3);
    if (invalid.length) errors.push(`存在非三字名：${invalid.map((c) => c.name).join('、')}`);
  } else if (nameLength === 4) {
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
  try {
    const response = await chatCompletions(
      {
        context: [
          {
            role: 'system',
            content: `你是一个严格遵守规则的中文姓名取名专家，请逐条执行用户给出的规则，不允许违反。按【硬性规则（不可违反）】在输出前自检，若发现违规请自行修正后再输出。只输出 ${nameCount.value} 行，每行格式：名字|寓意|稀有度。`
          },
          { role: 'user', content: promptUser }
        ],
        model: 'deepseek-chat',
        temperature: 0.7
      },
      120000 // 2分钟超时
    );

    const fullText = response?.choices?.[0]?.message?.content || '';
    
    if (!fullText) {
      throw new Error('未收到有效响应');
    }

    return parseNameLines(fullText);
  } catch (error) {
    console.error('请求失败:', error);
    throw error;
  }
}

const generateNames = async () => {
  const surname = fatherSurname.value;
  if (!surname) return;

  // 验证父母姓名
  if (fatherNameError.value) {
    ElMessage.error('父亲姓名格式不正确，只能包含汉字');
    return;
  }
  
  if (motherName.value && motherNameError.value) {
    ElMessage.error('母亲姓名格式不正确，只能包含汉字');
    return;
  }

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

  // 字辈校验
  if (enableZibei.value && !zibeiChar.value.trim()) {
    ElMessage.error('请输入字辈字');
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
    nameCount: nameCount.value,
    baziProfile: enableWuXing.value ? baziProfile.value : undefined,
    enableZibei: enableZibei.value,
    zibeiChar: zibeiChar.value
  });

  const validationOptions = {
    surname,
    usedNameParts: usedNameParts.value,
    mother,
    nameLength: nameLength.value,
    enableZibei: enableZibei.value,
    zibeiChar: zibeiChar.value
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
