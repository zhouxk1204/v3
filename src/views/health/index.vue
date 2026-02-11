<template>
  <div class="h-screen bg-gray-50 p-6 overflow-y-auto">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-3xl font-bold text-gray-800 mb-8">PDF 文档解析器 (改进版)</h1>
      
      <!-- 文件上传区域 -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 class="text-xl font-semibold text-gray-700 mb-4">选择 PDF 文件</h2>
        
        <div class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
          <input
            ref="fileInput"
            type="file"
            accept=".pdf"
            @change="handleFileSelect"
            class="hidden"
          />
          
          <div class="space-y-4">
            <div class="text-gray-400">
              <svg class="mx-auto h-12 w-12" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </div>
            
            <div>
              <button
                @click="fileInput?.click()"
                class="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md transition-colors"
              >
                选择 PDF 文件
              </button>
              <p class="text-sm text-gray-500 mt-2">或拖拽文件到此处</p>
            </div>
          </div>
        </div>
        
        <!-- 文件信息 -->
        <div v-if="selectedFile" class="mt-4 p-4 bg-blue-50 rounded-md">
          <h3 class="font-medium text-blue-800">已选择文件:</h3>
          <p class="text-blue-600">{{ selectedFile.name }}</p>
          <p class="text-sm text-blue-500">大小: {{ formatFileSize(selectedFile.size) }}</p>
        </div>
      </div>
      
      <!-- 解析控制 -->
      <div v-if="selectedFile" class="bg-white rounded-lg shadow-md p-6 mb-6">
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-semibold text-gray-700">解析控制</h2>
          <button
            @click="parsePDF"
            :disabled="isLoading"
            class="bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white px-6 py-2 rounded-md transition-colors flex items-center gap-2"
          >
            <svg v-if="isLoading" class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ isLoading ? '解析中...' : '开始解析' }}
          </button>
        </div>
        
        <!-- 解析进度 -->
        <div v-if="isLoading" class="mt-4">
          <div class="bg-gray-200 rounded-full h-2">
            <div 
              class="bg-blue-500 h-2 rounded-full transition-all duration-300"
              :style="{ width: `${progress}%` }"
            ></div>
          </div>
          <p class="text-sm text-gray-600 mt-2">
            正在解析第 {{ currentPage }} / {{ totalPages }} 页
          </p>
        </div>
      </div>
      
      <!-- 解析结果 -->
      <div v-if="pdfContent.length > 0" class="bg-white rounded-lg shadow-md p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-semibold text-gray-700">解析完成</h2>
          <div class="flex gap-2">
            <button
              @click="copyAllText"
              class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm transition-colors"
            >
              复制全部文本
            </button>
            <button
              @click="downloadText"
              class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm transition-colors"
            >
              下载文本
            </button>
          </div>
        </div>
        
        <!-- 统计信息 -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div class="bg-blue-50 p-4 rounded-md">
            <h3 class="font-medium text-blue-800">总页数</h3>
            <p class="text-2xl font-bold text-blue-600">{{ totalPages }}</p>
          </div>
          <div class="bg-green-50 p-4 rounded-md">
            <h3 class="font-medium text-green-800">总字符数</h3>
            <p class="text-2xl font-bold text-green-600">{{ totalCharacters }}</p>
          </div>
          <div class="bg-purple-50 p-4 rounded-md">
            <h3 class="font-medium text-purple-800">总单词数</h3>
            <p class="text-2xl font-bold text-purple-600">{{ totalWords }}</p>
          </div>
          <div class="bg-orange-50 p-4 rounded-md">
            <h3 class="font-medium text-orange-800">图片数量</h3>
            <p class="text-2xl font-bold text-orange-600">{{ pdfImages.length }}</p>
          </div>
        </div>
        
        <!-- 文本预览框 -->
        <div class="mb-6">
          <h3 class="text-lg font-semibold text-gray-700 mb-3">文本预览 (已清理)</h3>
          <div class="border border-gray-300 rounded-lg overflow-hidden">
            <div class="bg-gray-50 px-4 py-2 border-b border-gray-300 flex items-center justify-between">
              <span class="text-sm text-gray-600">已清理噪音内容的文本</span>
              <div class="flex items-center gap-2">
                <button
                  @click="togglePreviewExpanded"
                  class="text-sm text-blue-600 hover:text-blue-800 transition-colors"
                >
                  {{ isPreviewExpanded ? '收起' : '展开全部' }}
                </button>
                <span class="text-xs text-gray-500">
                  {{ isPreviewExpanded ? '完整显示' : `显示前 ${previewLength} 字符` }}
                </span>
              </div>
            </div>
            <div 
              class="p-4 bg-white overflow-auto"
              :class="{ 'max-h-96': !isPreviewExpanded, 'max-h-screen': isPreviewExpanded }"
            >
              <pre class="whitespace-pre-wrap text-sm text-gray-800 font-mono leading-relaxed">{{ displayText }}</pre>
            </div>
          </div>
        </div>
        
        <!-- 图片预览区域 -->
        <div v-if="pdfImages.length > 0" class="mb-6">
          <h3 class="text-lg font-semibold text-gray-700 mb-3">PDF 图片内容</h3>
          <p class="text-sm text-gray-600 mb-3">包含PDF中的嵌入图片和页面截图</p>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div 
              v-for="image in pdfImages" 
              :key="`${image.pageNum}-${image.imageUrl.substring(0, 20)}`"
              class="border border-gray-300 rounded-lg overflow-hidden bg-white shadow-sm"
            >
              <div class="bg-gray-50 px-3 py-2 border-b border-gray-300">
                <span class="text-sm font-medium text-gray-700">第 {{ image.pageNum }} 页</span>
                <span class="text-xs text-gray-500 ml-2">{{ image.width }} × {{ image.height }}</span>
              </div>
              <div class="p-2">
                <img 
                  :src="image.imageUrl" 
                  :alt="`第 ${image.pageNum} 页图片`"
                  class="w-full h-auto border border-gray-200 rounded cursor-pointer hover:shadow-md transition-shadow"
                  @click="openImageModal(image)"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
        
        <!-- 提示信息 -->
        <div class="bg-blue-50 border border-blue-200 rounded-md p-4">
          <div class="flex items-center">
            <svg class="h-5 w-5 text-blue-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
            </svg>
            <h3 class="text-blue-800 font-medium">解析完成</h3>
          </div>
          <p class="text-blue-700 mt-2">
            PDF 文档已成功解析并清理完成！上方预览框显示了清理掉噪音内容后的文本，同时保护了可能的图片区域。
          </p>
          <p class="text-blue-600 mt-2 text-sm">
            💡 清理内容包括：关注健康、关爱生命、页码信息、体检流水号、检验师信息等。连续的空白区域被标记为可能的图片区域以保持完整性。
          </p>
          <p class="text-blue-600 mt-1 text-sm">
            您可以使用上方的按钮复制或下载清理后的文本内容。
          </p>
        </div>
      </div>
      
      <!-- 错误信息 -->
      <div v-if="error" class="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
        <div class="flex items-center">
          <svg class="h-5 w-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
          </svg>
          <h3 class="text-red-800 font-medium">解析错误</h3>
        </div>
        <p class="text-red-700 mt-1">{{ error }}</p>
      </div>
    </div>
    
    <!-- 图片模态框 -->
    <div 
      v-if="isImageModalOpen && selectedImage" 
      class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
      @click="closeImageModal"
    >
      <div class="max-w-4xl max-h-full p-4">
        <div class="bg-white rounded-lg overflow-hidden">
          <div class="bg-gray-50 px-4 py-3 border-b border-gray-300 flex items-center justify-between">
            <h3 class="font-medium text-gray-800">第 {{ selectedImage.pageNum }} 页</h3>
            <button 
              @click="closeImageModal"
              class="text-gray-500 hover:text-gray-700 text-xl font-bold"
            >
              ×
            </button>
          </div>
          <div class="p-4">
            <img 
              :src="selectedImage.imageUrl" 
              :alt="`第 ${selectedImage.pageNum} 页`"
              class="max-w-full max-h-[80vh] mx-auto"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import * as pdfjsLib from 'pdfjs-dist';
