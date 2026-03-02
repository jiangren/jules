import React, { useEffect, useRef } from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withDelay,
  withTiming,
  withSequence,
  Easing
} from 'react-native-reanimated';
import { View, Text, StyleSheet } from 'react-native-web';
import { gsap } from 'gsap';

// Reanimated Implementation
// Simple confetti pieces
const ConfettiPiece = ({ index }) => {
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(1);
  const rotate = useSharedValue(0);

  useEffect(() => {
    const delay = Math.random() * 500;
    const duration = 1000 + Math.random() * 1000;
    const endY = 200 + Math.random() * 100;
    const rotation = Math.random() * 360 * 5;

    translateY.value = withDelay(delay, withTiming(endY, { duration, easing: Easing.out(Easing.quad) }));
    opacity.value = withDelay(delay + duration * 0.7, withTiming(0, { duration: duration * 0.3 }));
    rotate.value = withDelay(delay, withTiming(rotation, { duration }));
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }, { rotate: `${rotate.value}deg` }],
    opacity: opacity.value,
  }));

  const colors = ['#e74c3c', '#f1c40f', '#2ecc71', '#3498db', '#9b59b6'];
  const color = colors[index % colors.length];
  const left = `${Math.random() * 100}%`;

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          top: -20,
          left,
          width: 10,
          height: 10,
          backgroundColor: color,
        },
        style
      ]}
    />
  );
};

export const ReanimatedConfetti = () => {
  const pieces = Array.from({ length: 30 }).map((_, i) => i);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Success!</Text>
      {pieces.map((i) => (
        <ConfettiPiece key={i} index={i} />
      ))}
    </View>
  );
};

// GSAP Implementation
export const GsapConfetti = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const colors = ['#e74c3c', '#f1c40f', '#2ecc71', '#3498db', '#9b59b6'];

      // Create 30 confetti elements dynamically
      for (let i = 0; i < 30; i++) {
        const div = document.createElement('div');
        div.style.position = 'absolute';
        div.style.width = '10px';
        div.style.height = '10px';
        div.style.backgroundColor = colors[i % colors.length];
        div.style.top = '-20px';
        div.style.left = `${Math.random() * 100}%`;

        containerRef.current.appendChild(div);

        gsap.to(div, {
          y: 200 + Math.random() * 100,
          rotation: Math.random() * 360 * 5,
          opacity: 0,
          duration: 1 + Math.random(),
          delay: Math.random() * 0.5,
          ease: 'power1.out',
          onComplete: () => {
            if (div.parentNode) div.parentNode.removeChild(div);
          }
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <h2 style={{ color: '#2ecc71', fontSize: '32px', fontWeight: 'bold' }}>Success!</h2>
    </div>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'relative',
    width: '100%',
    height: '100%',
  },
  text: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2ecc71',
    zIndex: 10,
  },
});
