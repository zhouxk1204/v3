<template>
  <div class="overflow-auto px-4 py-8 h-screen bg-gray-50">
    <div class="mx-auto max-w-5xl">
      <!-- 标题 -->
      <div class="mb-8 text-center">
        <h1 class="mb-2 text-3xl font-bold text-gray-800">肾结石饮食分析助手</h1>
        <p class="text-gray-600">分析饮食模式与肾结石风险因素，提供科学的营养建议</p>
        <div class="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-sm">
          <Icon icon="ep:warning" class="inline-block mr-1 text-amber-800" width="16" />
          本工具不提供医学诊断，不替代医疗建议
        </div>
      </div>

      <!-- 第一部分：诊断信息 -->
      <div class="p-6 mb-6 bg-white rounded-2xl shadow-xl">
        <div class="flex gap-2 items-center mb-6">
          <Icon icon="ep:document" class="text-indigo-600" width="24" />
          <h2 class="text-xl font-bold text-gray-800">诊断信息</h2>
        </div>

        <!-- 泌尿系统状况 -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            你的泌尿系统目前处于哪种情况？
            <span class="text-gray-500 text-xs ml-2">（根据体检或医生诊断选择）</span>
          </label>
          <select
            v-model="diagnosisData.status"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
          >
            <option value="unknown">不确定</option>
            <option value="normal">未发现异常</option>
            <option value="has_condition">患有肾脏结晶或肾结石</option>
          </select>
        </div>

        <!-- 结石/结晶详细信息（仅在患有结晶或结石时显示） -->
        <div v-if="diagnosisData.status === 'has_condition'" class="space-y-6">
          <!-- 结石位置 -->
          <div>
            <div class="flex justify-between items-center mb-3">
              <label class="block text-sm font-medium text-gray-700">结石位置</label>
              <button
                @click="showLocationModal = true"
                class="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all shadow-sm hover:shadow-md"
              >
                <Icon icon="ep:circle-plus" class="text-white" width="20" />
                <span>添加位置</span>
              </button>
            </div>
            
            <div v-if="diagnosisData.locations.length === 0" class="text-gray-500 text-center py-8 bg-gray-50 rounded-xl">
              <Icon icon="ep:first-aid-kit" class="mx-auto mb-2 text-gray-400" width="32" />
              <p class="text-sm">暂无位置记录，点击"添加位置"开始添加</p>
            </div>
            
            <div v-else class="space-y-3">
              <div
                v-for="(loc, index) in diagnosisData.locations"
                :key="index"
                class="p-4 bg-white rounded-xl border-2 border-indigo-200 hover:border-indigo-300 transition-all hover:shadow-md"
              >
                <div class="flex justify-between items-start mb-3">
                  <div class="flex items-center gap-2">
                    <div class="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                      <Icon icon="ep:first-aid-kit" class="text-indigo-600" width="22" />
                    </div>
                    <div>
                      <div class="flex items-center gap-2">
                        <span class="px-2 py-1 text-xs font-medium rounded-full" :class="loc.type === 'crystal' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'">
                          {{ loc.type === 'crystal' ? '结晶' : '结石' }}
                        </span>
                        <div class="font-bold text-gray-800 text-lg">{{ loc.position }}</div>
                      </div>
                      <div v-if="loc.detail && loc.detail !== 'unknown'" class="text-sm text-indigo-600 mt-1">{{ loc.detail }}</div>
                    </div>
                  </div>
                  <button
                    @click="removeLocation(index)"
                    class="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Icon icon="ep:delete" class="text-red-500" width="20" />
                  </button>
                </div>
                <div class="grid grid-cols-2 gap-3">
                  <div v-if="loc.type === 'stone'" class="p-3 bg-gray-50 rounded-lg">
                    <div class="text-xs text-gray-500 mb-1">直径</div>
                    <div class="text-sm font-medium text-gray-800">{{ diameterOptions.find(o => o.value === loc.maxDiameter)?.label || '未知' }}</div>
                  </div>
                  <div v-if="loc.type === 'stone' && isKidneyPosition(loc.position)" class="p-3 bg-gray-50 rounded-lg">
                    <div class="text-xs text-gray-500 mb-1">积水</div>
                    <div class="text-sm font-medium text-gray-800">{{ hydronephrosisOptions.find(o => o.value === loc.hydronephrosis)?.label || '未知' }}</div>
                  </div>
                  <div class="p-3 bg-gray-50 rounded-lg" :class="loc.type === 'crystal' || !isKidneyPosition(loc.position) ? 'col-span-2' : ''">
                    <div class="text-xs text-gray-500 mb-1">疼痛</div>
                    <div class="text-sm font-medium text-gray-800">{{ painOptions.find(o => o.value === loc.pain)?.label || '未知' }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 第二部分：今日饮水 -->
      <div class="p-6 mb-6 bg-white rounded-2xl shadow-xl">
        <div class="flex justify-between items-center mb-4">
          <div class="flex gap-2 items-center">
            <Icon icon="ep:coffee-cup" class="text-blue-600" width="24" />
            <h2 class="text-xl font-bold text-gray-800">今日饮水记录</h2>
          </div>
          <button
            @click="showDrinkModal = true"
            class="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-sm hover:shadow-md"
          >
            <Icon icon="ep:circle-plus" class="text-white" width="20" />
            <span>添加饮水</span>
          </button>
        </div>

        <!-- 饮水量计算输入 -->
        <div class="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
          <div class="flex items-center gap-2 mb-4">
            <Icon icon="ep:data-analysis" class="text-blue-600" width="20" />
            <h3 class="text-sm font-bold text-gray-800">个性化饮水量计算</h3>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label class="block text-xs font-medium text-gray-700 mb-2">
                <Icon icon="ep:scale" class="inline-block mr-1" width="14" />
                体重（kg）
              </label>
              <input
                v-model.number="waterInput.weightKg"
                type="number"
                min="0"
                step="0.1"
                placeholder="输入体重"
                class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-700 mb-2">
                <Icon icon="ep:odometer" class="inline-block mr-1" width="14" />
                今日步数
              </label>
              <input
                v-model.number="waterInput.steps"
                type="number"
                min="0"
                placeholder="输入步数"
                class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-700 mb-2">
                <Icon icon="ep:alarm-clock" class="inline-block mr-1" width="14" />
                久坐时长（小时）
              </label>
              <input
                v-model.number="waterInput.sedentaryHours"
                type="number"
                min="0"
                max="24"
                step="0.5"
                placeholder="输入久坐时长"
                class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div v-if="recommendedWater > 0" class="mt-4 p-3 bg-white rounded-lg border-2 border-blue-300">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <Icon icon="ep:trophy" class="text-blue-600" width="20" />
                <span class="text-sm font-medium text-gray-700">推荐每日饮水量：</span>
              </div>
              <span class="text-xl font-bold text-blue-600">{{ recommendedWater }}ml</span>
            </div>
            <div class="mt-2 text-xs text-gray-600">
              基于体重、运动量和久坐时间科学计算，建议达到此目标以预防肾结石
            </div>
          </div>
        </div>
        
        <div v-if="drinks.length === 0" class="text-gray-500 text-center py-12">
          <Icon icon="ep:coffee-cup" class="mx-auto mb-2 text-gray-400" width="48" />
          <p>暂无饮水记录，点击"添加饮水"开始记录</p>
        </div>
        
        <div v-else class="space-y-3">
          <div
            v-for="(drink, index) in drinks"
            :key="index"
            class="flex justify-between items-center p-4 bg-blue-50 rounded-xl border border-blue-100 transition-all hover:shadow-md"
          >
            <div class="flex items-center gap-3">
              <Icon :icon="getDrinkIcon(drink.type)" class="text-blue-600" width="24" />
              <div>
                <span class="font-medium text-gray-800">{{ drink.type }}</span>
                <span class="text-blue-600 ml-2 font-semibold">{{ drink.volume }}ml</span>
              </div>
            </div>
            <button
              @click="removeDrink(index)"
              class="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Icon icon="ep:delete" class="text-red-500" width="20" />
            </button>
          </div>
          <div class="mt-4 p-6 bg-blue-100 rounded-xl border-2 border-blue-200">
            <div v-if="recommendedWater > 0" class="flex items-center justify-between gap-8">
              <!-- 环形图 -->
              <div class="relative w-32 h-32 flex-shrink-0">
                <svg class="w-32 h-32 transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    fill="none"
                    stroke="#e0f2fe"
                    stroke-width="16"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    fill="none"
                    :stroke="waterProgress >= 100 ? '#10b981' : waterProgress >= 70 ? '#3b82f6' : waterProgress >= 50 ? '#f59e0b' : '#ef4444'"
                    stroke-width="16"
                    :stroke-dasharray="`${(waterProgress / 100) * 351.86} 351.86`"
                    stroke-linecap="round"
                  />
                </svg>
                <div class="absolute inset-0 flex flex-col items-center justify-center">
                  <div class="text-2xl font-bold" :class="waterProgress >= 100 ? 'text-green-600' : waterProgress >= 70 ? 'text-blue-600' : waterProgress >= 50 ? 'text-amber-600' : 'text-red-600'">
                    {{ waterProgress }}%
                  </div>
                  <div class="text-xs text-gray-600">完成度</div>
                </div>
              </div>
              
              <!-- 数据信息 -->
              <div class="flex-1">
                <div class="flex items-baseline gap-2 mb-2">
                  <Icon icon="ep:select" class="text-blue-700" width="20" />
                  <span class="text-sm text-gray-700">今日总计</span>
                </div>
                <div class="flex items-baseline gap-2 mb-3">
                  <span class="text-3xl font-bold text-blue-800">{{ totalDrinkVolume }}</span>
                  <span class="text-lg text-gray-600">ml</span>
                  <span class="text-gray-500 mx-1">/</span>
                  <span class="text-xl font-medium text-blue-700">{{ recommendedWater }}</span>
                  <span class="text-sm text-gray-600">ml</span>
                </div>
                <div class="text-xs text-gray-600">
                  <span v-if="waterProgress >= 100" class="text-green-600 font-medium">✓ 已达标！继续保持</span>
                  <span v-else-if="waterProgress >= 70" class="text-blue-600 font-medium">还差 {{ recommendedWater - totalDrinkVolume }}ml 达标</span>
                  <span v-else-if="waterProgress >= 50" class="text-amber-600 font-medium">还需努力，距离目标还有 {{ recommendedWater - totalDrinkVolume }}ml</span>
                  <span v-else class="text-red-600 font-medium">饮水不足，请尽快补充 {{ recommendedWater - totalDrinkVolume }}ml</span>
                </div>
              </div>
            </div>
            
            <!-- 没有设置推荐量时的显示 -->
            <div v-else class="flex items-center justify-center gap-2">
              <Icon icon="ep:select" class="text-blue-700" width="24" />
              <span class="font-bold text-blue-800 text-lg">总计：{{ totalDrinkVolume }}ml</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 第三部分：饮食记录 -->
      <div class="p-6 mb-6 bg-white rounded-2xl shadow-xl">
        <div class="flex justify-between items-center mb-4">
          <div class="flex gap-2 items-center">
            <Icon icon="ep:food" class="text-green-600" width="24" />
            <h2 class="text-xl font-bold text-gray-800">饮食记录</h2>
          </div>
          <button
            @click="showMealModal = true"
            class="flex items-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all shadow-sm hover:shadow-md"
          >
            <Icon icon="ep:circle-plus" class="text-white" width="20" />
            <span>添加饮食</span>
          </button>
        </div>
        
        <div v-if="meals.length === 0" class="text-gray-500 text-center py-12">
          <Icon icon="ep:food" class="mx-auto mb-2 text-gray-400" width="48" />
          <p>暂无饮食记录，点击"添加饮食"开始记录</p>
        </div>
        
        <div v-else class="space-y-4">
          <div
            v-for="(meal, index) in meals"
            :key="index"
            class="p-4 bg-white rounded-xl border-2 border-green-200 hover:border-green-300 transition-all hover:shadow-md"
          >
            <div class="flex justify-between items-center mb-3">
              <div class="flex items-center gap-2">
                <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Icon :icon="getMealIcon(meal.category)" class="text-green-600" width="22" />
                </div>
                <span class="font-bold text-lg text-gray-800">{{ meal.category }}</span>
              </div>
              <button
                @click="removeMeal(index)"
                class="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Icon icon="ep:delete" class="text-red-500" width="20" />
              </button>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div
                v-for="(item, itemIndex) in meal.items"
                :key="itemIndex"
                class="flex items-center gap-2 px-3 py-2 bg-green-50 rounded-lg text-gray-700"
              >
                <Icon icon="ep:circle-check" class="text-green-600 flex-shrink-0" width="16" />
                <span class="text-sm">{{ item }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>



      <!-- 分析结果 -->
      <div v-if="analysisResult" class="space-y-6 mb-6">
        <!-- ① 总体风险评分 -->
        <div class="p-6 bg-white rounded-2xl shadow-xl">
          <div class="flex gap-2 items-center mb-6">
            <Icon icon="ep:data-analysis" class="text-indigo-600" width="24" />
            <h2 class="text-2xl font-bold text-gray-800">总体风险评分</h2>
          </div>
          
          <div class="flex flex-col md:flex-row items-center gap-8">
            <!-- 环形进度条 -->
            <div class="relative w-48 h-48">
              <svg class="w-48 h-48 transform -rotate-90">
                <circle
                  cx="96"
                  cy="96"
                  r="80"
                  fill="none"
                  stroke="#e5e7eb"
                  stroke-width="16"
                />
                <circle
                  cx="96"
                  cy="96"
                  r="80"
                  fill="none"
                  :stroke="riskLevelColor"
                  stroke-width="16"
                  :stroke-dasharray="`${(analysisResult.overallScore / 100) * 502.4} 502.4`"
                  stroke-linecap="round"
                />
              </svg>
              <div class="absolute inset-0 flex flex-col items-center justify-center">
                <div class="text-5xl font-bold" :style="{ color: riskLevelColor }">
                  {{ analysisResult.overallScore }}
                </div>
                <div class="text-sm text-gray-600 mt-1">风险分数</div>
              </div>
            </div>
            
            <!-- 风险等级信息 -->
            <div class="flex-1">
              <div class="p-6 rounded-xl" :class="ratingClass">
                <div class="text-3xl font-bold mb-2">{{ analysisResult.riskLevel }}</div>
                <div class="text-sm opacity-90 space-y-1">
                  <div>• 0-30分：低风险</div>
                  <div>• 30-60分：中等风险</div>
                  <div>• 60-80分：较高风险</div>
                  <div>• 80+分：高风险</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- ② 风险来源拆解 -->
        <div class="p-6 bg-white rounded-2xl shadow-xl">
          <div class="flex gap-2 items-center mb-6">
            <Icon icon="ep:data-line" class="text-indigo-600" width="24" />
            <h2 class="text-2xl font-bold text-gray-800">风险来源拆解</h2>
          </div>
          <div v-if="analysisResult.riskSources && analysisResult.riskSources.length > 0" ref="riskSourceChartRef" class="w-full h-96"></div>
          <div v-else class="text-gray-500 text-center py-12">
            <Icon icon="ep:data-line" class="mx-auto mb-2 text-gray-400" width="48" />
            <p>暂无风险来源数据</p>
          </div>
        </div>

        <!-- ③ 摄入结构图 -->
        <div class="p-6 bg-white rounded-2xl shadow-xl">
          <div class="flex gap-2 items-center mb-6">
            <Icon icon="ep:pie-chart" class="text-indigo-600" width="24" />
            <h2 class="text-2xl font-bold text-gray-800">饮料摄入结构</h2>
          </div>
          <div v-if="analysisResult.drinkStructure && analysisResult.drinkStructure.length > 0" ref="drinkStructureChartRef" class="w-full h-96"></div>
          <div v-else class="text-gray-500 text-center py-12">
            <Icon icon="ep:coffee-cup" class="mx-auto mb-2 text-gray-400" width="48" />
            <p>暂无饮料摄入数据，请先添加饮水记录</p>
          </div>
        </div>

        <!-- ④ 行为问题分析 -->
        <div class="p-6 bg-white rounded-2xl shadow-xl">
          <div class="flex gap-2 items-center mb-6">
            <Icon icon="ep:data-board" class="text-indigo-600" width="24" />
            <h2 class="text-2xl font-bold text-gray-800">行为问题分析</h2>
          </div>
          <div ref="behaviorRadarChartRef" class="w-full h-96"></div>
          <div class="mt-4 text-sm text-gray-600 text-center">
            * 分数越高表示该维度表现越好（满分100分）
          </div>
        </div>

        <!-- ⑤ 个性化行动建议 -->
        <div class="p-6 bg-white rounded-2xl shadow-xl">
          <div class="flex gap-2 items-center mb-6">
            <Icon icon="ep:light" class="text-indigo-600" width="24" />
            <h2 class="text-2xl font-bold text-gray-800">Top 3 改善行动</h2>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div
              v-for="(suggestion, index) in analysisResult.actionSuggestions"
              :key="index"
              class="p-6 bg-blue-50 rounded-xl border-2 border-blue-200 hover:shadow-lg transition-all flex flex-col"
            >
              <div class="flex items-center gap-2 mb-3">
                <div class="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                  {{ index + 1 }}
                </div>
                <div class="text-lg font-bold text-gray-800">行动建议</div>
              </div>
              <div class="text-gray-700 mb-4 leading-relaxed flex-1">
                {{ suggestion.action }}
              </div>
              <div class="flex items-center gap-2 p-3 bg-white rounded-lg mt-auto">
                <Icon icon="ep:bottom" class="text-green-600" width="20" />
                <span class="text-sm text-gray-600">预计风险下降：</span>
                <span class="text-xl font-bold text-green-600">-{{ suggestion.riskReduction }}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 分析按钮 -->
      <div class="mt-8">
        <button
          @click="analyzeData"
          :disabled="isAnalyzing || !canAnalyze"
          class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg hover:shadow-xl disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-3"
        >
          <Icon v-if="isAnalyzing" icon="ep:loading" class="text-white animate-spin" width="24" />
          <Icon v-else icon="ep:data-analysis" class="text-white" width="24" />
          <span class="text-lg">{{ isAnalyzing ? '分析中...' : '开始分析' }}</span>
        </button>
      </div>
      
      <div v-if="!canAnalyze" class="mt-3 text-center text-sm text-gray-500">
        请至少添加一条饮水记录和一条饮食记录后再进行分析
      </div>
    </div>

    <!-- 饮水添加模态框 -->
    <div
      v-if="showDrinkModal"
      class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    >
      <div class="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
        <div class="flex items-center gap-2 mb-6">
          <Icon icon="ep:coffee-cup" class="text-blue-600" width="28" />
          <h3 class="text-2xl font-bold text-gray-800">添加饮水记录</h3>
        </div>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">饮料种类</label>
            <select
              v-model="newDrink.type"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option value="白开水">💧 白开水</option>
              <option value="矿泉水">🏔️ 矿泉水</option>
              <option value="茶">🍵 茶</option>
              <option value="咖啡">☕ 咖啡</option>
              <option value="果汁">🧃 果汁</option>
              <option value="碳酸饮料">🥤 碳酸饮料</option>
              <option value="牛奶">🥛 牛奶</option>
              <option value="奶茶">🧋 奶茶</option>
              <option value="啤酒">🍺 啤酒</option>
              <option value="白酒">🍶 白酒</option>
              <option value="红酒">🍷 红酒</option>
              <option value="其他">🍹 其他</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">容量（ml）</label>
            <input
              v-model.number="newDrink.volume"
              type="number"
              min="0"
              step="50"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
        </div>
        
        <div class="flex gap-3 mt-6">
          <button
            @click="showDrinkModal = false"
            class="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition-all"
          >
            取消
          </button>
          <button
            @click="addDrink"
            class="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-all shadow-md hover:shadow-lg"
          >
            确定
          </button>
        </div>
      </div>
    </div>

    <!-- 饮食添加模态框 -->
    <div
      v-if="showMealModal"
      class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    >
      <div class="bg-white rounded-2xl p-6 w-full max-w-md max-h-[85vh] overflow-y-auto shadow-2xl">
        <div class="flex items-center gap-2 mb-6">
          <Icon icon="ep:food" class="text-green-600" width="28" />
          <h3 class="text-2xl font-bold text-gray-800">添加饮食记录</h3>
        </div>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">餐次分类</label>
            <select
              v-model="newMeal.category"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
            >
              <option value="早餐">🌅 早餐</option>
              <option value="午餐">☀️ 午餐</option>
              <option value="晚餐">🌙 晚餐</option>
              <option value="下午茶">🍰 下午茶</option>
              <option value="夜宵">🌃 夜宵</option>
              <option value="零食">🍿 零食</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">食物项目</label>
            <div class="space-y-2">
              <div
                v-for="(_, index) in newMeal.items"
                :key="index"
                class="flex gap-2"
              >
                <input
                  v-model="newMeal.items[index]"
                  type="text"
                  placeholder="输入食物名称"
                  class="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                />
                <button
                  v-if="newMeal.items.length > 1"
                  @click="removeMealItem(index)"
                  class="px-3 py-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Icon icon="ep:circle-close" class="text-red-500" width="24" />
                </button>
              </div>
            </div>
            <button
              @click="addMealItem"
              class="mt-3 w-10 h-10 bg-green-100 hover:bg-green-200 rounded-full flex items-center justify-center transition-all shadow-sm hover:shadow-md"
            >
              <Icon icon="ep:circle-plus" class="text-green-600" width="24" />
            </button>
          </div>
        </div>
        
        <div class="flex gap-3 mt-6">
          <button
            @click="closeMealModal"
            class="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition-all"
          >
            取消
          </button>
          <button
            @click="addMeal"
            class="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-all shadow-md hover:shadow-lg"
          >
            确定
          </button>
        </div>
      </div>
    </div>

    <!-- 结石/结晶位置添加模态框 -->
    <div
      v-if="showLocationModal"
      class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    >
      <div class="bg-white rounded-2xl p-6 w-full max-w-md max-h-[85vh] overflow-y-auto shadow-2xl">
        <div class="flex items-center gap-2 mb-6">
          <Icon icon="ep:first-aid-kit" class="text-indigo-600" width="28" />
          <h3 class="text-2xl font-bold text-gray-800">添加结石/结晶位置</h3>
        </div>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">类型</label>
            <select
              v-model="newLocation.type"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            >
              <option value="crystal">肾脏结晶</option>
              <option value="stone">肾结石</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">位置</label>
            <select
              v-model="newLocation.position"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            >
              <option value="左肾">左肾</option>
              <option value="右肾">右肾</option>
              <option value="左输尿管">左输尿管</option>
              <option value="右输尿管">右输尿管</option>
            </select>
          </div>
          
          <div v-if="isKidneyPosition(newLocation.position)">
            <label class="block text-sm font-medium text-gray-700 mb-2">详细位置（可选）</label>
            <select
              v-model="newLocation.detail"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            >
              <option value="">请选择</option>
              <option value="上盏">上盏</option>
              <option value="中盏">中盏</option>
              <option value="下盏">下盏（较难自行排出）</option>
              <option value="肾盂">肾盂</option>
              <option value="unknown">不清楚</option>
            </select>
          </div>

          <div v-if="newLocation.type === 'stone'">
            <label class="block text-sm font-medium text-gray-700 mb-2">结石最大直径</label>
            <select
              v-model="newLocation.maxDiameter"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            >
              <option value="<5mm">&lt;5 mm</option>
              <option value="5-10mm">5-10 mm</option>
              <option value="10-20mm">10-20 mm</option>
              <option value=">20mm">&gt;20 mm</option>
              <option value="unknown">不清楚</option>
            </select>
          </div>

          <div v-if="newLocation.type === 'stone' && isKidneyPosition(newLocation.position)">
            <label class="block text-sm font-medium text-gray-700 mb-2">是否出现积水</label>
            <select
              v-model="newLocation.hydronephrosis"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            >
              <option value="none">没有</option>
              <option value="mild">轻度</option>
              <option value="moderate">中度</option>
              <option value="severe">重度</option>
              <option value="unknown">不清楚</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">是否疼痛</label>
            <select
              v-model="newLocation.pain"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            >
              <option value="none">没有</option>
              <option value="occasional">偶尔</option>
              <option value="frequent">多次</option>
              <option value="current">正在疼痛</option>
            </select>
          </div>
        </div>
        
        <div class="flex gap-3 mt-6">
          <button
            @click="closeLocationModal"
            class="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition-all"
          >
            取消
          </button>
          <button
            @click="addLocation"
            class="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition-all shadow-md hover:shadow-lg"
          >
            确定
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { chatCompletions } from '@/api/deepseek/index.api'
import { Icon } from '@iconify/vue'
import { BarChart, PieChart, RadarChart } from 'echarts/charts'
import {
  GridComponent,
  LegendComponent,
  TooltipComponent
} from 'echarts/components'
import * as echarts from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { ElMessage } from 'element-plus'
import { computed, nextTick, onMounted, ref, watch } from 'vue'

echarts.use([
  BarChart,
  PieChart,
  RadarChart,
  GridComponent,
  LegendComponent,
  TooltipComponent,
  CanvasRenderer
])

interface Drink {
  type: string
  volume: number
}

interface Meal {
  category: string
  items: string[]
}

interface WaterInput {
  weightKg: number      // 体重 kg
  steps: number         // 今日步数
  sedentaryHours: number // 久坐时间（小时）
}

interface StoneLocation {
  type: 'crystal' | 'stone' // 类型：结晶或结石
  position: string // 位置：左肾、右肾、左输尿管、右输尿管
  detail?: string // 详细位置：上盏、中盏、下盏、肾盂
  maxDiameter: string // 结石最大直径
  hydronephrosis?: string // 积水程度（仅肾脏位置）
  pain: string // 疼痛情况
}

interface DiagnosisData {
  status: 'normal' | 'has_condition' | 'unknown' // 泌尿系统状况
  locations: StoneLocation[] // 结石/结晶位置（可多个）
}

interface AnalysisResult {
  overallScore: number // 总体风险评分 0-100
  riskLevel: '低风险' | '中等风险' | '较高风险' | '高风险'
  riskSources: Array<{
    name: string
    percentage: number
  }>
  drinkStructure: Array<{
    name: string
    value: number
  }>
  behaviorRadar: {
    categories: string[]
    values: number[] // 0-100 分数，越高越好
  }
  actionSuggestions: Array<{
    action: string
    riskReduction: number // 预计风险下降百分比
  }>
}

const STORAGE_KEY = 'kidney_stone_diagnosis_data'

// 从 localStorage 加载诊断信息
const loadDiagnosisFromStorage = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      const data = JSON.parse(saved)
      diagnosisData.value = data
    }
  } catch (error) {
    console.error('加载诊断信息失败:', error)
  }
}

