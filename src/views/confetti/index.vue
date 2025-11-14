<template>
  <div class="w-full h-[100dvh] relative overflow-hidden">
    <div
      class="fall"
      v-for="conf in confettis"
      :key="conf.id"
      :style="{
        '--w': conf.width + 'px',
        '--h': conf.height + 'px',
        '--hue': conf.hue,
        '--fall-x': conf.fallX + 'vw',
        '--fall-start-y': conf.startY + 'px',
        '--fall-end-y': conf.endY + 'vh',
        '--fall-z-start': conf.fallZStart + 'px',
        '--fall-z-end': conf.fallZEnd + 'px',
        '--sway-x': conf.swayX + 'px',
        '--sway-z': conf.swayZ + 'px',
        '--spin-x': conf.spinX + 'deg',
        '--spin-y': conf.spinY + 'deg',
        '--spin-z': conf.spinZ + 'deg',
        '--fall-duration': conf.fallDuration + 's',
        '--sway-duration': conf.swayDuration + 's',
        '--spin-duration': conf.spinDuration + 's',
        '--delay': conf.delay + 's',
      }"
    >
      <div class="spin">
        <div :class="`absolute confetti preserve-3d`"></div>
      </div>
    </div>
    <div
      class="absolute text-[20vw] md:text-[10vw] -translate-x-1/2 -translate-y-1/2 text top-1/2 left-1/2 font-bold w-full text-center"
    >
      <Typewriter :contents="positiveSentences"></Typewriter>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Confetti } from "./type";
import { generateConfetti } from "./utils";
const positiveSentences = [
  "HAVE A GREAT DAY!",
  "SMILE AND SHINE!",
  "JOY IS EVERYWHERE!",
  "LET'S HAVE FUN!",
  "FEEL THE ENERGY!",
  "KEEP SMILING!",
  "MAKE TODAY AWESOME!",
  "LOVE AND LAUGHTER!",
  "SHINE BRIGHT TODAY!",
  "BE HAPPY NOW!",
  "DREAM BIG!",
  "GOOD VIBES ONLY!",
  "HAPPINESS IS HERE!",
  "YOU ARE AMAZING!",
  "SPREAD CHEER!",
  "ENJOY EVERY MOMENT!",
  "STAY POSITIVE!",
  "BRIGHT DAYS AHEAD!",
  "LET YOUR SPARKLE SHOW!",
  "CELEBRATE LIFE!",
];

const confettis = ref<Confetti[]>([]);
let i = 0;
const MAX_CONFETTI = 101;

const addConfetti = () => {
  if (confettis.value.length < MAX_CONFETTI) {
    confettis.value.push(generateConfetti(i++));
  }
  requestAnimationFrame(addConfetti);
};
addConfetti();

const del = () => {
  if (confettis.value.length > MAX_CONFETTI) {
    confettis.value.shift();
  }
  requestAnimationFrame(del);
};
setTimeout(() => {
  del();
}, 5000);
</script>
<style lang="scss" scoped>
.confetti {
  will-change: transform;
  backface-visibility: hidden; /* 减少重绘 */
  position: absolute;
  top: var(--fall-start-y, -40px);
  left: calc(50vw + var(--fall-x, 0px));
  width: var(--w);
  height: var(--h);
  background-color: hsl(calc(360 * var(--hue, 0.5)), 80%, 60%);
  transform-origin: center;
  animation: spin var(--spin-duration, 1.2s) ease-in-out infinite;
}

.fall {
  animation: fall var(--fall-duration, 3s) ease-in infinite var(--delay, 0s);
}

.spin {
  animation: sway var(--sway-duration, 2s) ease-in-out infinite alternate;
}

@keyframes fall {
  0% {
    transform: translate3d(
      0,
      var(--fall-start-y, -40px),
      var(--fall-z-start, 0px)
    );
  }
  100% {
    transform: translate3d(
      var(--fall-x, 0px),
      var(--fall-end-y, 110vh),
      var(--fall-z-end, 0px)
    );
  }
}

@keyframes sway {
  0% {
    transform: translateX(calc(var(--sway-x, 30px) * -1))
      translateZ(var(--sway-z, 20px));
  }
  100% {
    transform: translateX(var(--sway-x, 30px))
      translateZ(calc(var(--sway-z, 20px) * -1));
  }
}

@keyframes spin {
  0% {
    transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg);
  }
  100% {
    transform: rotateX(var(--spin-x, 360deg)) rotateY(var(--spin-y, 720deg))
      rotateZ(var(--spin-z, 1080deg));
  }
}

.text {
  font-family: Arial, Helvetica, sans-serif;
  font-size: 48px;
  font-weight: bold;
  background-image: linear-gradient(
    -225deg,
    #69eacb 0%,
    #eaccf8 48%,
    #6654f1 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
}
</style>
