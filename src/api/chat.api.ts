import { http } from "./request";

export const chatWithDeepSeek = (prompt: string) => {
  return http.post<any>(
    "/chat/ask",
    {
      prompt,
    },
    {
      responseType: "stream",
      headers: {
        Accept: "text/event-stream",
      },
    }
  );
};
