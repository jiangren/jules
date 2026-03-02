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
  const chestOpacity = useSharedValue(1);
  const flashOpacity = useSharedValue(0);
  const rewardScale = useSharedValue(0);
  const rewardY = useSharedValue(50);
  const rewardOpacity = useSharedValue(0);

  const openChest = () => {
    if (isOpen) return;
    setIsOpen(true);

    // Step 1: Shake
    chestRotation.value = withSequence(
      withTiming(15, { duration: 100 }),
      withTiming(-15, { duration: 100 }),
      withTiming(15, { duration: 100 }),
      withTiming(-15, { duration: 100 }),
      withTiming(0, { duration: 100 })
    );

    // Chest slight swell before pop
    chestScale.value = withSequence(
      withTiming(1.2, { duration: 400 }),
      withTiming(0, { duration: 200 }) // Chest disappears
    );
    chestOpacity.value = withDelay(400, withTiming(0, { duration: 200 }));

    // Step 2: Flash
    flashOpacity.value = withDelay(500, withSequence(
      withTiming(1, { duration: 100 }),
      withTiming(0, { duration: 300 })
    ));

    // Step 3: Reward pops up
    rewardOpacity.value = withDelay(600, withTiming(1, { duration: 100 }));
    rewardScale.value = withDelay(600, withSpring(1, { damping: 12 }));
    rewardY.value = withDelay(600, withSpring(0, { damping: 12 }));
  };

  const reset = () => {
    setIsOpen(false);
    chestRotation.value = 0;
    chestScale.value = 1;
    chestOpacity.value = 1;
    flashOpacity.value = 0;
    rewardScale.value = 0;
    rewardY.value = 50;
    rewardOpacity.value = 0;
  };

  const chestStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${chestRotation.value}deg` }, { scale: chestScale.value }],
    opacity: chestOpacity.value
  }));
  const flashStyle = useAnimatedStyle(() => ({ opacity: flashOpacity.value }));
  const rewardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: rewardScale.value }, { translateY: rewardY.value }],
    opacity: rewardOpacity.value
  }));

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.flash, flashStyle, { pointerEvents: 'none' }]} />

      <Pressable
        onPress={openChest}
        style={{ pointerEvents: isOpen ? 'none' : 'auto' }}
      >
        <Animated.View style={chestStyle}>
          <Text style={styles.chest}>🎁</Text>
        </Animated.View>
      </Pressable>

      <Animated.View style={[styles.rewardContainer, rewardStyle, { pointerEvents: isOpen ? 'auto' : 'none' }]}>
        <Text style={styles.rewardIcon}>💎</Text>
        <Text style={styles.rewardText}>Epic Gem!</Text>
        <Pressable onPress={reset} style={styles.resetBtn}>
          <Text style={{ color: '#3498db', fontWeight: 'bold' }}>Reset Demo</Text>
        </Pressable>
      </Animated.View>
    </View>
  );
};

export const GsapReward = () => {
  const [isOpen, setIsOpen] = useState(false);
  const chestRef = useRef(null);
  const flashRef = useRef(null);
  const rewardRef = useRef(null);

  const openChest = () => {
    if (isOpen) return;
    setIsOpen(true);

    const tl = gsap.timeline();

    tl.to(chestRef.current, { rotation: 15, duration: 0.1 })
      .to(chestRef.current, { rotation: -15, duration: 0.1 })
      .to(chestRef.current, { rotation: 15, duration: 0.1 })
      .to(chestRef.current, { rotation: -15, duration: 0.1 })
      .to(chestRef.current, { rotation: 0, duration: 0.1 })
      .to(chestRef.current, { scale: 1.2, duration: 0.3 }, "-=0.4") // swell during shake
      .to(chestRef.current, { scale: 0, opacity: 0, duration: 0.2 }) // pop
      .to(flashRef.current, { opacity: 1, duration: 0.1 }, "-=0.1")
      .to(flashRef.current, { opacity: 0, duration: 0.3 })
      .fromTo(rewardRef.current,
        { scale: 0, y: 50, opacity: 0 },
        { scale: 1, y: 0, opacity: 1, duration: 0.6, ease: "back.out(1.7)" },
        "-=0.2"
      );
  };

  const reset = () => {
    setIsOpen(false);
    gsap.set(chestRef.current, { rotation: 0, scale: 1, opacity: 1 });
    gsap.set(flashRef.current, { opacity: 0 });
    gsap.set(rewardRef.current, { scale: 0, y: 50, opacity: 0 });
  };

  return (
    <div style={gsapStyles.container}>
      <div ref={flashRef} style={gsapStyles.flash} />

      <div
        ref={chestRef}
        onClick={openChest}
        style={{ ...gsapStyles.chest, pointerEvents: isOpen ? 'none' : 'auto' }}
      >
        🎁
      </div>

      <div ref={rewardRef} style={{ ...gsapStyles.rewardContainer, opacity: 0, pointerEvents: isOpen ? 'auto' : 'none' }}>
        <div style={gsapStyles.rewardIcon}>💎</div>
        <div style={gsapStyles.rewardText}>Epic Gem!</div>
        <button onClick={reset} style={gsapStyles.resetBtn}>Reset Demo</button>
      </div>
    </div>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, height: '100%', width: '100%', alignItems: 'center', justifyContent: 'center', backgroundColor: '#1a1a2e', overflow: 'hidden' },
  chest: { fontSize: 100, cursor: 'pointer' },
  flash: { ...StyleSheet.absoluteFillObject, backgroundColor: 'white', zIndex: 5 },
  rewardContainer: { position: 'absolute', alignItems: 'center', zIndex: 10 },
  rewardIcon: { fontSize: 80 },
  rewardText: { color: '#f1c40f', fontSize: 24, fontWeight: 'bold', marginTop: 10, textShadowColor: '#000', textShadowOffset: { width: 1, height: 1 }, textShadowRadius: 3 },
  resetBtn: { marginTop: 20, padding: 10, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 8 }
});

const gsapStyles = {
  container: { position: 'relative', display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'center', height: '100%', backgroundColor: '#1a1a2e', overflow: 'hidden' },
  chest: { fontSize: '100px', cursor: 'pointer', zIndex: 2 },
  flash: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'white', opacity: 0, zIndex: 5, pointerEvents: 'none' },
  rewardContainer: { position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 10 },
  rewardIcon: { fontSize: '80px' },
  rewardText: { color: '#f1c40f', fontSize: '24px', fontWeight: 'bold', marginTop: '10px', textShadow: '1px 1px 3px #000' },
  resetBtn: { marginTop: '20px', padding: '10px 20px', background: 'rgba(255,255,255,0.1)', border: 'none', color: '#3498db', cursor: 'pointer', borderRadius: '8px', fontWeight: 'bold' }
};

