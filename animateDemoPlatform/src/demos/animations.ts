import { AnimationSchema } from '../types/AnimationSchema';

export const MarketingModalSchema: AnimationSchema = {
  initial: { opacity: 0, scale: 0 },
  steps: [
    { to: { opacity: 1, scale: 1 }, duration: 600, easing: 'elastic' }
  ],
  loop: false
};

export const FloatingBadgeSchema: AnimationSchema = {
  initial: { y: 0 },
  steps: [
    { to: { y: -15 }, duration: 800, easing: 'ease-in-out' }
  ],
  loop: true,
  yoyo: true
};

export const FadeInUpSchema: AnimationSchema = {
  initial: { opacity: 0, y: 50 },
  steps: [
    { to: { opacity: 1, y: 0 }, duration: 800, easing: 'ease-out' }
  ],
  loop: false
};

export const ShakeSchema: AnimationSchema = {
  initial: { x: 0 },
  steps: [
    { to: { x: -10 }, duration: 50 },
    { to: { x: 10 }, duration: 50 },
    { to: { x: -10 }, duration: 50 },
    { to: { x: 10 }, duration: 50 },
    { to: { x: 0 }, duration: 50 }
  ],
  loop: false
};

export const PulseSchema: AnimationSchema = {
  initial: { scale: 1 },
  steps: [
    { to: { scale: 1.1 }, duration: 800, easing: 'ease-in-out' }
  ],
  loop: true,
  yoyo: true
};

export const DemoAnimations = {
  'Marketing Modal': MarketingModalSchema,
  'Floating Badge': FloatingBadgeSchema,
  'Fade In Up': FadeInUpSchema,
  'Shake': ShakeSchema,
  'Pulse': PulseSchema
};
