import React, { useEffect } from 'react';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withSpring,
  withSequence,
  withRepeat,
  withDelay,
  Easing,
  WithTimingConfig,
  WithSpringConfig,
} from 'react-native-reanimated';
import { ViewStyle, DimensionValue } from 'react-native';
import { AnimationSchema, AnimationProperties } from '../../types/AnimationSchema';
import { normalizeProps } from '../../utils/schemaUtils';

type ReanimatedDriverProps = {
  schema: AnimationSchema;
  children?: React.ReactNode;
  style?: ViewStyle;
};

// Map string easings to Reanimated Easing functions
const getEasing = (easingName?: string) => {
  switch (easingName) {
    case 'linear': return Easing.linear;
    case 'ease': return Easing.ease;
    case 'ease-in': return Easing.in(Easing.ease);
    case 'ease-out': return Easing.out(Easing.ease);
    case 'ease-in-out': return Easing.inOut(Easing.ease);
    case 'bounce': return Easing.bounce;
    case 'elastic': return Easing.elastic(1);
    default: return Easing.linear;
  }
};

export const ReanimatedDriver: React.FC<ReanimatedDriverProps> = ({ schema, children, style }) => {
  // 1. Identify all animatable properties used in the schema
  const allKeys = new Set<string>();
  if (schema.initial) Object.keys(schema.initial).forEach(k => allKeys.add(k));
  schema.steps.forEach(step => {
    Object.keys(step.to).forEach(k => allKeys.add(k));
  });

  // 2. Initialize SharedValues
  const sharedValues: Record<string, any> = {};

  // We need to use hooks for shared values, so we cannot dynamically create them inside a loop easily
  // without breaking Rules of Hooks if keys change.
  // HOWEVER, for a specific component usage, the schema keys shouldn't change between renders usually.
  // But to be safe and strictly follow hooks, we usually declare known properties.
  // Given the dynamic nature, we can use a map or predefined set of common props.
  // Let's explicitly define common props to be safe.

  const opacity = useSharedValue(schema.initial?.opacity ?? 1);
  const scale = useSharedValue(schema.initial?.scale ?? 1);
  const scaleX = useSharedValue(schema.initial?.scaleX ?? 1);
  const scaleY = useSharedValue(schema.initial?.scaleY ?? 1);
  const x = useSharedValue(schema.initial?.x ?? 0);
  const y = useSharedValue(schema.initial?.y ?? 0);
  const rotate = useSharedValue(schema.initial?.rotate ?? '0deg');
  const rotateX = useSharedValue(schema.initial?.rotateX ?? '0deg');
  const rotateY = useSharedValue(schema.initial?.rotateY ?? '0deg');
  const backgroundColor = useSharedValue(schema.initial?.backgroundColor ?? 'transparent');
  const width = useSharedValue(schema.initial?.width ?? 'auto'); // 'auto' might be tricky for timing
  const height = useSharedValue(schema.initial?.height ?? 'auto');
  const borderRadius = useSharedValue(schema.initial?.borderRadius ?? 0);

  const propMap: Record<string, any> = {
    opacity, scale, scaleX, scaleY, x, y, rotate, rotateX, rotateY, backgroundColor, width, height, borderRadius
  };

  useEffect(() => {
    // 3. Build Animations
    // We iterate over the known keys and build a sequence for each.

    Object.keys(propMap).forEach(key => {
      const sv = propMap[key];
      const initialVal = schema.initial?.[key as keyof AnimationProperties] ?? sv.value; // default

      let sequence: any[] = [];
      let currentVal = initialVal;

      schema.steps.forEach(step => {
        const duration = step.duration ?? 500;
        const easing = getEasing(step.easing);
        const targetVal = step.to[key as keyof AnimationProperties];

        if (targetVal !== undefined) {
          // Property is animated in this step
          // Check if spring or timing
          // For now, default to timing unless 'elastic' or 'bounce' implies spring?
          // The schema uses 'easing', so we stick to withTiming + Easing or withSpring.
          // Reanimated's withSpring doesn't take standard easing functions easily, it uses mass/stiffness.
          // We will stick to `withTiming` with Easing for consistency with GSAP unless specifically requested.

          if (step.easing === 'spring') {
             // Basic spring if requested (though not in our type yet, we can add it or just use elastic easing)
             sequence.push(withSpring(targetVal as number)); // Cast for now
          } else {
             sequence.push(withTiming(targetVal as number, { duration, easing }));
          }
          currentVal = targetVal;
        } else {
          // Property is NOT animated in this step.
          // It must wait (maintain current value) for the duration of the step.
          // This ensures synchronization with other properties.
          sequence.push(withTiming(currentVal as number, { duration, easing: Easing.linear }));
        }
      });

      // 4. Apply Loop / Yoyo
      let finalAnim;
      if (sequence.length > 0) {
        // @ts-ignore
        finalAnim = withSequence(...sequence);

        if (schema.loop) {
          const loops = typeof schema.loop === 'number' ? schema.loop : -1;
          const reverse = schema.yoyo ?? false;
          finalAnim = withRepeat(finalAnim, loops, reverse);
        }

        sv.value = finalAnim;
      }
    });
  }, [schema]); // Re-run if schema changes

  // 5. Apply to style
  const animatedStyle = useAnimatedStyle(() => {
    const transform = [
      { translateX: x.value },
      { translateY: y.value },
      { scale: scale.value },
      { scaleX: scaleX.value },
      { scaleY: scaleY.value },
      { rotate: typeof rotate.value === 'number' ? `${rotate.value}deg` : rotate.value },
      { rotateX: typeof rotateX.value === 'number' ? `${rotateX.value}deg` : rotateX.value },
      { rotateY: typeof rotateY.value === 'number' ? `${rotateY.value}deg` : rotateY.value },
    ];

    // Filter out transforms that are default/unused to avoid clutter?
    // Actually Reanimated handles them fine.

    return {
      opacity: opacity.value,
      backgroundColor: backgroundColor.value,
      width: (width.value === 'auto' ? undefined : width.value) as DimensionValue | undefined,
      height: (height.value === 'auto' ? undefined : height.value) as DimensionValue | undefined,
      borderRadius: borderRadius.value,
      transform,
    };
  });

  return (
    <Animated.View style={[style, animatedStyle]}>
      {children}
    </Animated.View>
  );
};