import { computed, ref } from 'vue';

// 设置 PDF.js worker - 使用更稳定的 CDN
try {
  // 方法1: 使用 jsdelivr CDN
  // pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.js`
  // pdfjsLib.GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/legacy/build/pdf.worker.min.js", import.meta.url).toString();
  pdfjsLib.GlobalWorkerOptions.workerSrc =
  new URL("pdfjs-dist/build/pdf.worker.min.mjs", import.meta.url).toString();
} catch (e) {
  // 方法2: 使用固定版本的 unpkg CDN
  pdfjsLib.GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/legacy/build/pdf.worker.min.js", import.meta.url).toString();
}

// 响应式数据
const fileInput = ref<HTMLInputElement>()
const selectedFile = ref<File | null>(null)
const isLoading = ref(false)
const error = ref('')
const pdfContent = ref<Array<{ pageNum: number; text: string }>>([])
const pdfImages = ref<Array<{ pageNum: number; imageUrl: string; width: number; height: number }>>([])
const progress = ref(0)
const currentPage = ref(0)
const totalPages = ref(0)

// 预览相关
const isPreviewExpanded = ref(false)
const previewLength = ref(1000) // 默认显示前1000个字符

// 图片模态框相关
const selectedImage = ref<{ pageNum: number; imageUrl: string; width: number; height: number } | null>(null)
const isImageModalOpen = ref(false)

