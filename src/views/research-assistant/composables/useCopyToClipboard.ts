/**
 * 复制到剪贴板 Composable
 */

import { ref } from 'vue';

export const useCopyToClipboard = () => {
  const showCopySuccess = ref(false);
  const copyTimeout = ref<NodeJS.Timeout | null>(null);

  /**
   * 复制文本到剪贴板
   */
  const copyText = async (text: string, successMessage: string = '已复制到剪贴板'): Promise<boolean> => {
    if (!text) return false;

    try {
      await navigator.clipboard.writeText(text);

      // 显示成功提示
      showCopySuccess.value = true;
      if (copyTimeout.value) {
        clearTimeout(copyTimeout.value);
      }
      copyTimeout.value = setTimeout(() => {
        showCopySuccess.value = false;
      }, 2000);

      return true;
    } catch (error) {
      console.error('复制失败：', error);
      return false;
    }
  };

  /**
   * 复制并显示提示
   */
  const copyWithMessage = async (text: string, message: string): Promise<void> => {
    const success = await copyText(text, message);
    if (!success) {
      throw new Error('复制失败，请手动复制');
    }
  };

  /**
   * 清理定时器
   */
  const cleanup = () => {
    if (copyTimeout.value) {
      clearTimeout(copyTimeout.value);
      copyTimeout.value = null;
    }
  };

  return {
    // 状态
    showCopySuccess,

    // 方法
    copyText,
    copyWithMessage,
    cleanup
  };
};
