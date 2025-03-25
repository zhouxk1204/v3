<template>
  <div ref="chatContainerDomRef" class="relative flex flex-col items-center overflow-hidden h-100dvh pb-[150px]"
    :class="chatList.length === 0 ? 'justify-center' : ''">
    <!-- <div class="fixed left-0 right-0 z-10 flex items-center justify-center bottom-40">
      <button @click="onGoToBottom" v-show="!isBottom && isScrollbarShow"
        class="flex items-center justify-center w-10 h-10 bg-white border rounded-full shadow-xl">
        <el-icon>
          <Bottom />
        </el-icon>
      </button>
    </div> -->
    <div v-if="chatList.length !== 0"
      class="hide-scrollbar max-w-[768px] w-full flex-1 overflow-y-auto overflow-x-hidden py-5 flex flex-col gap-8 px-4 relative">
      <div v-for="(item, index) in chatList" class="flex w-full gap-2"
        :class="item.role === 'user' ? 'justify-end' : ''">
        <div class="flex-none" v-if="item.role !== 'user'" :class="isDeepThinking ? '' : 'pt-3'">
          <img src="/peach.png" alt="peach" class="border rounded-full p-[6px] w-9 h-9">
        </div>

        <div :class="item.role === 'user' ? 'flex flex-col justify-end items-end max-w-[66%]' : 'flex flex-col pt-1'">
          <div class="flex flex-col items-start gap-3" v-if="item.role === 'assistant' && isDeepThinking">
            <button
              class="px-[14px] py-[7px] text-xs bg-gray-100 rounded-[10px] hover:bg-[#e9e8e8] text-[#262626] flex items-center gap-1"
              @click="isShowReasoning = !isShowReasoning">
              <span>{{ item.reasoning_content.length > 0 ? "已深度思考" : '正在思考...' }}</span>
              <el-icon v-if="isShowReasoning">
                <ArrowUp />
              </el-icon>
              <el-icon v-else>
                <ArrowDown />
              </el-icon></button>
            <div class="flex gap-3 my-1 reasoner" v-if="item.reasoning_content.length > 0">
              <div class="bg-[#e5e5e5] w-[2px]">&nbsp;</div>
              <div class="text-gray-400 text-sm leading-[1.8]" v-html="renderMarkdown(item.reasoning_content)">
              </div>
            </div>
          </div>
          <div class="mt-3 loader" v-if="isLoading && item.role !== 'user' && index === chatList.length - 1"></div>
          <div class="flex flex-col flex-1 markdown"
            :class="item.role === 'user' ? 'bg-red-300 text-white rounded-[32px] px-[18px] w-full' : ''"
            v-html="renderMarkdown(item.content)">
          </div>
          <div class="flex gap-[2px]" v-if="item.role !== 'user' && !isLoading">
            <el-tooltip class="box-item" effect="dark" content="复制" placement="bottom">
              <button @click="onCopyResult(item.content)"
                class="flex items-center justify-center hover:bg-[#f1f1f1] active:bg-[#f1f1f1] rounded-xl w-8 h-8">
                <el-icon size='18'>
                  <CopyDocument />
                </el-icon>
                <el-icon size='18'>
                  <Check />
                </el-icon>
              </button>
            </el-tooltip>
          </div>
        </div>
      </div>
    </div>
    <div class="flex flex-col gap-1 max-w-[768px] w-full flex-1 fixed px-4 bg-white"
      :class="chatList.length > 0 ? 'bottom-0' : 'top-1/2 -translate-y-1/2'">
      <div class="flex flex-col items-center justify-center gap-2 mb-2" v-if="chatList.length === 0">
        <div class="flex items-center gap-2">
          <img src="/peach.png" alt="peach" class="w-12 md:w-24 drop-shadow-[0px_0px_7px_#f99b52]">
          <strong class="pr-6 text-5xl text-glow md:text-8xl" data-shadow="Peach AI">Peach AI</strong>
        </div>
        <Typewriter :contents="slogans"></Typewriter>
      </div>
      <div class="flex flex-col gap-1 p-3 bg-white rounded-2xl max-w-[768px] w-full border shadow-primary">
        <el-form :model="form">
          <el-form-item label="">
            <el-input :input-style="{
              backgroundColor: '#fff',
              border: 'none',
              height: '34px',
              boxShadow: 'none'
            }" size="large" resize="none" :autosize="{ minRows: 1, maxRows: 12 }" v-model="form.question"
              @compositionstart="isComposing = true" @compositionend="isComposing = false" @keydown="onEnter"
              placeholder="给Peach AI发送消息" type="textarea" />
          </el-form-item>
          <div class="flex justify-between">
            <div class="flex items-center flex-none gap-2">
              <Dropdown v-model="currentModel" :options="models" class="w-36"></Dropdown>
              <el-switch size="large" v-model="contextMode" class="ml-2"
                style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949" />
              <span class="text-xs text-gray-400">{{ contextMode ? '开启' : '关闭' }}记忆</span>
            </div>
            <!-- <button @click="onChat"
              :class="isQuestionEmpty ? 'text-[#f1f1f1] bg-[#cecece] cursor-not-allowed' : 'text-white bg-black'"
              class="flex items-center justify-center w-8 h-8 overflow-hidden rounded-full" :disabled="isQuestionEmpty">
              <img src="../../../public/icons/stop.svg" alt="send" v-if="isLoading" class="w-7 h-7">
              <img src="../../../public/icons/up.svg" alt="send" v-else>
            </button> -->
            <div v-show="isLoading" class="w-10 h-10 p-1 text-white bg-black rounded-full cursor-pointer">
              <img src="../../../public/icons/stop.svg" alt="stop" @click="abortRequest">
            </div>
            <div v-show="!isLoading" class="w-10 h-10 p-1 text-white rounded-full"
              :class="isQuestionEmpty ? 'bg-[#cecece] cursor-not-allowed' : 'bg-black cursor-pointer'">
              <img src="../../../public/icons/up.svg" alt="up" @click="onChat">
            </div>
          </div>
        </el-form>
      </div>
      <p class="w-full py-2 text-xs text-center text-gray-400 bg-white">内容由AI生成，请注意甄别</p>
    </div>
  </div>