// 保存诊断信息到 localStorage
const saveDiagnosisToStorage = () => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(diagnosisData.value))
  } catch (error) {
    console.error('保存诊断信息失败:', error)
  }
}

const diagnosisData = ref<DiagnosisData>({
  status: 'unknown',
  locations: []
})
const drinks = ref<Drink[]>([])
const meals = ref<Meal[]>([])
const waterInput = ref<WaterInput>({
  weightKg: 0,
  steps: 0,
  sedentaryHours: 0
})
const isAnalyzing = ref(false)
const analysisResult = ref<AnalysisResult | null>(null)

// 饮水模态框
const showDrinkModal = ref(false)
const newDrink = ref<Drink>({
  type: '白开水',
  volume: 250
})

// 饮食模态框
const showMealModal = ref(false)
const newMeal = ref<Meal>({
  category: '早餐',
  items: ['']
})

// 结石位置模态框
const showLocationModal = ref(false)
const newLocation = ref<StoneLocation>({
  type: 'stone',
  position: '左肾',
  detail: '',
  maxDiameter: 'unknown',
  hydronephrosis: 'unknown',
  pain: 'none'
})

// 饮水量计算配置
const CONFIG = {
  // 基础需水量（IOM）mlPerKg
  mlPerKg: 30,
  // 步数补水（ACSM工程换算）mlPerStep
  mlPerStep: 0.04,
  // 久坐修正
  sedentary: {
    level1Hours: 8,
    level1Add: 200,
    level2Hours: 10,
    level2Add: 300,
  },
  // 肾结石强化目标（EAU/AUA）
  stoneTargetMl: 3000,
  // 医学安全范围
  minMl: 1500,
  maxMl: 4500,
}

