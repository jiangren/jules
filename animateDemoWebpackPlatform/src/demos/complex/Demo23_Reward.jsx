import React, { useRef, useState } from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  withDelay,
  withSpring,
  Easing
} from 'react-native-reanimated';
import { View, Text, Pressable, StyleSheet } from 'react-native-web';
import { gsap } from 'gsap';

// ==========================================
// Demo 23: Reward Unlock (Loot Box)
// Sequence: Chest shakes -> Flash/Explosion -> Reward scales up & bounces
// ==========================================

export const ReanimatedReward = () => {
  const [isOpen, setIsOpen] = useState(false);

  const chestRotation = useSharedValue(0);
  const chestScale = useSharedValue(1);
  const flashOpacity = useSharedValue(0);
  const rewardScale = useSharedValue(0);
  const rewardY = useSharedValue(50);

  const openChest = () => {
    if (isOpen) return;
    setIsOpen(true);

    // Step 1: Shake
    chestRotation.value = withSequence(
      withTiming(10, { duration: 100 }),
      withTiming(-10, { duration: 100 }),
      withTiming(10, { duration: 100 }),
      withTiming(-10, { duration: 100 }),
      withTiming(0, { duration: 100 })
    );

    // Chest slight swell before pop
    chestScale.value = withSequence(
      withTiming(1.1, { duration: 500 }),
      withTiming(0, { duration: 200 }) // Chest disappears
    );

    // Step 2: Flash
    flashOpacity.value = withDelay(500, withSequence(
      withTiming(1, { duration: 100 }),
      withTiming(0, { duration: 300 })
    ));

    // Step 3: Reward pops up
    rewardScale.value = withDelay(600, withSpring(1, { damping: 12 }));
    rewardY.value = withDelay(600, withSpring(0, { damping: 12 }));
  };

  const reset = () => {
    setIsOpen(false);
    chestRotation.value = 0;
    chestScale.value = 1;
    flashOpacity.value = 0;
    rewardScale.value = 0;
    rewardY.value = 50;
  };

  const chestStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${chestRotation.value}deg` }, { scale: chestScale.value }]
  }));
  const flashStyle = useAnimatedStyle(() => ({ opacity: flashOpacity.value }));
  const rewardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: rewardScale.value }, { translateY: rewardY.value }]
  }));

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.flash, flashStyle]} />

      {!isOpen && (
        <Pressable onPress={openChest}>
          <Animated.Text style={[styles.chest, chestStyle]}>🎁</Animated.Text>
        </Pressable>
      )}

      <Animated.View style={[styles.rewardContainer, rewardStyle]}>
        <Text style={styles.rewardIcon}>💎</Text>
        <Text style={styles.rewardText}>Epic Gem!</Text>
        <Pressable onPress={reset} style={{marginTop: 10}}><Text style={{color: '#3498db'}}>Reset</Text></Pressable>
      </Animated.View>
    </View>
  );
};

export const GsapReward = () => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  const chestRef = useRef(null);
  const flashRef = useRef(null);
  const rewardRef = useRef(null);

  const openChest = () => {
    if (isOpen) return;
    setIsOpen(true);

    const tl = gsap.timeline();

    tl.to(chestRef.current, { rotation: 10, duration: 0.1 })
      .to(chestRef.current, { rotation: -10, duration: 0.1 })
      .to(chestRef.current, { rotation: 10, duration: 0.1 })
      .to(chestRef.current, { rotation: -10, duration: 0.1 })
      .to(chestRef.current, { rotation: 0, duration: 0.1 })
      .to(chestRef.current, { scale: 1.1, duration: 0.2 }, "-=0.5") // swell during shake
      .to(chestRef.current, { scale: 0, opacity: 0, duration: 0.2 }) // pop
      .to(flashRef.current, { opacity: 1, duration: 0.1 }, "-=0.1")
      .to(flashRef.current, { opacity: 0, duration: 0.3 })
      .fromTo(rewardRef.current,
        { scale: 0, y: 50, opacity: 1 },
        { scale: 1, y: 0, duration: 0.6, ease: "back.out(1.7)" },
        "-=0.3"
      );
  };

  const reset = () => {
    setIsOpen(false);
    gsap.set(chestRef.current, { rotation: 0, scale: 1, opacity: 1 });
    gsap.set(flashRef.current, { opacity: 0 });
    gsap.set(rewardRef.current, { scale: 0, y: 50, opacity: 0 });
  };

  return (
    <div ref={containerRef} style={gsapStyles.container}>
      <div ref={flashRef} style={gsapStyles.flash} />

      {!isOpen && (
        <div ref={chestRef} onClick={openChest} style={gsapStyles.chest}>🎁</div>
      )}

      <div ref={rewardRef} style={{...gsapStyles.rewardContainer, opacity: 0}}>
        <div style={gsapStyles.rewardIcon}>💎</div>
        <div style={gsapStyles.rewardText}>Epic Gem!</div>
        <button onClick={reset} style={{marginTop: '10px', background: 'none', border: 'none', color: '#3498db', cursor: 'pointer'}}>Reset</button>
      </div>
    </div>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#2c3e50', overflow: 'hidden' },
  chest: { fontSize: 80, cursor: 'pointer' },
  flash: { ...StyleSheet.absoluteFillObject, backgroundColor: 'white', zIndex: 5 },
  rewardContainer: { position: 'absolute', alignItems: 'center', zIndex: 10 },
  rewardIcon: { fontSize: 60 },
  rewardText: { color: '#f1c40f', fontSize: 20, fontWeight: 'bold', marginTop: 10, textShadowColor: '#000', textShadowOffset: {width: 1, height: 1}, textShadowRadius: 2 }
});

const gsapStyles = {
  container: { position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', backgroundColor: '#2c3e50', overflow: 'hidden' },
  chest: { fontSize: '80px', cursor: 'pointer', zIndex: 2 },
  flash: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'white', opacity: 0, zIndex: 5, pointerEvents: 'none' },
  rewardContainer: { position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 10 },
  rewardIcon: { fontSize: '60px' },
  rewardText: { color: '#f1c40f', fontSize: '20px', fontWeight: 'bold', marginTop: '10px', textShadow: '1px 1px 2px #000' }
};
