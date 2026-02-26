<template>
  <div class="overflow-auto px-4 py-8 h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
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
            <option value="crystal">发现尿液结晶</option>
            <option value="history">曾患肾结石</option>
            <option value="current">正在患肾结石</option>
          </select>
        </div>

        <!-- 结晶类型（仅在发现结晶时显示） -->
        <div v-if="diagnosisData.status === 'crystal'" class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-3">结晶类型</label>
          <div class="space-y-2">
            <label
              v-for="type in crystalTypes"
              :key="type.value"
              class="flex items-start p-4 border-2 rounded-xl cursor-pointer transition-all hover:shadow-md"
              :class="diagnosisData.crystalType === type.value ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200'"
            >
              <input
                type="radio"
                :value="type.value"
                v-model="diagnosisData.crystalType"
                class="mt-1 mr-3"
              />
              <div class="flex-1">
                <div class="font-medium text-gray-800 mb-1">{{ type.label }}</div>
                <p class="text-sm text-gray-600">{{ type.description }}</p>
              </div>
            </label>
          </div>
        </div>

        <!-- 结石详细信息（仅在有结石时显示） -->
        <div v-if="diagnosisData.status === 'history' || diagnosisData.status === 'current'" class="space-y-6">
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
                      <div class="font-bold text-gray-800 text-lg">{{ loc.position }}</div>
                      <div v-if="loc.detail && loc.detail !== 'unknown'" class="text-sm text-indigo-600">{{ loc.detail }}</div>
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
                  <div class="p-3 bg-gray-50 rounded-lg">
                    <div class="text-xs text-gray-500 mb-1">直径</div>
                    <div class="text-sm font-medium text-gray-800">{{ diameterOptions.find(o => o.value === loc.maxDiameter)?.label || '未知' }}</div>
                  </div>
                  <div v-if="isKidneyPosition(loc.position)" class="p-3 bg-gray-50 rounded-lg">
                    <div class="text-xs text-gray-500 mb-1">积水</div>
                    <div class="text-sm font-medium text-gray-800">{{ hydronephrosisOptions.find(o => o.value === loc.hydronephrosis)?.label || '未知' }}</div>
                  </div>
                  <div class="p-3 bg-gray-50 rounded-lg" :class="isKidneyPosition(loc.position) ? '' : 'col-span-2'">
                    <div class="text-xs text-gray-500 mb-1">疼痛</div>
                    <div class="text-sm font-medium text-gray-800">{{ painOptions.find(o => o.value === loc.pain)?.label || '未知' }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 第二部分：当日饮水 -->
      <div class="p-6 mb-6 bg-white rounded-2xl shadow-xl">
        <div class="flex justify-between items-center mb-4">
          <div class="flex gap-2 items-center">
            <Icon icon="ep:coffee-cup" class="text-blue-600" width="24" />
            <h2 class="text-xl font-bold text-gray-800">当日饮水记录</h2>
          </div>
          <button
            @click="showDrinkModal = true"
            class="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-sm hover:shadow-md"
          >
            <Icon icon="ep:circle-plus" class="text-white" width="20" />
            <span>添加饮水</span>
          </button>
        </div>
        
        <div v-if="drinks.length === 0" class="text-gray-500 text-center py-12">
          <Icon icon="ep:coffee-cup" class="mx-auto mb-2 text-gray-400" width="48" />
          <p>暂无饮水记录，点击"添加饮水"开始记录</p>
        </div>
        
        <div v-else class="space-y-3">
          <div
            v-for="(drink, index) in drinks"
            :key="index"
            class="flex justify-between items-center p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-100 transition-all hover:shadow-md"
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
          <div class="mt-4 p-4 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-xl border-2 border-blue-200">
            <div class="flex items-center justify-center gap-2">
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

      <!-- 第四部分：运动量信息 -->
      <div class="p-6 mb-6 bg-white rounded-2xl shadow-xl">
        <div class="flex gap-2 items-center mb-4">
          <Icon icon="ep:trophy" class="text-purple-600" width="24" />
          <h2 class="text-xl font-bold text-gray-800">运动量信息</h2>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border border-purple-100">
            <div class="flex items-center gap-2 mb-2">
              <Icon icon="ep:odometer" class="text-purple-600" width="20" />
              <label class="text-sm font-medium text-gray-700">今日步数</label>
            </div>
            <div class="flex items-center gap-2">
              <input
                v-model.number="activityData.steps"
                type="number"
                min="0"
                placeholder="输入今日步数"
                class="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <span class="text-gray-600 font-medium">步</span>
            </div>
          </div>
          
          <div class="p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl border border-orange-100">
            <div class="flex items-center gap-2 mb-2">
              <Icon icon="ep:alarm-clock" class="text-orange-600" width="20" />
              <label class="text-sm font-medium text-gray-700">久坐时长</label>
            </div>
            <div class="flex items-center gap-2">
              <input
                v-model.number="activityData.sedentaryHours"
                type="number"
                min="0"
                max="24"
                step="0.5"
                placeholder="输入久坐时长"
                class="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              <span class="text-gray-600 font-medium">小时</span>
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
              class="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200 hover:shadow-lg transition-all flex flex-col"
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
      @click.self="showDrinkModal = false"
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
      @click.self="closeMealModal"
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

    <!-- 结石位置添加模态框 -->
    <div
      v-if="showLocationModal"
      class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      @click.self="showLocationModal = false"
    >
      <div class="bg-white rounded-2xl p-6 w-full max-w-md max-h-[85vh] overflow-y-auto shadow-2xl">
        <div class="flex items-center gap-2 mb-6">
          <Icon icon="ep:first-aid-kit" class="text-indigo-600" width="28" />
          <h3 class="text-2xl font-bold text-gray-800">添加结石位置</h3>
        </div>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">位置</label>
            <select
              v-model="newLocation.position"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            >
              <option value="左肾">左肾</option>
              <option value="右肾">右肾</option>
              <option value="双肾">双肾</option>
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

          <div>
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

          <div v-if="isKidneyPosition(newLocation.position)">
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
import { BarChart, PieChart, RadarChart } from 'echarts/charts'
import {
  GridComponent,
  LegendComponent,
  TooltipComponent
} from 'echarts/components'
import * as echarts from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { computed, nextTick, ref } from 'vue'

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

interface ActivityData {
  steps: number // 今日步数
  sedentaryHours: number // 久坐时长（小时）
}

interface StoneLocation {
  position: string // 位置：左肾、右肾、双肾、左输尿管、右输尿管
  detail?: string // 详细位置：上盏、中盏、下盏、肾盂
  maxDiameter: string // 结石最大直径
  hydronephrosis?: string // 积水程度（仅肾脏位置）
  pain: string // 疼痛情况
}

interface DiagnosisData {
  status: 'normal' | 'crystal' | 'history' | 'current' | 'unknown' // 泌尿系统状况
  crystalType?: 'calcium_oxalate' | 'uric_acid' | 'phosphate' | 'not_specified' | 'unknown' // 结晶类型
  locations: StoneLocation[] // 结石位置（可多个）
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
  crystalType: undefined,
  locations: []
})
const drinks = ref<Drink[]>([])
const meals = ref<Meal[]>([])
const activityData = ref<ActivityData>({
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
  position: '左肾',
  detail: '',
  maxDiameter: 'unknown',
  hydronephrosis: 'unknown',
  pain: 'none'
})

