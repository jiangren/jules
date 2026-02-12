'use client';

import React, { useEffect, useRef } from 'react';
import { View, ViewStyle } from 'react-native';
import gsap from 'gsap';
import { AnimationSchema } from '../../types/AnimationSchema';
import { normalizeProps } from '../../utils/schemaUtils';

type GSAPDriverProps = {
  schema: AnimationSchema;
  children?: React.ReactNode;
  style?: ViewStyle;
};

export const GSAPDriver: React.FC<GSAPDriverProps> = ({ schema, children, style }) => {
  const elementRef = useRef<View>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    // Clean up previous timeline
    if (timelineRef.current) {
      timelineRef.current.kill();
    }

    const element = elementRef.current as unknown as HTMLElement;
    if (!element) return;

    // Initial State
    if (schema.initial) {
      const initialConfig = normalizeProps(schema.initial, 'gsap');
      gsap.set(element, initialConfig);
    }

    // Build Timeline
    const tl = gsap.timeline({
      repeat: typeof schema.loop === 'number' ? schema.loop : (schema.loop ? -1 : 0),
      yoyo: schema.yoyo,
      defaults: { ease: 'power1.out' }
    });

    schema.steps.forEach(step => {
      const { to, duration, delay, easing } = step;
      const config: gsap.TweenVars = normalizeProps(to, 'gsap');

      if (duration !== undefined) config.duration = duration / 1000; // GSAP uses seconds
      if (delay !== undefined) config.delay = delay / 1000;
      if (easing) config.ease = easing;

      tl.to(element, config);
    });

    timelineRef.current = tl;

    return () => {
      tl.kill();
    };
  }, [schema]);

  return (
    <View ref={elementRef} style={style}>
      {children}
    </View>
  );
};
