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

// --- New Demos ---

export const RedPacketLidSchema: AnimationSchema = {
  initial: { rotateX: '0deg' },
  steps: [
    { to: { rotateX: '180deg' }, duration: 600, easing: 'ease-in-out' }
  ],
  loop: false
};

export const RedPacketCoinSchema: AnimationSchema = {
  initial: { y: 20, opacity: 0, scale: 0.5 },
  steps: [
    { to: { y: -100, opacity: 1, scale: 1.2 }, duration: 800, delay: 400, easing: 'spring' }
  ],
  loop: false
};

export const JumpingDotSchema: AnimationSchema = {
  initial: { y: 0 },
  steps: [
    { to: { y: -25 }, duration: 300, easing: 'ease-out' },
    { to: { y: 0 }, duration: 300, easing: 'ease-in' },
    { to: { y: 0 }, duration: 200 } // pause
  ],
  loop: true
};

export const DemoAnimations = {
  'Marketing Modal': MarketingModalSchema,
  'Floating Badge': FloatingBadgeSchema,
  'Fade In Up': FadeInUpSchema,
  'Shake': ShakeSchema,
  'Pulse': PulseSchema,
  'Red Packet': RedPacketLidSchema, // Placeholder, custom component will handle details
  'Sequential Jumping': JumpingDotSchema // Placeholder
};
