import React, { useEffect, useRef } from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
  cancelAnimation
} from 'react-native-reanimated';
import { View, Text, StyleSheet } from 'react-native-web';
import { gsap } from 'gsap';

// Reanimated Implementation
export const ReanimatedMarquee = () => {
  const translateX = useSharedValue(0);
  const containerWidth = 300; // Example fixed width

  useEffect(() => {
    // Reset position
    translateX.value = containerWidth;

    translateX.value = withRepeat(
      withTiming(-containerWidth, {
        duration: 5000,
        easing: Easing.linear,
      }),
      -1, // Infinite loops
      false // Do not reverse
    );

    return () => cancelAnimation(translateX);
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  return (
    <View style={styles.container}>
      <View style={styles.mask}>
        <Animated.View style={[styles.content, animatedStyle]}>
          <Text style={styles.text}>🚀 Breaking News: Animation is cool! 🔥</Text>
        </Animated.View>
      </View>
    </View>
  );
};

// GSAP Implementation
export const GsapMarquee = () => {
  const containerRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Calculate start and end positions
      const containerWidth = containerRef.current.offsetWidth;
      const textWidth = textRef.current.offsetWidth;

      gsap.fromTo(textRef.current,
        { x: containerWidth },
        {
          x: -textWidth,
          duration: 5,
          ease: 'none',
          repeat: -1
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', width: '100%' }}>
      <div
        ref={containerRef}
        style={{
          width: '300px',
          overflow: 'hidden',
          border: '1px solid #ddd',
          borderRadius: '8px',
          padding: '10px',
          backgroundColor: '#f9f9f9',
          whiteSpace: 'nowrap'
        }}
      >
        <div ref={textRef} style={{ display: 'inline-block', fontSize: '18px', fontWeight: 'bold' }}>
          🚀 Breaking News: Animation is cool! 🔥
        </div>
      </div>
    </div>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mask: {
    width: 300,
    overflow: 'hidden',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#f9f9f9',
  },
  content: {
    flexDirection: 'row',
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    whiteSpace: 'nowrap',
  },
});