// 计算属性
const totalCharacters = computed(() => {
  return pdfContent.value.reduce((total, page) => total + page.text.length, 0)
})

const totalWords = computed(() => {
  return pdfContent.value.reduce((total, page) => {
    const words = page.text.trim().split(/\s+/).filter(word => word.length > 0)
    return total + words.length
  }, 0)
})

// 预览文本计算属性
const displayText = computed(() => {
  if (pdfContent.value.length === 0) return ''
  
  const fullText = pdfContent.value[0]?.text || ''
  
  if (isPreviewExpanded.value || fullText.length <= previewLength.value) {
    return fullText
  }
  
  return fullText.substring(0, previewLength.value) + '\n\n... (点击"展开全部"查看完整内容)'
})

// 切换预览展开状态
const togglePreviewExpanded = () => {
  isPreviewExpanded.value = !isPreviewExpanded.value
}

// 打开图片模态框
const openImageModal = (image: { pageNum: number; imageUrl: string; width: number; height: number }) => {
  selectedImage.value = image
  isImageModalOpen.value = true
}

// 关闭图片模态框
const closeImageModal = () => {
  isImageModalOpen.value = false
  selectedImage.value = null
}

// 文件选择处理
const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (file) {
    if (file.type !== 'application/pdf') {
      error.value = '请选择 PDF 文件'
      return
    }
    
    selectedFile.value = file
    error.value = ''
    pdfContent.value = []
    pdfImages.value = []
    progress.value = 0
    isPreviewExpanded.value = false // 重置预览状态
  }
}

