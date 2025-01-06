<template>
  <div>{{ message }}</div>
</template>

<script setup lang='ts'>
// import axios from 'axios';

const message = ref('');

// 调用示例
fetchStreamData("hello");

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