import { ChatInfo } from "@/types/agi";
import { defineStore } from "pinia";

const useChat = defineStore("AGI", () => {
  const chatList = ref<ChatInfo[]>([]);
});