// 辅助函数
const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max)
}

const round100 = (value: number): number => {
  return Math.round(value / 100) * 100
}

// 计算推荐饮水量
const calculateRecommendedWater = (input: WaterInput): number => {
  if (input.weightKg <= 0) return 0
  
  // 基础需水
  const base = input.weightKg * CONFIG.mlPerKg
  
  // 步数修正
  const stepExtra = input.steps * CONFIG.mlPerStep
  
  // 久坐修正
  let sedentaryExtra = 0
  if (input.sedentaryHours >= CONFIG.sedentary.level2Hours) {
    sedentaryExtra = CONFIG.sedentary.level2Add
  } else if (input.sedentaryHours >= CONFIG.sedentary.level1Hours) {
    sedentaryExtra = CONFIG.sedentary.level1Add
  }
  
  // 普通需求
  const normalNeed = base + stepExtra + sedentaryExtra
  
  // 结石强化
  let recommended = Math.max(normalNeed, CONFIG.stoneTargetMl)
  
  // 安全裁剪
  recommended = clamp(recommended, CONFIG.minMl, CONFIG.maxMl)
  
  // UI友好：取整到100ml
  return round100(recommended)
}

const recommendedWater = computed(() => {
  return calculateRecommendedWater(waterInput.value)
})

const totalDrinkVolume = computed(() => {
  return drinks.value.reduce((sum, drink) => sum + drink.volume, 0)
})