</template>

<script setup lang='ts'>
import { ArrowDown, ArrowUp, Check, CopyDocument } from "@element-plus/icons-vue";
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-light.css'; // 引入样式
import _ from "lodash";
import { marked } from 'marked'; // 引入 marked 库
import { useAiModel } from "./useAiModel";
import { useAiRequest } from "./useAiRequest";


// 模型定义相关
const { models, currentModel, isDeepThinking } = useAiModel();

// ai接口调用
const { getResult, abortRequest } = useAiRequest();

const isLoading = ref(false);
const isShowReasoning = ref(true);
const chatList = ref<{
  role: string,
  content: string
  reasoning_content: string
}[]>([
  // {
  //   "role": "user",
  //   "content": "你是什么模型",
  //   "reasoning_content": '',
  // },
  // {
  //   "role": "user",
  //   "content": "五个ts的工具函数"
  // },
  // {
  //   "role": "assistant",
  //   "content": "以下是五个常用的 TypeScript 工具函数示例，涵盖了常见的开发需求：\n\n---\n\n### 1. **深拷贝对象**\n```typescript\nfunction deepClone<T>(obj: T): T {\n  return JSON.parse(JSON.stringify(obj));\n}\n\n// 示例\nconst original = { a: 1, b: { c: 2 } };\nconst cloned = deepClone(original);\nconsole.log(cloned); // { a: 1, b: { c: 2 } }\n```\n\n---\n\n### 2. **防抖函数**\n```typescript\nfunction debounce<T extends (...args: any[]) => any>(fn: T, delay: number): (...args: Parameters<T>) => void {\n  let timeoutId: ReturnType<typeof setTimeout>;\n  return (...args: Parameters<T>) => {\n    clearTimeout(timeoutId);\n    timeoutId = setTimeout(() => fn(...args), delay);\n  };\n}\n\n// 示例\nconst logMessage = debounce((message: string) => {\n  console.log(message);\n}, 300);\n\nlogMessage(\"Hello, World!\"); // 300ms 后打印 \"Hello, World!\"\n```\n\n---\n\n### 3. **节流函数**\n```typescript\nfunction throttle<T extends (...args: any[]) => any>(fn: T, limit: number): (...args: Parameters<T>) => void {\n  let inThrottle: boolean;\n  return (...args: Parameters<T>) => {\n    if (!inThrottle) {\n      fn(...args);\n      inThrottle = true;\n      setTimeout(() => (inThrottle = false), limit);\n    }\n  };\n}\n\n// 示例\nconst logScroll = throttle(() => {\n  console.log(\"Scrolling...\");\n}, 1000);\n\nwindow.addEventListener(\"scroll\", logScroll); // 每 1 秒最多打印一次 \"Scrolling...\"\n```\n\n---\n\n### 4. **检查对象是否为空**\n```typescript\nfunction isEmpty(obj: Record<string, any>): boolean {\n  return Object.keys(obj).length === 0;\n}\n\n// 示例\nconst emptyObj = {};\nconst nonEmptyObj = { a: 1 };\n\nconsole.log(isEmpty(emptyObj)); // true\nconsole.log(isEmpty(nonEmptyObj)); // false\n```\n\n---\n\n### 5. **生成随机字符串**\n```typescript\nfunction generateRandomString(length: number): string {\n  const chars = \"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789\";\n  let result = \"\";\n  for (let i = 0; i < length; i++) {\n    result += chars.charAt(Math.floor(Math.random() * chars.length));\n  }\n  return result;\n}\n\n// 示例\nconst randomStr = generateRandomString(10);\nconsole.log(randomStr); // 例如 \"aB3dE7fG9h\"\n```\n\n---\n\n这些工具函数可以帮助你在 TypeScript 项目中更高效地处理常见任务。如果需要进一步优化或扩展功能，可以根据具体需求进行调整。"
  // }
  // {
  //   "role": "assistant",
  //   "reasoning_content": '您好！我是由中国的深度求索（DeepSeek）公司开发的智能助手DeepSeek-R1。如您有任何任何问题，我会尽我所能为您提供帮助。',
  //   "content": "您好！我是由中国的深度求索（DeepSeek）公司开发的智能助手DeepSeek-R1。如您有任何任何问题，我会尽我所能为您提供帮助。"
  // }
]);

