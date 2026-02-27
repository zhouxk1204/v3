import { http } from "../request";

/**
 * 聊天消息
 */
export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
  reasoning_content?: string;
}

/**
 * 聊天请求体
 */
export interface ChatRequestBody {
  context: ChatMessage[];
  model: string;
  temperature?: number;
}

/**
 * 聊天响应
 */
export interface ChatResponse {
  id: string;
  choices: Array<{
    finish_reason: string;
    index: number;
    message: {
      content: string;
      role: string;
    };
  }>;
  created: number;
  model: string;
  object: string;
  usage: {
    completion_tokens: number;
    prompt_tokens: number;
    total_tokens: number;
  };
}

/**
 * deepseek API
 * @param requestBody - 聊天请求体
 * @param timeout - 超时时间（毫秒），默认 60 秒
 */
export const chatCompletions = (requestBody: ChatRequestBody, timeout: number = 1000 * 60) => {
  return http.post<ChatResponse>("/chat/completions", requestBody, { timeout });
};
/**
 * SSE 流式响应的数据块
 */
export interface StreamChunk {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    delta: {
      role?: string;
      content?: string;
      reasoning_content?: string;
    };
    finish_reason: string | null;
  }>;
}

/**
 * 聊天流式 API（SSE）
 * @param requestBody - 聊天请求体
 * @param onMessage - 接收到消息时的回调函数
 * @param onError - 发生错误时的回调函数
 * @param onComplete - 完成时的回调函数
 * @returns 返回一个 abort 函数用于取消请求
 */
export const chatStream = (
  requestBody: ChatRequestBody,
  onMessage: (chunk: StreamChunk) => void,
  onError?: (error: Error) => void,
  onComplete?: () => void
): (() => void) => {
  const controller = new AbortController();
  const signal = controller.signal;

  const baseURL = import.meta.env.APP_API_BASE_URL || '';
  
  fetch(`${baseURL}/chat/stream`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'text/event-stream',
    },
    body: JSON.stringify(requestBody),
    signal,
  })
    .then(async (response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('无法读取响应流');
      }

      const decoder = new TextDecoder('utf-8');
      let buffer = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data:')) {
            const jsonString = line.replace('data:', '').trim();
            
            if (jsonString === '[DONE]') {
              onComplete?.();
              return;
            }

            try {
              const chunk: StreamChunk = JSON.parse(jsonString);
              onMessage(chunk);
            } catch (e) {
              console.error('解析 SSE 数据失败:', e, jsonString);
            }
          }
        }
      }

      onComplete?.();
    })
    .catch((error) => {
      if (error.name === 'AbortError') {
        console.log('请求已取消');
      } else {
        onError?.(error);
      }
    });

  // 返回取消函数
  return () => controller.abort();
};