const waterProgress = computed(() => {
  if (recommendedWater.value === 0) return 0
  return Math.min(Math.round((totalDrinkVolume.value / recommendedWater.value) * 100), 100)
})

const canAnalyze = computed(() => {
  return drinks.value.length > 0 && meals.value.length > 0
})

// 监听诊断信息变化，自动保存
watch(diagnosisData, () => {
  saveDiagnosisToStorage()
}, { deep: true })

// 组件挂载时加载诊断信息
onMounted(() => {
  loadDiagnosisFromStorage()
})

// 诊断选项
const diameterOptions = [
  { value: '<5mm', label: '<5 mm' },
  { value: '5-10mm', label: '5-10 mm' },
  { value: '10-20mm', label: '10-20 mm' },
  { value: '>20mm', label: '>20 mm' },
  { value: 'unknown', label: '不清楚' }
]

const hydronephrosisOptions = [
  { value: 'none', label: '没有' },
  { value: 'mild', label: '轻度' },
  { value: 'moderate', label: '中度' },
  { value: 'severe', label: '重度' },
  { value: 'unknown', label: '不清楚' }
]

const painOptions = [
  { value: 'none', label: '没有' },
  { value: 'occasional', label: '偶尔' },
  { value: 'frequent', label: '多次' },
  { value: 'current', label: '正在疼痛' }
]