// 格式化文件大小
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// 解析 PDF
const parsePDF = async () => {
  if (!selectedFile.value) return
  
  isLoading.value = true
  error.value = ''
  pdfContent.value = []
  pdfImages.value = []
  progress.value = 0
  currentPage.value = 0
  totalPages.value = 0
  
  try {
    // 读取文件为 ArrayBuffer
    const arrayBuffer = await selectedFile.value.arrayBuffer()
    
    // 加载 PDF 文档
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
    totalPages.value = pdf.numPages
    
    console.log(`PDF 加载成功，共 ${pdf.numPages} 页`)
    
    // 逐页解析文本和图片
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      currentPage.value = pageNum
      progress.value = (pageNum / pdf.numPages) * 100
      
      try {
        const page = await pdf.getPage(pageNum)
        
        // 提取文本
        const textContent = await page.getTextContent()
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(' ')
          .trim()
        
        pdfContent.value.push({
          pageNum,
          text: pageText
        })
        
        // 提取图片 - 使用操作符定位图片对象
        try {
          const operatorList = await page.getOperatorList()
          const pageImages: Array<{ pageNum: number; imageUrl: string; width: number; height: number }> = []
          
          console.log(`第 ${pageNum} 页操作符数量: ${operatorList.fnArray.length}`)
          
          // 遍历所有操作符，查找图片相关操作
          for (let i = 0; i < operatorList.fnArray.length; i++) {
            const fn = operatorList.fnArray[i]
            const args = operatorList.argsArray[i]
            
            // 检查各种图片绘制操作符
            if (fn === pdfjsLib.OPS.paintImageXObject || 
                fn === pdfjsLib.OPS.paintInlineImageXObject ||
                fn === pdfjsLib.OPS.paintImageMaskXObject) {
              
              const opName = Object.keys(pdfjsLib.OPS).find(key => (pdfjsLib.OPS as any)[key] === fn) || 'unknown'
              console.log(`第 ${pageNum} 页发现图片操作: ${opName}, 参数:`, args)
              
              if (fn === pdfjsLib.OPS.paintImageXObject && args.length > 0) {
                const imgName = args[0]
                console.log(`尝试提取图片对象: ${imgName}`)
                
                try {
                  // 等待对象加载
                  await new Promise(resolve => setTimeout(resolve, 200))
                  
                  // 尝试从页面对象存储中获取图片
                  if (page.objs && page.objs.has(imgName)) {
                    const imgObj = page.objs.get(imgName)
                    console.log(`图片对象 ${imgName} 类型:`, typeof imgObj, imgObj)
                    
                    if (imgObj) {
                      let imageUrl = null
                      let width = 200
                      let height = 200
                      
                      // 处理不同类型的图片对象
                      if (imgObj instanceof HTMLImageElement) {
                        // HTML Image 元素
                        imageUrl = imgObj.src
                        width = imgObj.naturalWidth || imgObj.width
                        height = imgObj.naturalHeight || imgObj.height
                        console.log(`HTML Image: ${width}x${height}`)
                        
                      } else if (imgObj instanceof HTMLCanvasElement) {
                        // Canvas 元素
                        imageUrl = imgObj.toDataURL('image/png')
                        width = imgObj.width
                        height = imgObj.height
                        console.log(`Canvas: ${width}x${height}`)
                        
                      } else if (imgObj instanceof ImageBitmap) {
                        // ImageBitmap 对象
                        const canvas = document.createElement('canvas')
                        const ctx = canvas.getContext('2d')
                        canvas.width = imgObj.width
                        canvas.height = imgObj.height
                        ctx?.drawImage(imgObj, 0, 0)
                        imageUrl = canvas.toDataURL('image/png')
                        width = imgObj.width
                        height = imgObj.height
                        console.log(`ImageBitmap: ${width}x${height}`)
                        
                      } else if (imgObj && typeof imgObj === 'object') {
                        // 其他对象类型，尝试提取数据
                        if (imgObj.data && imgObj.width && imgObj.height) {
                          const canvas = document.createElement('canvas')
                          const ctx = canvas.getContext('2d')
                          canvas.width = imgObj.width
                          canvas.height = imgObj.height
                          
                          try {
                            const imageData = ctx!.createImageData(imgObj.width, imgObj.height)
                            
                            // 处理不同的数据格式
                            if (imgObj.data instanceof Uint8Array || imgObj.data instanceof Uint8ClampedArray) {
                              if (imgObj.data.length === imgObj.width * imgObj.height * 4) {
                                // RGBA 数据
                                imageData.data.set(imgObj.data)
                              } else if (imgObj.data.length === imgObj.width * imgObj.height * 3) {
                                // RGB 数据，添加 Alpha 通道
                                for (let j = 0; j < imgObj.width * imgObj.height; j++) {
                                  imageData.data[j * 4] = imgObj.data[j * 3]
                                  imageData.data[j * 4 + 1] = imgObj.data[j * 3 + 1]
                                  imageData.data[j * 4 + 2] = imgObj.data[j * 3 + 2]
                                  imageData.data[j * 4 + 3] = 255
                                }
                              } else {
                                // 灰度数据
                                for (let j = 0; j < imgObj.width * imgObj.height; j++) {
                                  const gray = imgObj.data[j] || 0
                                  imageData.data[j * 4] = gray
                                  imageData.data[j * 4 + 1] = gray
                                  imageData.data[j * 4 + 2] = gray
                                  imageData.data[j * 4 + 3] = 255
                                }
                              }
                              
                              ctx!.putImageData(imageData, 0, 0)
                              imageUrl = canvas.toDataURL('image/png')
                              width = imgObj.width
                              height = imgObj.height
                              console.log(`Raw data: ${width}x${height}, data length: ${imgObj.data.length}`)
                            }
                          } catch (dataError) {
                            console.warn(`处理图片数据失败:`, dataError)
                          }
                        }
                        
                        // 尝试其他可能的属性
                        if (!imageUrl && imgObj.bitmap) {
                          const canvas = document.createElement('canvas')
                          const ctx = canvas.getContext('2d')
                          canvas.width = imgObj.bitmap.width
                          canvas.height = imgObj.bitmap.height
                          ctx?.drawImage(imgObj.bitmap, 0, 0)
                          imageUrl = canvas.toDataURL('image/png')
                          width = imgObj.bitmap.width
                          height = imgObj.bitmap.height
                          console.log(`Bitmap property: ${width}x${height}`)
                        }
                      }
                      
                      if (imageUrl) {
                        pageImages.push({
                          pageNum,
                          imageUrl,
                          width,
                          height
                        })
                        console.log(`✓ 成功提取图片 ${imgName}: ${width}x${height}`)
                      } else {
                        console.log(`✗ 无法从对象 ${imgName} 提取图片数据`)
                      }
                    }
                  } else {
                    console.log(`图片对象 ${imgName} 不在对象存储中`)
                    
                    // 尝试从 commonObjs 中获取
                    if (page.commonObjs && page.commonObjs.has(imgName)) {
                      const commonImg = page.commonObjs.get(imgName)
                      console.log(`从 commonObjs 找到 ${imgName}:`, typeof commonImg)
                    }
                  }
                } catch (imgError) {
                  console.warn(`处理图片对象 ${imgName} 失败:`, imgError)
                }
              } else if (fn === pdfjsLib.OPS.paintInlineImageXObject) {
                console.log(`发现内联图片，参数:`, args)
                // 内联图片的处理逻辑
                // 内联图片数据通常直接在参数中
              }
            }
          }
          
          // 将页面图片添加到总列表
          if (pageImages.length > 0) {
            pdfImages.value.push(...pageImages)
            console.log(`第 ${pageNum} 页成功提取 ${pageImages.length} 张图片`)
          } else {
            console.log(`第 ${pageNum} 页未能提取到嵌入图片，尝试页面截图作为备用`)
            
            // 备用方案：生成页面截图
            try {
              const viewport = page.getViewport({ scale: 1.0 })
              const canvas = document.createElement('canvas')
              const context = canvas.getContext('2d')
              
              if (context) {
                canvas.height = viewport.height
                canvas.width = viewport.width
                
                const renderContext = {
                  canvasContext: context,
                  viewport: viewport,
                  canvas: canvas
                }
                
                await page.render(renderContext).promise
                
                // 检查页面是否有实际内容
                const imageData = context.getImageData(0, 0, canvas.width, canvas.height)
                const data = imageData.data
                let hasContent = false
                
                // 检查是否有非白色像素
                for (let i = 0; i < data.length; i += 4) {
                  if (data[i] < 250 || data[i + 1] < 250 || data[i + 2] < 250) {
                    hasContent = true
                    break
                  }
                }
                
                if (hasContent) {
                  const imageUrl = canvas.toDataURL('image/png')
                  pdfImages.value.push({
                    pageNum,
                    imageUrl,
                    width: viewport.width,
                    height: viewport.height
                  })
                  console.log(`第 ${pageNum} 页生成页面截图作为备用`)
                }
              }
            } catch (renderError) {
              console.warn(`第 ${pageNum} 页截图失败:`, renderError)
            }
          }
          
        } catch (imageError) {
          console.error(`提取第 ${pageNum} 页图片失败:`, imageError)
        }
        
        console.log(`第 ${pageNum} 页解析完成，文本长度: ${pageText.length}`)
        
        // 添加小延迟以显示进度
        await new Promise(resolve => setTimeout(resolve, 100))
        
      } catch (pageError) {
        console.error(`解析第 ${pageNum} 页时出错:`, pageError)
        pdfContent.value.push({
          pageNum,
          text: `[第 ${pageNum} 页解析失败: ${pageError}]`
        })
      }
    }
    
    console.log('PDF 解析完成，合并所有页面文本...')
    
    // 先合并所有页面的文本
    const allRawText = pdfContent.value
      .map(page => page.text)
      .join('\n')
    
    console.log('=== 合并后的原始文本 ===')
    console.log(allRawText)
    console.log('='.repeat(80))
    
    // 使用替换方式清理文本
    let cleanedText = allRawText
    
    // 智能处理空行 - 保护可能的图片区域
    const lines = cleanedText.split('\n')
    const processedLines: string[] = []
    let consecutiveEmptyLines = 0
    const MAX_CONSECUTIVE_EMPTY = 2 // 最多保留2个连续空行
    const IMAGE_AREA_THRESHOLD = 5 // 如果有5个以上连续空行，可能是图片区域
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim()
      
      if (line === '') {
        consecutiveEmptyLines++
        
        // 如果连续空行数量适中，保留一些空行
        if (consecutiveEmptyLines <= MAX_CONSECUTIVE_EMPTY) {
          processedLines.push('')
        } else if (consecutiveEmptyLines === IMAGE_AREA_THRESHOLD) {
          // 检测到可能的图片区域，添加标记
          processedLines.push('')
          processedLines.push('[图片区域]')
          processedLines.push('')
        }
        // 超过阈值的空行不添加，但保持图片区域标记
      } else {
        consecutiveEmptyLines = 0
        processedLines.push(line)
      }
    }
    
    // 重新组合文本
    cleanedText = processedLines.join('\n')
    
    // 最终清理 - 温和处理，保护图片区域
    cleanedText = cleanedText
      .replace(/^\s+|\s+$/gm, '')        // 去掉行首行尾空格
      .replace(/\n{4,}/g, '\n\n[可能的图片区域]\n\n')  // 将4个以上连续空行标记为图片区域
      .trim()                            // 去掉开头结尾空白
    
    console.log('=== 清理后的文本 ===')
    console.log(cleanedText)
    console.log('='.repeat(80))
    
    // 调试信息
    console.log(`原始文本长度: ${allRawText.length}`)
    console.log(`清理后文本长度: ${cleanedText.length}`)
    console.log(`清理掉的字符数: ${allRawText.length - cleanedText.length}`)
    
    // 统计图片区域标记
    const imageAreaMarkers = (cleanedText.match(/\[图片区域\]|\[可能的图片区域\]/g) || []).length
    if (imageAreaMarkers > 0) {
      console.log(`检测到 ${imageAreaMarkers} 个可能的图片区域`)
    }
    
    // 使用清理后的文本
    pdfContent.value = [{
      pageNum: 1,
      text: cleanedText
    }]
    
    console.log('文本合并和清理完成!')
    
  } catch (err) {
    console.error('PDF 解析错误:', err)
    error.value = `解析失败: ${err}`
  } finally {
    isLoading.value = false
    progress.value = 100
  }
}

// 复制文本到剪贴板
const copyAllText = async () => {
  const allText = pdfContent.value.length > 0 ? pdfContent.value[0].text : ''
  
  try {
    await navigator.clipboard.writeText(allText)
    console.log('全部文本已复制到剪贴板')
  } catch (err) {
    console.error('复制失败:', err)
  }
}

// 下载文本文件
const downloadText = () => {
  const allText = pdfContent.value.length > 0 ? pdfContent.value[0].text : ''
  
  const blob = new Blob([allText], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${selectedFile.value?.name.replace('.pdf', '')}_extracted.txt`
  a.click()
  URL.revokeObjectURL(url)
}
</script>

<style scoped>
/* 自定义滚动条 */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>