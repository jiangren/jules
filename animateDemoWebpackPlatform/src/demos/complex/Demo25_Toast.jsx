import React, { useRef, useState, useEffect } from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  withDelay,
  Easing,
  runOnJS
} from 'react-native-reanimated';
import { View, Text, Pressable, StyleSheet } from 'react-native-web';
import { gsap } from 'gsap';

// ==========================================
// Demo 25: Toast Notification
// Sequence: Drops in from top -> Progress bar shrinks -> Slides out
// ==========================================

export const ReanimatedToast = () => {
  const [isVisible, setIsVisible] = useState(false);

  const toastY = useSharedValue(-100);
  const progressWidth = useSharedValue(100);

  const showToast = () => {
    if (isVisible) return;
    setIsVisible(true);

    // Reset
    toastY.value = -100;
    progressWidth.value = 100;

    // 1. Drop in
    toastY.value = withTiming(20, { duration: 500, easing: Easing.out(Easing.back(1.5)) });

    // 2. Progress bar shrinks over 3 seconds
    progressWidth.value = withDelay(500, withTiming(0, { duration: 3000, easing: Easing.linear }));

    // 3. Slide out up
    toastY.value = withDelay(3600, withTiming(-100, { duration: 400, easing: Easing.in(Easing.ease) }, () => {
      runOnJS(setIsVisible)(false);
    }));
  };

  const toastStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: toastY.value }]
  }));

  const progressStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value}%`
  }));

  return (
    <View style={styles.container}>
      <Pressable onPress={showToast} style={styles.triggerBtn}>
        <Text style={styles.triggerText}>Show Notification</Text>
      </Pressable>

      <Animated.View style={[styles.toast, toastStyle]}>
        <View style={styles.toastContent}>
          <Text style={styles.icon}>🔔</Text>
          <View>
            <Text style={styles.title}>New Message</Text>
            <Text style={styles.message}>You have a new update available.</Text>
          </View>
        </View>
        <Animated.View style={[styles.progressBar, progressStyle]} />
      </Animated.View>
    </View>
  );
};

export const GsapToast = () => {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef(null);
  const toastRef = useRef(null);
  const progressRef = useRef(null);

  const showToast = () => {
    if (isVisible) return;
    setIsVisible(true);

    // Reset
    gsap.set(toastRef.current, { y: -100, display: 'flex' });
    gsap.set(progressRef.current, { width: '100%' });

    const tl = gsap.timeline({
      onComplete: () => setIsVisible(false)
    });

    tl.to(toastRef.current, { y: 20, duration: 0.5, ease: "back.out(1.5)" })
      .to(progressRef.current, { width: '0%', duration: 3, ease: "none" })
      .to(toastRef.current, { y: -100, duration: 0.4, ease: "power2.in" }, "+=0.1");
  };

  return (
    <div ref={containerRef} style={gsapStyles.container}>
      <button onClick={showToast} style={gsapStyles.triggerBtn}>Show Notification</button>

      <div ref={toastRef} style={gsapStyles.toast}>
        <div style={gsapStyles.toastContent}>
          <span style={gsapStyles.icon}>🔔</span>
          <div>
            <div style={gsapStyles.title}>New Message</div>
            <div style={gsapStyles.message}>You have a new update available.</div>
          </div>
        </div>
        <div ref={progressRef} style={gsapStyles.progressBar} />
      </div>
    </div>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', position: 'relative' },
  triggerBtn: { backgroundColor: '#8e44ad', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 8 },
  triggerText: { color: 'white', fontWeight: 'bold' },
  toast: { position: 'absolute', top: 0, width: 300, backgroundColor: 'white', borderRadius: 8, shadowColor: '#000', shadowOffset: {width:0, height:4}, shadowOpacity: 0.1, shadowRadius: 12, elevation: 5, overflow: 'hidden' },
  toastContent: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  icon: { fontSize: 24, marginRight: 12 },
  title: { fontWeight: 'bold', fontSize: 16, color: '#2c3e50' },
  message: { color: '#7f8c8d', fontSize: 14, marginTop: 4 },
  progressBar: { height: 4, backgroundColor: '#8e44ad', bottom: 0, left: 0 }
});

const gsapStyles = {
  container: { display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', position: 'relative' },
  triggerBtn: { backgroundColor: '#8e44ad', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' },
  toast: { position: 'absolute', top: 0, width: '300px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', overflow: 'hidden', display: 'none', flexDirection: 'column' },
  toastContent: { display: 'flex', alignItems: 'center', padding: '16px' },
  icon: { fontSize: '24px', marginRight: '12px' },
  title: { fontWeight: 'bold', fontSize: '16px', color: '#2c3e50', margin: 0 },
  message: { color: '#7f8c8d', fontSize: '14px', marginTop: '4px' },
  progressBar: { height: '4px', backgroundColor: '#8e44ad', width: '100%' }
};