// 位置相关函数
const isKidneyPosition = (position: string): boolean => {
  return position === '左肾' || position === '右肾'
}

const addLocation = () => {
  const locationToAdd = { ...newLocation.value }
  // 如果不是肾脏位置或不是结石，清除积水信息
  if (!isKidneyPosition(locationToAdd.position) || locationToAdd.type === 'crystal') {
    locationToAdd.hydronephrosis = undefined
  }
  // 如果是结晶，清除直径信息
  if (locationToAdd.type === 'crystal') {
    locationToAdd.maxDiameter = 'unknown'
  }
  diagnosisData.value.locations.push(locationToAdd)
  showLocationModal.value = false
  // 清空表单
  newLocation.value = {
    type: 'stone',
    position: '左肾',
    detail: '',
    maxDiameter: 'unknown',
    hydronephrosis: 'unknown',
    pain: 'none'
  }
}

const closeLocationModal = () => {
  showLocationModal.value = false
  newLocation.value = {
    type: 'stone',
    position: '左肾',
    detail: '',
    maxDiameter: 'unknown',
    hydronephrosis: 'unknown',
    pain: 'none'
  }
}

const removeLocation = (index: number) => {
  diagnosisData.value.locations.splice(index, 1)
}

const ratingClass = computed(() => {
  if (!analysisResult.value) return ''
  const score = analysisResult.value.overallScore
  if (score < 30) return 'bg-green-100 text-green-800 border-2 border-green-300'
  if (score < 60) return 'bg-yellow-100 text-yellow-800 border-2 border-yellow-300'
  if (score < 80) return 'bg-orange-100 text-orange-800 border-2 border-orange-300'
  return 'bg-red-100 text-red-800 border-2 border-red-300'
})

