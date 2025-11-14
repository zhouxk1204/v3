import { Confetti } from "./type";

const random = (min: number, max: number): number => {
  return Math.random() * (max - min) + min;
};

export const generateConfettis = (count: number): Confetti[] => {
  const confettis: Confetti[] = [];

  for (let i = 0; i < count; i++) {
    confettis.push({
      id: new Date().getMilliseconds(),
      fallX: random(-50, 50),
      startY: -20,
      endY: 100,
      fallZStart: random(-10, 10),
      fallZEnd: random(-10, 10),
      swayX: random(20, 50),
      swayZ: random(-20, 20),
      spinX: random(360, 720),
      spinY: random(720, 1080),
      spinZ: random(1080, 1440),
      fallDuration: random(3, 5),
      swayDuration: random(1.5, 3),
      spinDuration: random(3, 5),
      delay: random(0, 3),
      hue: Math.random(),
      width: random(6, 12),
      height: random(10, 16),
    });
  }
  return confettis;
};

export const generateConfetti = (id: number): Confetti => {
  return {
    id: id,
    fallX: random(-50, 50),
    startY: -40,
    endY: 100,
    fallZStart: random(-10, 10),
    fallZEnd: random(-10, 10),
    swayX: random(20, 50),
    swayZ: random(-20, 20),
    spinX: random(360, 720),
    spinY: random(720, 1080),
    spinZ: random(1080, 1440),
    fallDuration: random(3, 5),
    swayDuration: random(1.5, 3),
    spinDuration: random(3, 5),
    delay: random(0, 3),
    hue: Math.random(),
    width: random(6, 12),
    height: random(10, 16),
  };
};
