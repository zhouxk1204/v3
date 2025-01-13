/*
 * @Author: 周小康
 * @Date: 2025-01-13 10:01:33
 * @LastEditors: 周小康
 * @LastEditTime: 2025-01-13 10:02:38
 * @Description: 
 */
export interface ChatInfo {
  role: 'user' | 'assistant',
  content: string;
}