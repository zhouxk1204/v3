import { User } from "@/models/user.model";
import { defineStore } from "pinia";

const useUserStore = defineStore(
  "user",
  () => {
    const user = ref<User>({
      userId: "",
      avatar: "",
      nickName: "",
      role: "",
    });

    const setUser = (data: User) => {
      user.value = data;
    };

    const updateAvatar = (avatar: string) => {
      user.value.avatar = avatar;
    };

    return {
      user,
      setUser,
      updateAvatar,
    };
  },
  {
    persist: true,
  }
);
export default useUserStore;
