'use client';

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
  const width = useSharedValue(schema.initial?.width ?? ('auto' as any));
  const height = useSharedValue(schema.initial?.height ?? ('auto' as any));
  const borderRadius = useSharedValue(schema.initial?.borderRadius ?? 0);

  const propMap: Record<string, any> = {
    opacity, scale, scaleX, scaleY, x, y, rotate, rotateX, rotateY, backgroundColor, width, height, borderRadius
  };

  useEffect(() => {
    // 3. Build Animations
    // We iterate over the known keys and build a sequence for each.

    Object.keys(propMap).forEach(key => {
      const sv = propMap[key];
      const initialVal = schema.initial?.[key as keyof AnimationProperties] ?? sv.value;

      let sequence: any[] = [];
      let currentVal = initialVal;

      schema.steps.forEach(step => {
        const duration = step.duration ?? 500;
        const delay = step.delay ?? 0;
        const easing = getEasing(step.easing);
        const targetVal = step.to[key as keyof AnimationProperties];

        let anim;

        if (targetVal !== undefined) {
          if (step.easing === 'spring' && typeof targetVal === 'number') {
            anim = withSpring(targetVal);
          } else if (typeof targetVal === 'number' || typeof targetVal === 'string') {
            if (targetVal === 'auto') {
              anim = withDelay(duration, withTiming(targetVal as any, { duration: 0 }));
            } else {
              anim = withTiming(targetVal as any, { duration, easing });
            }
          }
          currentVal = targetVal;
        } else {
          if (typeof currentVal === 'number') {
            anim = withTiming(currentVal, { duration, easing: Easing.linear });
          } else {
            anim = withDelay(duration, withTiming(currentVal as any, { duration: 0 }));
          }
        }

        if (anim) {
          if (delay > 0) {
            anim = withDelay(delay, anim);
          }
          sequence.push(anim);
        }
      });

      // 4. Apply Loop / Yoyo
      if (sequence.length > 0) {
        let finalAnim = sequence.length === 1 ? sequence[0] : withSequence(...sequence);

        if (schema.loop) {
          const loops = typeof schema.loop === 'number' ? schema.loop : -1;
          const reverse = schema.yoyo ?? false;
          finalAnim = withRepeat(finalAnim, loops, reverse);
        }

        // Reset and restart
        sv.value = initialVal;
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