const slogans = [
  "有什么可以帮忙的？",
  "需要帮助？AI随时为你服务！",
  "让AI成为你的得力助手",
  "有什么问题？AI来帮忙！",
  "AI，随时准备提供帮助",
  "用AI，让每个问题都迎刃而解",
  "有什么需要，AI随时待命",
  "智能助手，帮你轻松应对挑战",
  "AI在这里，任何事都能帮忙",
  "无论什么问题，AI帮你解决"
];

const form = reactive({
  question: ''
})

// 是否开启上下文模式
const contextMode = ref(false);


const isComposing = ref(false);
// const isScrollbarShow = ref(false);
// const chatAreaDomRef = ref();

// const { isBottom, checkScrollbar } = useScrollBar(chatAreaDomRef.value);

const isQuestionEmpty = computed<boolean>(() => {
  return form.question.length === 0;
});

const onChat = () => {
  if (isQuestionEmpty.value) return;

  const question = {
    role: 'user',
    content: form.question,
    reasoning_content: ''
  };

  chatList.value.push(question);

  const context = _.cloneDeep(chatList.value);

  const answer = {
    role: 'assistant',
    content: "",
    reasoning_content: "",
  };
  chatList.value.push(answer);

  const currentIndex = chatList.value.length - 1;

  isLoading.value = true;
  getResult({
    body: {
      context: context,
      model: currentModel.value.value,
      temperature: 1.0,
    },
    onProcess: (contentChunk, reasoningContentChunk) => {
      chatList.value[currentIndex].content += contentChunk;
      console.log('answer.content', answer.content);
      if (isDeepThinking.value) {
        chatList.value[currentIndex].reasoning_content += reasoningContentChunk;
      }
    },
    onError: (errorMessage: string) => {
      console.error('onError', errorMessage);
      isLoading.value = false;
      chatList.value[currentIndex].content = '服务器繁忙，请稍后再试。'
    },
    onDone: () => {
      isLoading.value = false;
    }
  });

  form.question = '';

}

const onEnter = (event: any) => {
  if (event.key === "Enter" && !event.shiftKey && !event.altKey && !isComposing.value) {
    event.preventDefault();
    onChat();
  }
}

// async function fetchStreamData(questionItem: {
//   role: string,
//   content: string
// }) {
//   let message = '';
//   let reasoningContext = '';
//   chatList.value.push({
//     role: 'assistant',
//     content: "",
//     reasoning_content: "",
//   });
//   const body = {
//     context: contextMode.value ? chatList.value : [questionItem],
//     model: currentModel.value.value,
//     temperature: 1,
//   }
//   const response = await fetch(import.meta.env.APP_API_BASE_URL + "/chat/ask", {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify(body),
//   });

//   // 获取可读流的 reader
//   if (!response.body) {
//     throw Error('body is null')
//   }

//   const reader = response.body.getReader();
//   const decoder = new TextDecoder('utf-8');

//   const currentIndex = chatList.value.length - 1;

//   while (true) {
//     // 逐块读取流数据
//     const { value, done } = await reader.read();
//     if (done) {
//       break;
//     }; // 读取完成

//     // 解码数据
//     const lines = decoder.decode(value).split('\n');

//     // 解析每一行流式数据
//     for (let line of lines) {
//       if (line.startsWith('data:')) {
//         const jsonString = line.replace('data: ', '').trim();

