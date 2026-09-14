export type MobileMotionCue = {
  id: number;
  signature: string;
  variables: Readonly<Record<`--mobile-motion-${string}`, string>>;
};

const MOBILE_CUE_COUNT = 1000;
const mobileFamilies = ["tap", "swipe", "snap", "dock", "fold", "peek", "nudge", "settle"] as const;
const mobileEasings = [
  "cubic-bezier(.23,1,.32,1)",
  "cubic-bezier(.16,1,.3,1)",
  "cubic-bezier(.22,.8,.32,1)",
  "cubic-bezier(.2,.9,.25,1)",
] as const;

function signed(value: number, modulus: number) {
  return (value % modulus) - Math.floor(modulus / 2);
}

function createMobileMotionCue(index: number): MobileMotionCue {
  const id = 3001 + index;
  const family = mobileFamilies[index % mobileFamilies.length];
  const x = signed(index * 17, 15);
  const y = signed(index * 23, 13);
  const scale = 0.972 + ((index * 19) % 12) / 1000;
  const tilt = signed(index * 7, 17) / 10;
  const delay = 18 + ((index * 37) % 183);
  const duration = 160 + ((index * 61) % 151);
  const easing = mobileEasings[index % mobileEasings.length];

  return {
    id,
    signature: `${family}-${x}-${y}-${scale.toFixed(3)}-${tilt.toFixed(1)}-${delay}-${duration}-${easing}`,
    variables: {
      "--mobile-motion-x": `${x}px`,
      "--mobile-motion-y": `${y}px`,
      "--mobile-motion-scale": scale.toFixed(3),
      "--mobile-motion-tilt": `${tilt.toFixed(1)}deg`,
      "--mobile-motion-delay": `${delay}ms`,
      "--mobile-motion-duration": `${duration}ms`,
      "--mobile-motion-ease": easing,
    },
  };
}

export const mobileMotionCueRegistry = Array.from(
  { length: MOBILE_CUE_COUNT },
  (_, index) => createMobileMotionCue(index),
);

function hashRoute(pathname: string) {
  return Array.from(pathname).reduce(
    (hash, character) => ((hash * 31) + character.charCodeAt(0)) >>> 0,
    29,
  );
}

export function getMobileMotionCue(pathname: string, targetIndex: number) {
  const index = (hashRoute(pathname) + (targetIndex * 131)) % MOBILE_CUE_COUNT;
  return mobileMotionCueRegistry[index]!;
}

export function applyMobileMotionCue(target: HTMLElement, pathname: string, targetIndex: number) {
  const cue = getMobileMotionCue(pathname, targetIndex);
  target.dataset.mobileMotionCue = String(cue.id);
  Object.entries(cue.variables).forEach(([property, value]) => target.style.setProperty(property, value));
  return cue;
}
