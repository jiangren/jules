import React, { useState, useRef } from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
  Extrapolate
} from 'react-native-reanimated';
import { View, Text, Pressable, StyleSheet } from 'react-native-web';
import { gsap } from 'gsap';

// Reanimated Implementation
export const ReanimatedFlip = () => {
  const rotation = useSharedValue(0);

  const flip = () => {
    rotation.value = withSpring(rotation.value ? 0 : 180, { damping: 12 });
  };

  const frontAnimatedStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(rotation.value, [0, 180], [0, 180]);
    return {
      transform: [{ rotateY: `${rotateY}deg` }],
      opacity: rotateY > 90 ? 0 : 1,
      zIndex: rotateY > 90 ? 0 : 1,
    };
  });

  const backAnimatedStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(rotation.value, [0, 180], [180, 360]);
    return {
      transform: [{ rotateY: `${rotateY}deg` }],
      opacity: rotateY > 270 ? 0 : 1,
      zIndex: rotateY > 270 ? 0 : 1,
    };
  });

  return (
    <View style={styles.container}>
      <Pressable onPress={flip} style={styles.cardContainer}>
        <Animated.View style={[styles.card, styles.front, frontAnimatedStyle]}>
          <Text style={styles.cardText}>FRONT</Text>
        </Animated.View>
        <Animated.View style={[styles.card, styles.back, backAnimatedStyle]}>
          <Text style={styles.cardText}>BACK</Text>
        </Animated.View>
      </Pressable>
    </View>
  );
};

// GSAP Implementation
export const GsapFlip = () => {
  const [isFlipped, setIsFlipped] = useState(false);
  const cardRef = useRef(null);
  const frontRef = useRef(null);
  const backRef = useRef(null);

  const flip = () => {
    const nextState = !isFlipped;
    setIsFlipped(nextState);

    gsap.to(cardRef.current, {
      rotationY: nextState ? 180 : 0,
      duration: 0.6,
      ease: 'back.out(1.7)'
    });
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', perspective: '1000px' }}>
      <div
        ref={cardRef}
        onClick={flip}
        style={{
          width: '200px',
          height: '300px',
          position: 'relative',
          transformStyle: 'preserve-3d',
          cursor: 'pointer'
        }}
      >
        <div
          ref={frontRef}
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backfaceVisibility: 'hidden',
            backgroundColor: '#3498db',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '12px',
            fontSize: '24px',
            fontWeight: 'bold',
            boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
          }}
        >
          FRONT
        </div>
        <div
          ref={backRef}
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backfaceVisibility: 'hidden',
            backgroundColor: '#e74c3c',
            color: 'white',
            transform: 'rotateY(180deg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '12px',
            fontSize: '24px',
            fontWeight: 'bold',
            boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
          }}
        >
          BACK
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
  cardContainer: {
    width: 200,
    height: 300,
  },
  card: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backfaceVisibility: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  front: {
    backgroundColor: '#3498db',
  },
  back: {
    backgroundColor: '#e74c3c',
  },
  cardText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
});
