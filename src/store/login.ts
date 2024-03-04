import { defineStore } from "pinia";

export interface BgInfo {
  url: string;
  label: string;
}

const useLoginStore = defineStore(
  "login",
  () => {
    const wordList = [
      "Love is the greatest refreshment in life。",
      "I will follow you to the end of time",
      "Love without end hath no end.",
      "Love is a fire which burns unseen。",
      "Distance makes the hearts grow fonder。",
      "Love's tongue is in the eyes.",
    ];

    const imgList: BgInfo[] = Object.keys(
      import.meta.glob("@/assets/img/bg/*.avif")
    ).map((_, i) => {
      const url = new URL(`../assets/img/bg/${i + 1}.avif`).href;
      return {
        url,
        label: wordList[i],
      };
    });

    const currentIndex = ref(1);

    const update = (index: number) => {
      currentIndex.value = index;
    };

    const refresh = (index: number) => {
      currentIndex.value = index;
      const prevIndex = getPrevIndex(index);
      const nextIndex = getNextIndex(index);
      return {
        prev: imgList[prevIndex],
        cur: imgList[index],
        next: imgList[nextIndex],
      };
    };

    const getNextIndex = (index: number): number => {
      return index === imgList.length - 1 ? 0 : index + 1;
    };

    const getPrevIndex = (index: number): number => {
      return index === 0 ? imgList.length - 1 : index - 1;
    };

    const getCurrentBgInfo = () => {
      return imgList[currentIndex.value];
    };

    return {
      update,
      refresh,
      getNextIndex,
      getPrevIndex,
      getCurrentBgInfo,
      currentIndex,
    };
  },
  {
    persist: true,
  }
);
export default useLoginStore;
