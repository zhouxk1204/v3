<template>
  <div class="flex items-center justify-center min-h-screen">
    <div class="flex flex-col gap-1 p-3  bg-[#f1f1f1] rounded-2xl max-w-[768px] w-full">
      <textarea class="p-2 bg-[#f1f1f1] outline-none resize-none" placeholder="给DeepSeek发送消息"></textarea>
      <div class="flex justify-end">
        <button class="w-8 h-8 overflow-hidden text-white bg-black rounded-full">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"
            class="icon-2xl">
            <path fill-rule="evenodd" clip-rule="evenodd"
              d="M15.1918 8.90615C15.6381 8.45983 16.3618 8.45983 16.8081 8.90615L21.9509 14.049C22.3972 14.4953 22.3972 15.2189 21.9509 15.6652C21.5046 16.1116 20.781 16.1116 20.3347 15.6652L17.1428 12.4734V22.2857C17.1428 22.9169 16.6311 23.4286 15.9999 23.4286C15.3688 23.4286 14.8571 22.9169 14.8571 22.2857V12.4734L11.6652 15.6652C11.2189 16.1116 10.4953 16.1116 10.049 15.6652C9.60265 15.2189 9.60265 14.4953 10.049 14.049L15.1918 8.90615Z"
              fill="currentColor"></path>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang='ts'>
// import axios from 'axios';

const message = ref('');

// 调用示例
// fetchStreamData("hello");

async function fetchStreamData(prompt: string) {
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

  while (true) {
    // 逐块读取流数据
    const { value, done } = await reader.read();
    if (done) break; // 读取完成

    // 解码数据
    const lines = decoder.decode(value).split('\n');

    // 解析每一行流式数据
    for (let line of lines) {
      if (line.startsWith('data:')) {
        const jsonString = line.replace('data: ', '').trim();

        // 检查流结束标识
        if (jsonString === '[DONE]') {
          console.log('流式数据接收完成');
          return;
        }

        try {
          const data = JSON.parse(jsonString);
          const content = data.choices[0]?.delta?.content || '';
          message.value += content;
          console.log(content); // 输出内容
        } catch (error) {
          console.error('解析错误:', error);
        }
      }
    }
  }
}

</script>
<style lang="scss" scoped></style>