import { defineStore } from 'pinia';
import { ref } from 'vue';

// 课题信息接口
interface PaperResearch {
  topic: string;
  keywords: string;
  clinicalObservation: string;
}

// LocalStorage 键名
const STORAGE_KEY = 'paper_research_data';

export const usePaperStore = defineStore('paper', () => {
  // 状态
  const topic = ref('');
  const keywords = ref('');
  const clinicalObservation = ref('');

  // 从 localStorage 加载数据
  const loadFromStorage = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const data: PaperResearch = JSON.parse(stored);
        topic.value = data.topic || '';
        keywords.value = data.keywords || '';
        clinicalObservation.value = data.clinicalObservation || '';
      }
    } catch (error) {
      console.error('加载缓存数据失败：', error);
    }
  };

  // 保存到 localStorage
  const saveToStorage = () => {
    try {
      const data: PaperResearch = {
        topic: topic.value,
        keywords: keywords.value,
        clinicalObservation: clinicalObservation.value
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('保存缓存数据失败：', error);
    }
  };

  // 清空所有数据
  const clearAll = () => {
    topic.value = '';
    keywords.value = '';
    clinicalObservation.value = '';
    localStorage.removeItem(STORAGE_KEY);
  };

  // 初始化时加载数据
  loadFromStorage();

  return {
    // 状态
    topic,
    keywords,
    clinicalObservation,
    
    // 方法
    clearAll,
    loadFromStorage,
    saveToStorage
  };
});