const riskLevelColor = computed(() => {
  if (!analysisResult.value) return ''
  const score = analysisResult.value.overallScore
  if (score < 30) return '#10b981' // green
  if (score < 60) return '#f59e0b' // amber
  if (score < 80) return '#f97316' // orange
  return '#ef4444' // red
})

const getDrinkIcon = (type: string): string => {
  const iconMap: Record<string, string> = {
    '白开水': 'ep:coffee-cup',
    '矿泉水': 'ep:coffee-cup',
    '茶': 'ep:coffee',
    '咖啡': 'ep:coffee',
    '果汁': 'ep:orange',
    '碳酸饮料': 'ep:coffee-cup',
    '牛奶': 'ep:coffee-cup',
    '奶茶': 'ep:coffee',
    '啤酒': 'ep:coffee-cup',
    '白酒': 'ep:coffee-cup',
    '红酒': 'ep:goblet',
    '其他': 'ep:coffee-cup'
  }
  return iconMap[type] || 'ep:coffee-cup'
}

const getMealIcon = (category: string): string => {
  const iconMap: Record<string, string> = {
    '早餐': 'ep:sunrise',
    '午餐': 'ep:sunny',
    '晚餐': 'ep:moon',
    '下午茶': 'ep:coffee',
    '夜宵': 'ep:moon-night',
    '零食': 'ep:food'
  }
  return iconMap[category] || 'ep:food'
}

