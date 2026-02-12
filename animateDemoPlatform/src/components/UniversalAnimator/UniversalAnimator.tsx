'use client';

import React from 'react';
import { ViewStyle } from 'react-native';
import { AnimationSchema } from '../../types/AnimationSchema';
import { ReanimatedDriver } from './ReanimatedDriver';
import { GSAPDriver } from './GSAPDriver';

export type AnimationEngine = 'reanimated' | 'gsap';

export type UniversalAnimatorProps = {
  schema: AnimationSchema;
  engine: AnimationEngine;
  children?: React.ReactNode;
  style?: ViewStyle;
};

export const UniversalAnimator: React.FC<UniversalAnimatorProps> = ({
  schema,
  engine,
  children,
  style,
}) => {
  if (engine === 'reanimated') {
    return (
      <ReanimatedDriver schema={schema} style={style}>
        {children}
      </ReanimatedDriver>
    );
  }

  return (
    <GSAPDriver schema={schema} style={style}>
      {children}
    </GSAPDriver>
  );
};
