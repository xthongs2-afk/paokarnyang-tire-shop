export type MotionCue = {
  id: number;
  signature: string;
  variables: Readonly<Record<`--motion-${string}`, string>>;
};

const CUE_COUNT = 1000;
const cueFamilies = ["lift", "drift", "arc", "tilt", "rise", "settle", "glide", "focus"] as const;
const cueEasings = [
  "cubic-bezier(.23,1,.32,1)",
  "cubic-bezier(.16,1,.3,1)",
  "cubic-bezier(.22,.8,.32,1)",
  "cubic-bezier(.2,.9,.25,1)",
] as const;

function signed(value: number, modulus: number) {
  return (value % modulus) - Math.floor(modulus / 2);
}

function createMotionCue(index: number): MotionCue {
  const id = 1001 + index;
  const family = cueFamilies[index % cueFamilies.length];
  const x = signed(index * 7, 23);
  const y = signed(index * 11, 19);
  const scale = 0.965 + ((index * 13) % 17) / 1000;
  const tilt = signed(index * 5, 29) / 10;
  const delay = 24 + ((index * 43) % 251);
  const duration = 180 + ((index * 59) % 211);
  const easing = cueEasings[index % cueEasings.length];

  return {
    id,
    signature: `${family}-${x}-${y}-${scale.toFixed(3)}-${tilt.toFixed(1)}-${delay}-${duration}-${easing}`,
    variables: {
      "--motion-x": `${x}px`,
      "--motion-y": `${y}px`,
      "--motion-scale": scale.toFixed(3),
      "--motion-tilt": `${tilt.toFixed(1)}deg`,
      "--motion-delay": `${delay}ms`,
      "--motion-duration": `${duration}ms`,
      "--motion-ease": easing,
    },
  };
}

export const motionCueRegistry = Array.from({ length: CUE_COUNT }, (_, index) => createMotionCue(index));

function hashRoute(pathname: string) {
  return Array.from(pathname).reduce((hash, character) => ((hash * 31) + character.charCodeAt(0)) >>> 0, 17);
}

export function getMotionCue(pathname: string, targetIndex: number) {
  const index = (hashRoute(pathname) + (targetIndex * 97)) % CUE_COUNT;
  return motionCueRegistry[index]!;
}

export function applyMotionCue(target: HTMLElement, pathname: string, targetIndex: number) {
  const cue = getMotionCue(pathname, targetIndex);
  target.dataset.motionCue = String(cue.id);
  Object.entries(cue.variables).forEach(([property, value]) => target.style.setProperty(property, value));
  return cue;
}
