import { AnimationProperties } from '../types/AnimationSchema';

export const normalizeProps = (
  props: AnimationProperties,
  engine: 'reanimated' | 'gsap'
): any => {
  const result: any = { ...props };
  const transforms: any[] = [];

  // Normalize transforms for Reanimated
  if (engine === 'reanimated') {
    if (result.x !== undefined) {
      transforms.push({ translateX: result.x });
      delete result.x;
    }
    if (result.y !== undefined) {
      transforms.push({ translateY: result.y });
      delete result.y;
    }
    if (result.scale !== undefined) {
      transforms.push({ scale: result.scale });
      delete result.scale;
    }
    if (result.scaleX !== undefined) {
      transforms.push({ scaleX: result.scaleX });
      delete result.scaleX;
    }
    if (result.scaleY !== undefined) {
      transforms.push({ scaleY: result.scaleY });
      delete result.scaleY;
    }
    if (result.rotate !== undefined) {
      transforms.push({ rotate: typeof result.rotate === 'number' ? `${result.rotate}deg` : result.rotate });
      delete result.rotate;
    }
    if (result.rotateX !== undefined) {
      transforms.push({ rotateX: typeof result.rotateX === 'number' ? `${result.rotateX}deg` : result.rotateX });
      delete result.rotateX;
    }
    if (result.rotateY !== undefined) {
      transforms.push({ rotateY: typeof result.rotateY === 'number' ? `${result.rotateY}deg` : result.rotateY });
      delete result.rotateY;
    }

    if (transforms.length > 0) {
      result.transform = transforms;
    }
  } else {
    // Normalize for GSAP
    if (result.rotate !== undefined) {
      result.rotation = result.rotate;
      delete result.rotate;
    }
    if (result.rotateX !== undefined) {
      result.rotationX = result.rotateX;
      delete result.rotateX;
    }
    if (result.rotateY !== undefined) {
      result.rotationY = result.rotateY;
      delete result.rotateY;
    }
  }

  return result;
};
