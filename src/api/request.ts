import axios, { AxiosInstance, AxiosRequestConfig } from "axios";

import axiosRetry from "axios-retry";
import { ElMessage } from "element-plus"; // 导入Element Plus的ElMessage组件，确保已安装Element Plus

// 定义泛型接口，用于响应数据
export interface ResponseData<T = any> {
  code: number;
  message: string;
  data: T;
}

const instance: AxiosInstance = axios.create({
  // 设置你的API基础URL
  // baseURL: "https://api.zhouxk.fun",
  baseURL: "http://127.0.0.1:3001",
  // 设置请求超时时间
  timeout: 10000,
});

// 创建 Loading 实例
let loading: any;

// 添加axios-retry的配置
axiosRetry(instance, {
  retries: 0, // 设置重试次数
  retryDelay: axiosRetry.exponentialDelay, // 设置重试延迟策略
  shouldResetTimeout: true, // 重试时重置超时时间
});

// 请求拦截器
instance.interceptors.request.use(
  (config) => {
    // 显示 Loading
    loading = ElLoading.service({
      lock: true,
      text: "加载中...",
      background: "rgba(255, 255, 255, 0.1)",
    });

    // 获取请求的路径
    const path = config.url ?? "/";
    if (path.startsWith("/auth")) {
      // 如果是认证相关的请求，添加对应的Authorization头
      config.headers.Authorization = `Bearer ${localStorage.getItem("token")}`;
    } else {
      // 其他情况下不添加Authorization头
    }
    return config;
  },
  (error) => {
    // 隐藏 Loading
    loading.close();
    return Promise.reject(error);
  }
);

// 响应拦截器
instance.interceptors.response.use(
  (response) => {
    // 隐藏 Loading
    loading.close();
    return response.data;
  },
  (error) => {
    // 隐藏 Loading
    // 在响应拦截器中处理错误并显示消息
    loading.close();

    if (error.response) {
      const { status, data } = error.response;
      if (status === 401) {
        // 处理未授权的情况，可以进行相应的操作，比如跳转到登录页
        ElMessage.error(data.error || "未授权，请登录");
      } else {
        // 其他错误情况
        ElMessage.error(data.message || "发生错误，请稍后重试");
      }
    } else if (error.request) {
      // 请求发出，但没有收到响应
      ElMessage.error("网络错误，请检查您的网络连接");
    } else {
      // 在设置请求时发生了一些事情，触发了错误
      ElMessage.error("发生错误，请稍后重试");
    }
    return Promise.reject(error);
  }
);

// 封装请求方法
export const http = {
  get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return instance.get(url, config);
  },
  post<T = any>(
    url: string,
    data?: object,
    config?: AxiosRequestConfig
  ): Promise<T> {
    return instance.post(url, data, config);
  },
  put<T = any>(
    url: string,
    data?: object,
    config?: AxiosRequestConfig
  ): Promise<T> {
    return instance.put(url, data, config);
  },
  delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return instance.delete(url, config);
  },
};