const totalDrinkVolume = computed(() => {
  return drinks.value.reduce((sum, drink) => sum + drink.volume, 0)
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
const crystalTypes = [
  { 
    value: 'calcium_oxalate', 
    label: '草酸钙结晶（最常见）', 
    description: '饮食建议：减少草酸食物（菠菜、坚果、巧克力等）' 
  },
  { 
    value: 'uric_acid', 
    label: '尿酸结晶', 
    description: '饮食建议：减少嘌呤食物（海鲜、内脏、啤酒等），避免酸性尿' 
  },
  { 
    value: 'phosphate', 
    label: '磷酸盐结晶', 
    description: '饮食建议：注意碱性尿和感染问题' 
  },
  { 
    value: 'not_specified', 
    label: '医生未说明类型', 
    description: '建议咨询医生明确结晶类型' 
  },
  { 
    value: 'unknown', 
    label: '不清楚', 
    description: '建议进行尿液检查明确结晶类型' 
  }
]

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
// 位置相关函数
const isKidneyPosition = (position: string): boolean => {
  return position === '左肾' || position === '右肾' || position === '双肾'
}

const addLocation = () => {
  const locationToAdd = { ...newLocation.value }
  // 如果不是肾脏位置，清除积水信息
  if (!isKidneyPosition(locationToAdd.position)) {
    locationToAdd.hydronephrosis = undefined
  }
  diagnosisData.value.locations.push(locationToAdd)
  showLocationModal.value = false
  // 清空表单
  newLocation.value = {
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
  if (score < 30) return 'bg-gradient-to-br from-green-100 to-emerald-100 text-green-800 border-2 border-green-300'
  if (score < 60) return 'bg-gradient-to-br from-yellow-100 to-amber-100 text-yellow-800 border-2 border-yellow-300'
  if (score < 80) return 'bg-gradient-to-br from-orange-100 to-red-100 text-orange-800 border-2 border-orange-300'
  return 'bg-gradient-to-br from-red-100 to-rose-100 text-red-800 border-2 border-red-300'
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
      'crystal': '发现尿液结晶',
      'history': '曾患肾结石',
      'current': '正在患肾结石',
      'unknown': '不确定'
    }
    return labels[status] || '未知'
  }

  // 获取结晶类型标签和饮食建议
  const getCrystalTypeInfo = (type?: string) => {
    if (!type) return null
    const info: Record<string, { label: string; dietary_advice: string }> = {
      'calcium_oxalate': {
        label: '草酸钙结晶（最常见）',
        dietary_advice: '减少草酸食物（菠菜、坚果、巧克力、浓茶等），增加钙摄入，多喝水稀释尿液'
      },
      'uric_acid': {
        label: '尿酸结晶',
        dietary_advice: '减少嘌呤食物（海鲜、内脏、啤酒、浓肉汤等），碱化尿液，避免酸性尿'
      },
      'phosphate': {
        label: '磷酸盐结晶',
        dietary_advice: '注意碱性尿和感染问题，控制磷酸盐摄入，治疗尿路感染'
      },
      'not_specified': {
        label: '医生未说明类型',
        dietary_advice: '建议咨询医生明确结晶类型，以便制定针对性饮食方案'
      },
      'unknown': {
        label: '不清楚',
        dietary_advice: '建议进行尿液检查明确结晶类型，以便制定针对性饮食方案'
      }
    }
    return info[type] || null
  }

  const crystalTypeInfo = diagnosisData.value.status === 'crystal' 
    ? getCrystalTypeInfo(diagnosisData.value.crystalType)
    : null

  const prompt = {
    role: '肾结石临床营养助手',
    task: '分析饮食模式与肾结石风险因素，生成结构化数据',
    important_notes: [
      '不提供医学诊断',
      '基于营养科学解释风险机制',
      '必须返回严格的JSON格式',
      '必须根据用户实际输入的数据进行分析，不要编造数据',
      '风险来源和饮料结构必须基于用户实际输入',
      '雷达图评分必须基于实际输入，没有相关数据的维度不要评分或给0分',
      '如果用户有结晶类型信息，必须根据结晶类型给出针对性的饮食建议'
    ],
    user_data: {
      diagnosis: {
        status: diagnosisData.value.status,
        status_label: getStatusLabel(diagnosisData.value.status),
        crystal_type: crystalTypeInfo,
        locations: diagnosisData.value.locations
      },
      daily_drinks: drinks.value.map(d => `${d.type} ${d.volume}ml`),
      total_water_intake: `${totalDrinkVolume.value}ml`,
      meals: meals.value.map(m => ({
        category: m.category,
        items: m.items
      })),
      activity: {
        steps: activityData.value.steps,
        sedentary_hours: activityData.value.sedentaryHours
      }
    },
    output_requirements: {
      format: '必须返回纯 JSON 格式，不要任何其他文字',
      structure: {
        overallScore: '总体风险评分，0-100的数字，根据用户实际输入综合评估',
        riskLevel: '风险等级，必须是以下之一："低风险"、"中等风险"、"较高风险"、"高风险"',
        riskSources: '风险来源数组，根据用户实际输入分析，每项包含 name 和 percentage，总和必须为100',
        drinkStructure: '饮料结构数组，必须基于用户实际输入的饮水记录，每项包含 name 和 value（毫升），如果用户没有输入饮水记录则返回空数组',
        behaviorRadar: {
          categories: '固定5个维度：["饮水充足度", "饮食健康度", "运动活跃度", "饮料选择", "整体习惯"]',
          values: '对应5个维度的评分（0-100分，越高越好），必须根据用户实际输入的数据评分'
        },
        actionSuggestions: 'Top 3 改善建议数组，必须基于用户实际问题，每项包含 action 和 riskReduction'
      },
      analysis_rules: [
        '根据诊断状态调整风险评分：',
        '- 未发现异常(normal)：基础风险分数较低，主要关注预防',
        '- 发现尿液结晶(crystal)：中等风险，需要积极预防',
        '- 曾患肾结石(history)：较高风险，容易复发，需要严格控制',
        '- 正在患肾结石(current)：高风险，需要治疗配合饮食调整',
        '- 不确定(unknown)：按中等风险评估',
        '',
        '结晶类型特定建议（如果用户提供了结晶类型信息）：',
        '- 草酸钙结晶：重点关注草酸食物摄入（菠菜、甜菜、坚果、巧克力、浓茶），建议增加钙摄入（与草酸结合减少吸收），多喝水',
        '- 尿酸结晶：重点关注嘌呤食物摄入（海鲜、动物内脏、啤酒、浓肉汤），建议碱化尿液（多吃蔬菜水果），避免高蛋白饮食',
        '- 磷酸盐结晶：重点关注尿路感染和碱性尿问题，控制磷酸盐摄入，注意尿液pH值',
        '- 未说明类型或不清楚：给出通用预防建议，建议用户咨询医生明确类型',
        '',
        '结石位置和大小影响：',
        '- 下盏结石：较难自行排出，风险较高',
        '- 直径>10mm：需要医疗干预',
        '- 有积水：情况较严重，需要及时就医',
        '- 正在疼痛：急性期，需要紧急处理',
        '',
        '饮水充足度：根据总饮水量评分，2500ml以上为优秀(80-100分)，1500-2500ml为良好(60-80分)，1000-1500ml为一般(40-60分)，1000ml以下为较差(0-40分)',
        '饮食健康度：根据饮食记录综合评估，考虑高盐、高草酸、高蛋白食物的摄入情况，如果有结晶类型信息，重点评估对应类型的高风险食物',
        '运动活跃度：根据步数和久坐时长评分，10000步以上且久坐<4小时为优秀(80-100分)，5000-10000步为良好(60-80分)，5000步以下或久坐>8小时为较差(0-60分)，如果没有输入运动数据则给50分',
        '饮料选择：根据饮料类型评分，白开水、矿泉水为优秀，茶为良好（但草酸钙结晶患者应避免浓茶），含糖饮料、碳酸饮料、酒类为较差（尿酸结晶患者应完全避免啤酒）',
        '整体习惯：综合考虑饮食时间分布、饮水频率等',
        '风险来源必须基于实际输入：如饮水不足、高盐饮食、高草酸食物、高嘌呤食物、久坐、含糖饮料等，如果有结晶类型，优先标注该类型的特定风险因素',
        '饮料结构必须完全匹配用户输入的饮水记录，不要添加用户没有输入的饮料',
        '',
        '改善建议必须针对性：',
        '- 根据诊断状态给出不同紧迫程度的建议',
        '- 如果有结晶类型信息，必须给出该类型特定的饮食建议（如草酸钙结晶避免菠菜，尿酸结晶避免海鲜啤酒）',
        '- 结合结石位置、大小、积水情况给出具体建议',
        '- 如果正在疼痛，建议及时就医'
      ],
      example: {
        overallScore: 45,
        riskLevel: '中等风险',
        riskSources: [
          { name: '饮水不足', percentage: 35 },
          { name: '高草酸食物（菠菜、坚果）', percentage: 25 },
          { name: '高盐饮食', percentage: 18 },
          { name: '含糖饮料', percentage: 12 },
          { name: '久坐', percentage: 10 }
        ],
        drinkStructure: [
          { name: '白开水', value: 1000 },
          { name: '茶', value: 500 },
          { name: '奶茶', value: 300 }
        ],
        behaviorRadar: {
          categories: ['饮水充足度', '饮食健康度', '运动活跃度', '饮料选择', '整体习惯'],
          values: [60, 70, 50, 65, 55]
        },
        actionSuggestions: [
          { action: '每天总饮水量增加至2500ml以上，分多次饮用，稀释尿液浓度', riskReduction: 12 },
          { action: '草酸钙结晶患者应避免菠菜、坚果、巧克力等高草酸食物，每周不超过1次', riskReduction: 8 },
          { action: '减少奶茶等含糖饮料，改喝白开水或淡茶', riskReduction: 10 }
        ]
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
    
    const response = await fetch(import.meta.env.APP_API_BASE_URL + '/chat/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        context: [
          {
            role: 'system',
            content: '你是一位专业的临床营养师，专门从事肾结石预防的饮食指导。你必须返回严格的 JSON 格式数据，不要任何其他文字。分析用户的饮食模式，基于营养科学计算风险评分。',
            reasoning_content: ''
          },
          {
            role: 'user',
            content: promptContent,
            reasoning_content: ''
          }
        ],
        model: 'deepseek-chat',
        temperature: 0.7
      })
    })

    const reader = response.body?.getReader()
    if (!reader) throw new Error('无法读取响应')

    const decoder = new TextDecoder('utf-8')
    let buffer = ''
    let fullText = ''

    while (true) {
      const { value, done } = await reader.read()
      if (done) break
      
      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop() || ''
      
      for (const line of lines) {
        if (line.startsWith('data:')) {
          const jsonString = line.replace('data: ', '').trim()
          if (jsonString === '[DONE]') continue
          
          try {
            const data = JSON.parse(jsonString)
            const content = data?.choices?.[0]?.delta?.content || ''
            if (content) fullText += content
          } catch (e) {
            // ignore parse errors
          }
        }
      }
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
      console.log("result",result)
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