// 初始化图表
const riskSourceChartRef = ref<HTMLElement>()
const drinkStructureChartRef = ref<HTMLElement>()
const behaviorRadarChartRef = ref<HTMLElement>()

const initCharts = () => {
  if (!analysisResult.value) return
  
  // 使用 nextTick 和多次延迟确保 DOM 完全渲染
  nextTick(() => {
    // 第一次尝试
    setTimeout(() => {
      if (analysisResult.value?.riskSources && analysisResult.value.riskSources.length > 0) {
        initRiskSourceChart()
      }
      if (analysisResult.value?.drinkStructure && analysisResult.value.drinkStructure.length > 0) {
        initDrinkStructureChart()
      }
      if (analysisResult.value?.behaviorRadar) {
        initBehaviorRadarChart()
      }
    }, 100)
    
    // 第二次尝试（防止第一次失败）
    setTimeout(() => {
      if (analysisResult.value?.riskSources && analysisResult.value.riskSources.length > 0) {
        initRiskSourceChart()
      }
      if (analysisResult.value?.drinkStructure && analysisResult.value.drinkStructure.length > 0) {
        initDrinkStructureChart()
      }
      if (analysisResult.value?.behaviorRadar) {
        initBehaviorRadarChart()
      }
    }, 500)
  })
}

const initRiskSourceChart = () => {
  if (!riskSourceChartRef.value || !analysisResult.value || !analysisResult.value.riskSources.length) {
    return
  }
  
  // 检查容器尺寸
  const width = riskSourceChartRef.value.clientWidth
  const height = riskSourceChartRef.value.clientHeight
  
  if (width === 0 || height === 0) {
    return
  }
  
  const chart = echarts.init(riskSourceChartRef.value)
  const option = {
    grid: {
      left: '30%',
      right: '10%',
      top: '10%',
      bottom: '10%'
    },
    xAxis: {
      type: 'value',
      max: 100,
      axisLabel: {
        formatter: '{value}%'
      }
    },
    yAxis: {
      type: 'category',
      data: analysisResult.value.riskSources.map(item => item.name),
      axisLabel: {
        interval: 0,
        formatter: (value: string) => {
          // 如果文字太长，自动换行
          if (value.length > 8) {
            return value.substring(0, 8) + '\n' + value.substring(8)
          }
          return value
        }
      }
    },
    series: [{
      type: 'bar',
      data: analysisResult.value.riskSources.map(item => item.percentage),
      itemStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
          { offset: 0, color: '#3b82f6' },
          { offset: 1, color: '#8b5cf6' }
        ])
      },
      label: {
        show: true,
        position: 'right',
        formatter: '{c}%'
      }
    }]
  }
  chart.setOption(option)
}

const initDrinkStructureChart = () => {
  if (!drinkStructureChartRef.value || !analysisResult.value || !analysisResult.value.drinkStructure.length) {
    return
  }
  
  // 检查容器尺寸
  const width = drinkStructureChartRef.value.clientWidth
  const height = drinkStructureChartRef.value.clientHeight
  
  if (width === 0 || height === 0) {
    return
  }
  
  const chart = echarts.init(drinkStructureChartRef.value)
  const option = {
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c}ml ({d}%)'
    },
    legend: {
      orient: 'vertical',
      right: '10%',
      top: 'center'
    },
    series: [{
      type: 'pie',
      radius: ['40%', '70%'],
      center: ['35%', '50%'],
      data: analysisResult.value.drinkStructure,
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }]
  }
  chart.setOption(option)
}

const initBehaviorRadarChart = () => {
  if (!behaviorRadarChartRef.value || !analysisResult.value) return
  
  // 检查容器尺寸
  const width = behaviorRadarChartRef.value.clientWidth
  const height = behaviorRadarChartRef.value.clientHeight
  
  if (width === 0 || height === 0) {
    return
  }
  
  const chart = echarts.init(behaviorRadarChartRef.value)
  const option = {
    radar: {
      indicator: analysisResult.value.behaviorRadar.categories.map(name => ({
        name,
        max: 100
      })),
      radius: '65%'
    },
    series: [{
      type: 'radar',
      data: [{
        value: analysisResult.value.behaviorRadar.values,
        name: '当前状态',
        areaStyle: {
          color: new echarts.graphic.RadialGradient(0.5, 0.5, 1, [
            { offset: 0, color: 'rgba(59, 130, 246, 0.3)' },
            { offset: 1, color: 'rgba(59, 130, 246, 0.1)' }
          ])
        },
        lineStyle: {
          color: '#3b82f6'
        },
        itemStyle: {
          color: '#3b82f6'
        }
      }]
    }]
  }
  chart.setOption(option)
}

const addDrink = () => {
  if (newDrink.value.volume > 0) {
    drinks.value.push({ ...newDrink.value })
    showDrinkModal.value = false
    // 清空表单
    newDrink.value = {
      type: '白开水',
      volume: 250
    }
  }
}

const removeDrink = (index: number) => {
  drinks.value.splice(index, 1)
}

const addMealItem = () => {
  newMeal.value.items.push('')
}

const removeMealItem = (index: number) => {
  newMeal.value.items.splice(index, 1)
}

