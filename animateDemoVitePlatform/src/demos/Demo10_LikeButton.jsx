import React, { useState, useRef } from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming
} from 'react-native-reanimated';
import { View, Text, Pressable, StyleSheet } from 'react-native-web';
import { gsap } from 'gsap';

// Reanimated Implementation
export const ReanimatedLike = () => {
  const [liked, setLiked] = useState(false);
  const scale = useSharedValue(1);

  const toggleLike = () => {
    const nextState = !liked;
    setLiked(nextState);

    if (nextState) {
      scale.value = withSequence(
        withSpring(1.5, { damping: 10 }),
        withSpring(1)
      );
    } else {
      scale.value = withTiming(1, { duration: 200 });
    }
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  return (
    <View style={styles.container}>
      <Pressable onPress={toggleLike} style={styles.heartButton}>
        <Animated.Text
          style={[
            styles.heart,
            { color: liked ? '#e74c3c' : '#ccc' },
            animatedStyle
          ]}
        >
          ♥
        </Animated.Text>
      </Pressable>
    </View>
  );
};

// GSAP Implementation
export const GsapLike = () => {
  const [liked, setLiked] = useState(false);
  const heartRef = useRef(null);

  const toggleLike = () => {
    const nextState = !liked;
    setLiked(nextState);

    if (nextState) {
      // Bounce effect
      gsap.to(heartRef.current, {
        scale: 1.5,
        duration: 0.15,
        yoyo: true,
        repeat: 1,
        ease: "power1.inOut"
      });
    } else {
      gsap.to(heartRef.current, { scale: 1, duration: 0.2 });
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
      <button
        onClick={toggleLike}
        style={{
          background: 'none',
          border: 'none',
          fontSize: '100px',
          cursor: 'pointer',
          color: liked ? '#e74c3c' : '#ccc',
          transition: 'color 0.2s',
          outline: 'none',
          padding: 0
        }}
      >
        <span ref={heartRef} style={{ display: 'inline-block' }}>♥</span>
      </button>
    </div>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heartButton: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heart: {
    fontSize: 100,
  },
});