//         // 检查流结束标识
//         if (jsonString === '[DONE]') {
//           isLoading.value = true;
//           return;
//         }

//         try {
//           const data = JSON.parse(jsonString);
//           const content = data.choices[0]?.delta?.content || '';
//           const reason = data.choices[0]?.delta?.reasoning_content || '';
//           message += content;
//           reasoningContext += reason;
//           chatList.value[currentIndex].content = message;
//           chatList.value[currentIndex].reasoning_content = reasoningContext;
//         } catch (error) {
//           chatList.value[currentIndex].content = '系统繁忙，请稍后再试！';
//         }
//       }
//     }
//   }
// }

const renderMarkdown = (content: string) => {
  // 使用 marked 解析 Markdown 为 HTML
  let html = marked(content) as string;
  // 替换生成的 HTML 中的 <pre> 标签，插入语言名称和复制按钮
  html = html.replace(/<pre><code class="language-(\w+)">([\s\S]*?)<\/code><\/pre>/g, (_match, language, code) => {
    // 生成替换的 HTML
    return `
      <pre><div class="flex items-center justify-between px-4 py-2 text-xs bg-gray-100">
        <span>${language}</span>
        <button class="copy-btn" data-clipboard-text="${code}">复制</button>
      </div><code class="language-${language}">${code}</code></pre>
    `;
  });

  // 等到 DOM 渲染完成后，再高亮代码
  nextTick(() => {
    // 找到所有的 code 块
    const codeBlocks = document.querySelectorAll('pre code');
    codeBlocks.forEach((block: any) => {
      if (!block.hasAttribute('data-highlighted')) {
        hljs.highlightBlock(block); // 高亮每个代码块
      }
    });
    // 为所有的复制按钮绑定点击事件
    const copyButtons = document.querySelectorAll('.copy-btn');
    copyButtons.forEach((button: any) => {
      // 检查是否已经注册过事件
      if (!button.hasAttribute('data-click-registered')) {
        button.addEventListener('click', () => {
          const text = button.getAttribute('data-clipboard-text');
          if (text) {
            // 执行复制操作
            onCopyResult(text);
          }
        });
        // 标记为已注册
        button.setAttribute('data-click-registered', 'true');
      }
    });
    // isScrollbarShow.value = checkScrollbar();
  });
  return html;
}

const onCopyResult = (content: string) => {
  navigator.clipboard.writeText(content)
    .then(() => {
      ElMessage({
        message: '复制成功',
        type: 'success',
      })
    })
    .catch(err => {
      console.error('复制失败:', err);
    });
}

// const onGoToBottom = () => {
//   chatAreaDomRef.value.scrollTo({
//     top: chatAreaDomRef.value.scrollHeight,
//     behavior: 'smooth'
//   })
// }

</script>
<style lang="scss" scoped>
.hide-scrollbar {
  overflow-y: auto;
  /* 允许垂直滚动 */
}

.hide-scrollbar::-webkit-scrollbar {
  display: none;
  /* 隐藏 Chrome, Safari 和 Opera 的滚动条 */
}

.hide-scrollbar {
  -ms-overflow-style: none;
  /* IE 和 Edge */
  scrollbar-width: none;
  /* Firefox */
}

:deep(.el-textarea__inner:focus) {
  box-shadow: none;
  box-shadow: none;
}

.custom-select .el-select__inner {
  border: none;
  box-shadow: none;
}

.loader {
  width: 24px;
  aspect-ratio: 1;
  border-radius: 50%;
  background:
    radial-gradient(farthest-side, rgb(252 165 165 / 1) 94%, #0000) top/3px 3px no-repeat,
    conic-gradient(#0000 30%, rgb(252 165 165 / 1));
  -webkit-mask: radial-gradient(farthest-side, #0000 calc(100% - 3px), #000 0);
  animation: l13 1s infinite linear;
}

@keyframes l13 {
  100% {
    transform: rotate(1turn)
  }
}

.text-glow {
  display: inline-block;
  position: relative;
  color: #f99b52;
  text-shadow: .03em .03em 0 white;
}

.text-glow:after {
  content: attr(data-shadow);
  position: absolute;
  top: .06em;
  left: .06em;
  z-index: -1;
  text-shadow: none;
  background-image:
    linear-gradient(45deg,
      transparent 45%,
      #f99b52 45%,
      #f99b52 55%,
      transparent 0);
  background-size: .05em .05em;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;

  animation: shad-anim 15s linear infinite;
}

@keyframes shad-anim {
  0% {
    background-position: 0 0
  }

  0% {
    background-position: 100% -100%
  }
}
</style>