const addMeal = () => {
  const validItems = newMeal.value.items.filter(item => item.trim() !== '')
  if (validItems.length > 0) {
    meals.value.push({
      category: newMeal.value.category,
      items: validItems
    })
    showMealModal.value = false
    // 清空表单
    newMeal.value = {
      category: '早餐',
      items: ['']
    }
  }
}

const removeMeal = (index: number) => {
  meals.value.splice(index, 1)
}

const closeMealModal = () => {
  showMealModal.value = false
  newMeal.value = {
    category: '早餐',
    items: ['']
  }
}

const buildPrompt = (): string => {
  // 获取状态标签
  const getStatusLabel = (status: string): string => {
    const labels: Record<string, string> = {
      'normal': '未发现异常',
      'has_condition': '患有肾脏结晶或肾结石',
      'unknown': '不确定'
    }
    return labels[status] || '未知'
  }

  const prompt = {
    task: 'kidney_stone_diet_risk_analysis',
    constraints: {
      json_only: true,
      no_data_fabrication: true,
      risk_sources_from_input_only: true,
      drink_structure_from_input_only: true,
      missing_data_rule: '无数据维度使用默认评分或0，不推断'
    },
    scoring_rules: {
      diagnosis_risk: {
        normal: 30,
        unknown: 50,
        has_crystal: 60,
        stone_lt_5mm: 65,
        stone_5_10mm: 75,
        stone_gt_10mm: 85
      },
      water_intake_score: {
        excellent: '>=100%',
        good: '70-99%',
        medium: '50-69%',
        poor: '<50%'
      },
      activity_score: {
        excellent: 'steps>=10000 & sedentary<4',
        good: 'steps 5000-9999',
        poor: 'steps<5000 OR sedentary>8',
        no_data: 50
      },
      drink_quality: {
        excellent: ['白开水', '矿泉水'],
        good: ['淡茶', '茶'],
        poor: ['含糖饮料', '碳酸饮料', '酒类']
      }
    },
    analysis_rules: {
      stone_position_modifier: {
        lower_calyx: '+5 risk'
      },
      hydronephrosis: '+10 risk',
      pain: '+10 risk',
      general_prevention_targets: [
        '每日饮水2500-3000ml',
        '减少高盐饮食',
        '避免高草酸或高嘌呤食物',
        '增加日常活动，避免久坐'
      ]
    },
    output_schema: {
      overallScore: '0-100 number',
      riskLevel: ['低风险', '中等风险', '较高风险', '高风险'],
      riskSources: [{ name: 'string', percentage: 'number (sum=100)' }],
      drinkStructure: [{ name: 'string', value: 'number(ml)' }],
      behaviorRadar: {
        categories: ['饮水充足度', '饮食健康度', '运动活跃度', '饮料选择', '整体习惯'],
        values: 'array[5] (0-100)'
      },
      actionSuggestions: [{ action: 'string', riskReduction: 'number' }]
    },
    user_data: {
      diagnosis: {
        status: diagnosisData.value.status,
        status_label: getStatusLabel(diagnosisData.value.status),
        locations: diagnosisData.value.locations.map(loc => ({
          type: loc.type === 'crystal' ? '肾脏结晶' : '肾结石',
          position: loc.position,
          detail: loc.detail,
          maxDiameter: loc.type === 'stone' ? loc.maxDiameter : undefined,
          hydronephrosis: loc.type === 'stone' && loc.hydronephrosis ? loc.hydronephrosis : undefined,
          pain: loc.pain
        }))
      },
      daily_drinks: drinks.value.map(d => `${d.type} ${d.volume}ml`),
      total_water_intake: `${totalDrinkVolume.value}ml`,
      meals: meals.value.map(m => ({
        category: m.category,
        items: m.items
      })),
      water_calculation: {
        weight_kg: waterInput.value.weightKg,
        steps: waterInput.value.steps,
        sedentary_hours: waterInput.value.sedentaryHours,
        recommended_water_ml: recommendedWater.value,
        actual_water_ml: totalDrinkVolume.value,
        completion_rate: waterProgress.value
      }
    }
  }

  return JSON.stringify(prompt)
}

const analyzeData = async () => {
  if (!canAnalyze.value) {
    ElMessage.warning('请至少添加一条饮水记录和一条饮食记录')
    return
  }

  isAnalyzing.value = true
  analysisResult.value = null

  try {
    const promptContent = buildPrompt()
    
    const response = await chatCompletions({
      context: [
        {
          role: 'system',
          content: '你是肾结石饮食风险分析AI，基于营养科学评估风险。不得提供医学诊断。必须只输出合法JSON，不允许任何解释性文字。禁止编造用户未提供的数据。',
        },
        {
          role: 'user',
          content: promptContent,
        }
      ],
      model: 'deepseek-chat',
      temperature: 0.7
    })

    // 直接从响应中获取内容
    const fullText = response?.choices?.[0]?.message?.content || ''
    
    if (!fullText) {
      throw new Error('未收到有效响应')
    }

    // 解析 JSON 结果
    try {
      // 尝试提取 JSON（可能被包裹在 markdown 代码块中）
      let jsonText = fullText.trim()
      const jsonMatch = jsonText.match(/```json\s*([\s\S]*?)\s*```/) || jsonText.match(/```\s*([\s\S]*?)\s*```/)
      if (jsonMatch) {
        jsonText = jsonMatch[1].trim()
      }
      
      const result = JSON.parse(jsonText)
      console.log("result", result)
      analysisResult.value = result
      
      // 初始化图表
      initCharts()
    } catch (parseError) {
      console.error('JSON 解析失败:', parseError, fullText)
      ElMessage.error('数据解析失败，请重试')
    }

  } catch (error) {
    console.error('分析失败:', error)
    ElMessage.error('分析失败，请稍后重试')
  } finally {
    isAnalyzing.value = false
  }
}
</script>


