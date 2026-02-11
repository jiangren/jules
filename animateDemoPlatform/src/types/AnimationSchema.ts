export type EasingType =
  | 'linear'
  | 'ease'
  | 'ease-in'
  | 'ease-out'
  | 'ease-in-out'
  | 'bounce'
  | 'elastic'
  | 'spring';

export type AnimationProperties = {
  opacity?: number;
  scale?: number;
  scaleX?: number;
  scaleY?: number;
  x?: number; // translateX
  y?: number; // translateY
  rotate?: string | number; // e.g., "90deg" or 90
  rotateX?: string | number;
  rotateY?: string | number;
  backgroundColor?: string;
  width?: number | string;
  height?: number | string;
  borderRadius?: number;
};

export type AnimationStep = {
  to: AnimationProperties;
  duration?: number; // milliseconds
  delay?: number; // milliseconds
  easing?: EasingType;
};

export type AnimationSchema = {
  initial?: AnimationProperties;
  steps: AnimationStep[];
  loop?: boolean | number; // true = infinite, number = count
  yoyo?: boolean; // reverse on return
};
