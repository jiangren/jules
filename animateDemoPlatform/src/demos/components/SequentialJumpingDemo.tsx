'use client';

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { UniversalAnimator } from '../../components/UniversalAnimator';
import { AnimationSchema, AnimationStep } from '../../types/AnimationSchema';

type SequentialJumpingDemoProps = {
  engine: 'reanimated' | 'gsap';
};

const DOT_SIZE = 20;
const JUMP_HEIGHT = -30;
const UP_DUR = 300;
const DOWN_DUR = 300;
const TOTAL_CYCLE = 1200; // Total loop time
const STAGGER = 200;

const createDotSchema = (delay: number): AnimationSchema => {
  const activeTime = UP_DUR + DOWN_DUR;
  const restTime = TOTAL_CYCLE - activeTime;

  // We need to distribute restTime before and after the active phase based on delay.
  // Sequence: Wait(delay) -> Up -> Down -> Wait(restTime - delay)
  // Ensure delay < restTime for this simple logic.

  const initialWait = delay;
  const finalWait = restTime - delay;

  const steps: AnimationStep[] = [];

  if (initialWait > 0) {
    // Wait at initial position (y=0)
    steps.push({ to: { y: 0 }, duration: initialWait });
  }

  steps.push({ to: { y: JUMP_HEIGHT }, duration: UP_DUR, easing: 'ease-out' as const });
  steps.push({ to: { y: 0 }, duration: DOWN_DUR, easing: 'ease-in' as const });

  if (finalWait > 0) {
    steps.push({ to: { y: 0 }, duration: finalWait });
  }

  return {
    initial: { y: 0, opacity: 1, scale: 1, width: DOT_SIZE, height: DOT_SIZE },
    steps,
    loop: true
  };
};

export const SequentialJumpingDemo: React.FC<SequentialJumpingDemoProps> = ({ engine }) => {
  const dot1 = createDotSchema(0);
  const dot2 = createDotSchema(STAGGER);
  const dot3 = createDotSchema(STAGGER * 2);

  return (
    <View style={styles.container}>
      <View style={[styles.dotsRow, { flexDirection: 'row' }]}>
        <UniversalAnimator engine={engine} schema={dot1} style={styles.dotWrapper}>
          <View style={styles.dot} />
        </UniversalAnimator>

        <UniversalAnimator engine={engine} schema={dot2} style={styles.dotWrapper}>
          <View style={styles.dot} />
        </UniversalAnimator>

        <UniversalAnimator engine={engine} schema={dot3} style={styles.dotWrapper}>
          <View style={styles.dot} />
        </UniversalAnimator>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    height: 120, // Ensure enough height for jump
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center', // Center vertically
    justifyContent: 'center',
    gap: 15,
    height: 60, // Fixed height
    marginTop: 40, // Move down so jump is visible
    width: '100%',
  },
  dotWrapper: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    backgroundColor: 'transparent',
  },
  dot: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
    backgroundColor: 'blue',
    borderWidth: 1,
    borderColor: 'navy',
  },
});
