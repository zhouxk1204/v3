import { useAiModel } from "./useAiModel";

// 定义一个常量对象，包含不同任务的评分
const Temperature = {
  CODE_GENERATION_MATH_SOLVING: 0.0,
  DATA_EXTRACTION_ANALYSIS: 1.0,
  GENERAL_CONVERSATION: 1.3,
  TRANSLATION: 1.3,
  CREATIVE_WRITING_POETRY: 1.5,
} as const;

export interface DeepSeekOptions {
  body: {
    context: {
      role: string;
      content: string;
      reasoning_content: string;
    }[];
    model: string;
    temperature: (typeof Temperature)[keyof typeof Temperature];
  };
  onProcess: (contentChunk: string, reasoningContentChunk: string) => void;
  onError: (errorMessage: string) => void;
  onDone: () => void;
}

const parseJsonWithErrorHandling = (jsonString: string): any | null => {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("JSON parse error:", error);
    return null;
  }
};

export function useAiRequest() {
  let controller: AbortController | null = null; // Declare the controller for aborting

  const { isDeepThinking } = useAiModel(); // Get the value once

  // Method to abort the current request
  const abortRequest = (): void => {
    if (controller) {
      controller.abort(); // Abort the fetch request
      controller = null; // Reset the controller after abort
    }
  };

  const getResult = async (option: DeepSeekOptions) => {
    const { body, onProcess, onDone, onError } = option;
    // Create a new AbortController instance for the new request
    controller = new AbortController();

    try {
      // Send the request with the signal from the controller
      const response = await fetch(
        import.meta.env.APP_API_BASE_URL + "/chat/ask",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
          signal: controller.signal, // Attach the signal to the fetch request
        }
      );

      console.log(response);

      const reader = response.body?.getReader();
      if (!reader) {
        onError("Unable to read response body");
        return;
      }

      const decoder = new TextDecoder("utf-8");

      while (true) {
        const { value, done } = await reader.read();

        if (done) break;

        const lines = decoder.decode(value).split("\n");

        for (let line of lines) {
          if (line.startsWith("data:")) {
            const jsonString = line.replace("data: ", "").trim();

            if (jsonString === "[DONE]") {
              onDone();
              return;
            }

            const data = parseJsonWithErrorHandling(jsonString);
            if (!data) {
              onError("Failed to parse data");
              return;
            }

            const contentChunk = data?.choices[0]?.delta?.content || "";
            const reasoningContentChunk = isDeepThinking.value
              ? data?.choices[0]?.delta?.reasoning_content || ""
              : "";

            onProcess(contentChunk, reasoningContentChunk);
          }
        }
      }
    } catch (error: any) {
      console.log("%c Line:108 🍏 error", "color:#4fff4B", error);
      // Handle errors such as network issues or abortion
      if (error.name === "AbortError") {
        onError("Request was aborted");
      } else {
        console.error("Request failed", error);
        onError(error.message || "Unknown error");
      }
    }
  };

  return {
    getResult,
    abortRequest, // Expose the abort method
  };
}
