// throttleDirective.ts

import { ObjectDirective } from "vue";

interface ThrottleOptions {
  handler: Function;
  delay: number;
}

const throttle = (throttleOptions: ThrottleOptions): Function => {
  let lastCalledTime: number | null = null;

  return (...args: any[]) => {
    const now = Date.now();

    if (
      lastCalledTime === null ||
      now - lastCalledTime >= throttleOptions.delay
    ) {
      throttleOptions.handler(...args);
      lastCalledTime = now;
    }
  };
};

export const throttleDirective: ObjectDirective<any, ThrottleOptions> = {
  mounted(el, binding) {
    const options = binding.value || { handler: () => {}, delay: 3000 }; // 默认延迟时间为3000毫秒（即3秒）
    const eventType = binding.arg || "click"; // 通过 binding.arg 获取传递的事件类型
    const throttledHandler = throttle(options);
    el.addEventListener(eventType, throttledHandler);
    el._throttledHandler = throttledHandler;
    el._eventType = eventType;
  },
  beforeUnmount(el: any) {
    el.removeEventListener(el._eventType, el._throttledHandler);
  },
};
