<template>
  <div class="">
    <div class="sticky p-3">
      <div
        class="inline-flex gap-2 hover:bg-[#f7f7f8] rounded-lg p-2 items-center"
      >
        <span>ChatGPT <span class="text-gray-500">3.5</span></span>
        <Icon icon="icon-park-outline:down" />
      </div>
    </div>
    <div class="w-[768px] m-auto">
      <div v-for="chat in chatList">
        <div class="flex gap-4 py-2">
          <div
            class="flex items-center justify-center text-xs text-white bg-orange-400 border rounded-full w-7 h-7"
          >
            34
          </div>
          <div>
            <div class="font-semibold select-none">{{ chat.name }}</div>
            <div>{{ chat.message }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="fixed bottom-0 left-0 right-0 flex justify-center pb-5">
    <div
      class="flex items-center justify-between gap-4 w-[768px] border border-[#ccc] rounded-lg p-2"
    >
      <input
        type="text"
        class="flex-1 outline-none"
        placeholder="Message ChatGPT..."
        v-model="message"
      />
      <button
        @click="onSend()"
        :disabled="message.length === 0"
        class="w-[30px] h-[30px] bg-black rounded-lg flex items-center justify-center disabled:bg-[#e5e5e5]"
      >
        <Icon icon="tabler:arrow-up" class="text-white" width="23" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import axios from "axios";

interface Chat {
  name: string;
  message: string;
}

const chatList = ref<Chat[]>([]);

const message = ref<string>("");

const onSend = async () => {
  chatList.value.push({
    name: "You",
    message: message.value,
  });

  const apiKey = "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"; // 替换为你的 OpenAI API 密钥
  const prompt = message.value; //用户输入的问题  要问的问题

  const apiUrl = "https://api.openai.com/v1/chat/completions"; //固定的地址，api模型
  const headers = {
    "Content-Type": "application/json", //请求头这里不用改
    Authorization: `Bearer ${apiKey}`, //一定要将变量apikey填写正确才可以请求到
  };

  const data = {
    messages: [
      // 定义的角色
      {
        role: "system",
        content: "You are a helpful assistant.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    model: "gpt-3.5-turbo",
  };

  const result = await axios.post(apiUrl, data, { headers });
  console.log("%c Line:83 🍺 result", "color:#33a5ff", result);

  message.value = "";
  console.log("%c Line:21 🍐 message", "color:#ffdd4d", message);
};
</script>
<style lang="scss" scoped></style>
