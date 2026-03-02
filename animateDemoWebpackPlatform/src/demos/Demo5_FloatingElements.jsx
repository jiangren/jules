import React, { useEffect, useRef } from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing
} from 'react-native-reanimated';
import { View, StyleSheet } from 'react-native-web';
import { gsap } from 'gsap';

// Reanimated Implementation
export const ReanimatedFloat = () => {
  const y1 = useSharedValue(0);
  const y2 = useSharedValue(0);
  const y3 = useSharedValue(0);

  useEffect(() => {
    y1.value = withRepeat(withTiming(-20, { duration: 2000, easing: Easing.inOut(Easing.ease) }), -1, true);
    y2.value = withRepeat(withTiming(-30, { duration: 2500, easing: Easing.inOut(Easing.ease) }), -1, true);
    y3.value = withRepeat(withTiming(-15, { duration: 1800, easing: Easing.inOut(Easing.ease) }), -1, true);
  }, []);

  const s1 = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: y1.value }],
    };
  });

  const s2 = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: y2.value }],
    };
  });

  const s3 = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: y3.value }],
    };
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.bubble, styles.b1, s1]} />
      <Animated.View style={[styles.bubble, styles.b2, s2]} />
      <Animated.View style={[styles.bubble, styles.b3, s3]} />
    </View>
  );
};

// GSAP Implementation
export const GsapFloat = () => {
  const containerRef = useRef(null);
  const b1 = useRef(null);
  const b2 = useRef(null);
  const b3 = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(b1.current, { y: -20, duration: 2, repeat: -1, yoyo: true, ease: 'sine.inOut' });
      gsap.to(b2.current, { y: -30, duration: 2.5, repeat: -1, yoyo: true, ease: 'sine.inOut' });
      gsap.to(b3.current, { y: -15, duration: 1.8, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
      <div ref={b1} style={{ position: 'absolute', width: 50, height: 50, borderRadius: '50%', backgroundColor: '#ff9ff3', left: '20%', top: '60%', opacity: 0.8 }} />
      <div ref={b2} style={{ position: 'absolute', width: 80, height: 80, borderRadius: '50%', backgroundColor: '#54a0ff', left: '50%', top: '40%', opacity: 0.8 }} />
      <div ref={b3} style={{ position: 'absolute', width: 40, height: 40, borderRadius: '50%', backgroundColor: '#1dd1a1', left: '80%', top: '50%', opacity: 0.8 }} />
    </div>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  bubble: {
    position: 'absolute',
    borderRadius: 50,
    opacity: 0.8,
  },
  b1: { width: 50, height: 50, backgroundColor: '#ff9ff3', left: '20%', top: '60%' },
  b2: { width: 80, height: 80, backgroundColor: '#54a0ff', left: '50%', top: '40%' },
  b3: { width: 40, height: 40, backgroundColor: '#1dd1a1', left: '80%', top: '50%' },
});
