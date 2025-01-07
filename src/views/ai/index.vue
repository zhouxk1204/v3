<template>
  <div class="flex flex-col items-center justify-center h-screen overflow-hidden">
    <div class="max-w-[768px] w-full flex-1 overflow-auto pt-5 flex flex-col gap-8 px-5" v-if="chatList.length > 0">
      <div v-for="item in chatList" class="flex gap-5" :class="item.role === 'user' ? 'justify-end' : ''">
        <div class="flex flex-col group">
          <div class="markdown" :class="item.role === 'user' ? 'bg-[#f1f1f1] rounded-2xl px-5' : 'px-5 py-2'"
            v-html="renderMarkdown(item.content)">
          </div>
          <div class="flex gap-[2px] group-hover:opacity-100 opacity-0 transition-opacity duration-200"
            v-if="item.role !== 'user'">
            <el-tooltip class="box-item" effect="dark" content="复制" placement="bottom">
              <button @click="onCopyResult(item.content)"
                class="flex items-center justify-center hover:bg-[#f1f1f1] active:bg-[#f1f1f1] rounded-xl w-8 h-8">
                <el-icon size='18'>
                  <CopyDocument />
                </el-icon>
              </button>
            </el-tooltip>
            <el-tooltip class="box-item" effect="dark" content="重新生成" placement="bottom">
              <button
                class="flex items-center justify-center hover:bg-[#f1f1f1] active:bg-[#f1f1f1] rounded-xl w-8 h-8">
                <el-icon size='18'>
                  <Refresh />
                </el-icon>
              </button>
            </el-tooltip>
          </div>
        </div>
      </div>
    </div>
    <div class="flex flex-col gap-1 max-w-[768px] w-full  px-5 mb-8">
      <div class="flex flex-col gap-1 p-3  bg-[#f1f1f1] rounded-2xl max-w-[768px] w-full">
        <textarea rows="1" v-model="question" class="p-2 bg-[#f1f1f1] outline-none resize-none"
          placeholder="给DeepSeek发送消息" @keydown.enter.prevent="onChat"></textarea>
        <div class="flex justify-end">
          <el-tooltip class="box-item" effect="dark" content="请输入您的问题" placement="top">
            <button @click="onChat"
              :class="question.length === 0 ? 'text-[#f1f1f1] bg-[#cecece] cursor-not-allowed' : 'text-white bg-black'"
              class="w-8 h-8 overflow-hidden rounded-full" :disabled="question.length === 0">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"
                class="icon-2xl">
                <path fill-rule="evenodd" clip-rule="evenodd"
                  d="M15.1918 8.90615C15.6381 8.45983 16.3618 8.45983 16.8081 8.90615L21.9509 14.049C22.3972 14.4953 22.3972 15.2189 21.9509 15.6652C21.5046 16.1116 20.781 16.1116 20.3347 15.6652L17.1428 12.4734V22.2857C17.1428 22.9169 16.6311 23.4286 15.9999 23.4286C15.3688 23.4286 14.8571 22.9169 14.8571 22.2857V12.4734L11.6652 15.6652C11.2189 16.1116 10.4953 16.1116 10.049 15.6652C9.60265 15.2189 9.60265 14.4953 10.049 14.049L15.1918 8.90615Z"
                  fill="currentColor"></path>
              </svg>
            </button>
          </el-tooltip>
        </div>
      </div>
      <p class="fixed bottom-0 left-0 w-full py-2 text-xs text-center text-gray-400">内容由AI生成，请注意甄别</p>
    </div>
  </div>
</template>

<script setup lang='ts'>
import { CopyDocument, Refresh } from "@element-plus/icons-vue";
import { marked } from 'marked'; // 引入 marked 库

const question = ref("");
const chatList = ref<{
  role: string,
  content: string
}[]>([]);

const onChat = () => {
  chatList.value.push({
    role: 'user',
    content: question.value
  })
  fetchStreamData(question.value);
  question.value = '';
}
// 调用示例
// fetchStreamData("hello");

async function fetchStreamData(prompt: string) {
  let message = '';
  const response = await fetch(import.meta.env.APP_API_BASE_URL + "/chat/ask", {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt }),
  });

  // 获取可读流的 reader
  if (!response.body) {
    throw Error('body is null')
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder('utf-8');

  const currentIndex = chatList.value.length;
  chatList.value.push({
    role: 'assistant',
    content: message
  });

  while (true) {
    // 逐块读取流数据
    const { value, done } = await reader.read();
    if (done) {

      break;
    }; // 读取完成

    // 解码数据
    const lines = decoder.decode(value).split('\n');

    // 解析每一行流式数据
    for (let line of lines) {
      if (line.startsWith('data:')) {
        const jsonString = line.replace('data: ', '').trim();

        // 检查流结束标识
        if (jsonString === '[DONE]') {
          console.log('流式数据接收完成');
          console.log('message>>>>>>' + message);
          return;
        }

        try {
          const data = JSON.parse(jsonString);
          const content = data.choices[0]?.delta?.content || '';
          message += content;
          chatList.value[currentIndex].content = message;
          console.log(content); // 输出内容
        } catch (error) {
          console.error('解析错误:', error);
        }
      }
    }
  }
}

const renderMarkdown = (content: string) => {
  const html = marked(content);
  console.log(html);
  return html; // 使用 marked 解析 Markdown
}

const onCopyResult = (content: string) => {
  navigator.clipboard.writeText(content)
    .then(() => {
      console.log('内容已复制到剪贴板');
      ElMessage({
        message: '复制成功',
        type: 'success',
      })
    })
    .catch(err => {
      console.error('复制失败:', err);
    });
}
</script>