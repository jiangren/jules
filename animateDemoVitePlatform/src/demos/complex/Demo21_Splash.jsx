import React, { useEffect, useRef } from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  withDelay,
  Easing
} from 'react-native-reanimated';
import { View, Text, Pressable, StyleSheet } from 'react-native-web';
import { gsap } from 'gsap';

// ==========================================
// Demo 21: Splash Screen to Home
// Sequence: Logo fade in -> Scale down & Move up -> Content slides in
// ==========================================

export const ReanimatedSplash = () => {
  const logoScale = useSharedValue(0.5);
  const logoOpacity = useSharedValue(0);
  const logoY = useSharedValue(0);

  const contentOpacity = useSharedValue(0);
  const contentY = useSharedValue(50);

  const startAnimation = () => {
    // Reset
    logoScale.value = 0.5;
    logoOpacity.value = 0;
    logoY.value = 0;
    contentOpacity.value = 0;
    contentY.value = 50;

    // Step 1: Logo enters
    logoOpacity.value = withTiming(1, { duration: 800 });
    logoScale.value = withTiming(1.5, { duration: 800, easing: Easing.out(Easing.back(1.5)) });

    // Step 2: Logo moves to header (Wait 1.5s then move)
    logoY.value = withDelay(1500, withTiming(-120, { duration: 800, easing: Easing.inOut(Easing.ease) }));
    logoScale.value = withDelay(1500, withTiming(0.8, { duration: 800 }));

    // Step 3: Content enters
    contentOpacity.value = withDelay(2000, withTiming(1, { duration: 600 }));
    contentY.value = withDelay(2000, withTiming(0, { duration: 600, easing: Easing.out(Easing.ease) }));
  };

  useEffect(() => {
    startAnimation();
  }, []);

  const logoStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [
      { translateY: logoY.value },
      { scale: logoScale.value }
    ]
  }));

  const contentStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
    transform: [{ translateY: contentY.value }]
  }));

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.logo, logoStyle]}>
        <Text style={styles.logoText}>🚀 APP</Text>
      </Animated.View>
      <Animated.View style={[styles.content, contentStyle]}>
        <Text style={styles.heading}>Welcome Back</Text>
        <View style={styles.skeletonLine} />
        <View style={styles.skeletonLine} />
        <View style={styles.skeletonLine} />
      </Animated.View>
      <Pressable onPress={startAnimation} style={styles.replayBtn}><Text style={{color:'white'}}>Replay</Text></Pressable>
    </View>
  );
};

export const GsapSplash = () => {
  const containerRef = useRef(null);
  const logoRef = useRef(null);
  const contentRef = useRef(null);
  const tl = useRef(null);

  const startAnimation = () => {
    if (tl.current) tl.current.kill();

    // Reset
    gsap.set(logoRef.current, { opacity: 0, scale: 0.5, y: 0 });
    gsap.set(contentRef.current, { opacity: 0, y: 50 });

    tl.current = gsap.timeline();

    tl.current
      // Step 1: Logo enters
      .to(logoRef.current, { opacity: 1, scale: 1.5, duration: 0.8, ease: "back.out(1.5)" })
      // Step 2: Logo moves to header
      .to(logoRef.current, { y: -120, scale: 0.8, duration: 0.8, ease: "power2.inOut" }, "+=0.7")
      // Step 3: Content enters
      .to(contentRef.current, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }, "-=0.3");
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      startAnimation();
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} style={gsapStyles.container}>
      <div ref={logoRef} style={gsapStyles.logo}>🚀 APP</div>
      <div ref={contentRef} style={gsapStyles.content}>
        <h2 style={{margin: '0 0 10px 0'}}>Welcome Back</h2>
        <div style={gsapStyles.skeletonLine} />
        <div style={gsapStyles.skeletonLine} />
        <div style={gsapStyles.skeletonLine} />
      </div>
      <button onClick={startAnimation} style={gsapStyles.replayBtn}>Replay</button>
    </div>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8f9fa', position: 'relative' },
  logo: { position: 'absolute', backgroundColor: '#3498db', padding: 20, borderRadius: 20, zIndex: 10 },
  logoText: { fontSize: 24, fontWeight: 'bold', color: 'white' },
  content: { marginTop: 100, alignItems: 'center', width: '80%' },
  heading: { fontSize: 22, fontWeight: 'bold', marginBottom: 15, color: '#2c3e50' },
  skeletonLine: { height: 12, backgroundColor: '#e0e0e0', borderRadius: 6, width: '100%', marginBottom: 10 },
  replayBtn: { position: 'absolute', bottom: 10, right: 10, backgroundColor: '#333', padding: 8, borderRadius: 4 }
});

const gsapStyles = {
  container: { position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', backgroundColor: '#f8f9fa' },
  logo: { position: 'absolute', backgroundColor: '#3498db', padding: '20px', borderRadius: '20px', color: 'white', fontSize: '24px', fontWeight: 'bold', zIndex: 10 },
  content: { marginTop: '100px', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '80%' },
  skeletonLine: { height: '12px', backgroundColor: '#e0e0e0', borderRadius: '6px', width: '100%', marginBottom: '10px' },
  replayBtn: { position: 'absolute', bottom: '10px', right: '10px', backgroundColor: '#333', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer' }
};
