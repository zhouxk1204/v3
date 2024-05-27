import { ref } from "vue";

export default function useDeviceType() {
  const deviceType = ref("desktop");

  const checkDeviceType = () => {
    const userAgent = navigator.userAgent;

    if (
      /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        userAgent
      )
    ) {
      deviceType.value = "mobile";
    } else if (/iPad|Tablet|PlayBook|Silk/i.test(userAgent)) {
      deviceType.value = "tablet";
    } else {
      deviceType.value = "desktop";
    }
  };

  checkDeviceType();

  return { deviceType };
}
