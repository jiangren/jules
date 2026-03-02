import React, { useEffect, useRef } from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSpring,
  interpolateColor,
  Easing
} from 'react-native-reanimated';
import { View, StyleSheet } from 'react-native-web';
import { gsap } from 'gsap';

// --- Demo 16: Skew ---
export const ReanimatedSkew = () => {
  const skewX = useSharedValue(-20);

  useEffect(() => {
    skewX.value = withRepeat(
      withTiming(20, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
      -1, true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ skewX: `${skewX.value}deg` }] }));

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.box, { backgroundColor: '#1abc9c' }, animatedStyle]} />
    </View>
  );
};

export const GsapSkew = () => {
  const boxRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(boxRef.current,
        { skewX: -20 },
        { skewX: 20, duration: 1, repeat: -1, yoyo: true, ease: "power1.inOut" }
      );
    });
    return () => ctx.revert();
  }, []);

  return (
    <div style={gsapStyles.container}>
      <div ref={boxRef} style={{...gsapStyles.box, backgroundColor: '#1abc9c'}} />
    </div>
  );
};

// --- Demo 17: Color Transition ---
export const ReanimatedColor = () => {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withRepeat(
      withTiming(1, { duration: 2000, easing: Easing.linear }),
      -1, true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(progress.value, [0, 1], ['#f1c40f', '#8e44ad'])
  }));

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.box, animatedStyle]} />
    </View>
  );
};

export const GsapColor = () => {
  const boxRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(boxRef.current,
        { backgroundColor: '#f1c40f' },
        { backgroundColor: '#8e44ad', duration: 2, repeat: -1, yoyo: true, ease: "none" }
      );
    });
    return () => ctx.revert();
  }, []);

  return (
    <div style={gsapStyles.container}>
      <div ref={boxRef} style={gsapStyles.box} />
    </div>
  );
};

// --- Demo 18: Border Radius (Square to Circle) ---
export const ReanimatedBorderRadius = () => {
  const radius = useSharedValue(0);

  useEffect(() => {
    radius.value = withRepeat(
      withTiming(50, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
      -1, true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({ borderRadius: radius.value }));

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.box, { backgroundColor: '#e74c3c' }, animatedStyle]} />
    </View>
  );
};

export const GsapBorderRadius = () => {
  const boxRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(boxRef.current,
        { borderRadius: "0%" },
        { borderRadius: "50%", duration: 1, repeat: -1, yoyo: true, ease: "power1.inOut" }
      );
    });
    return () => ctx.revert();
  }, []);

  return (
    <div style={gsapStyles.container}>
      <div ref={boxRef} style={{...gsapStyles.box, backgroundColor: '#e74c3c'}} />
    </div>
  );
};

// --- Demo 19: Spring Physics ---
export const ReanimatedSpring = () => {
  const scale = useSharedValue(0.5);

  useEffect(() => {
    // A simple loop to trigger spring repeatedly
    const interval = setInterval(() => {
      scale.value = 0.5;
      scale.value = withSpring(1.5, { damping: 5, stiffness: 100 });
    }, 2000);

    // Initial trigger
    scale.value = withSpring(1.5, { damping: 5, stiffness: 100 });

    return () => clearInterval(interval);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.box, { backgroundColor: '#34495e' }, animatedStyle]} />
    </View>
  );
};

export const GsapSpring = () => {
  const boxRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ repeat: -1 });
      tl.set(boxRef.current, { scale: 0.5 })
        .to(boxRef.current, { scale: 1.5, duration: 1, ease: "elastic.out(1, 0.3)" })
        .to(boxRef.current, { scale: 1.5, duration: 1 }); // Wait
    });
    return () => ctx.revert();
  }, []);

  return (
    <div style={gsapStyles.container}>
      <div ref={boxRef} style={{...gsapStyles.box, backgroundColor: '#34495e'}} />
    </div>
  );
};

// --- Demo 20: Easings (Linear vs Bounce) ---
export const ReanimatedEasings = () => {
  const x = useSharedValue(-100);

  useEffect(() => {
    x.value = withRepeat(
      withTiming(100, { duration: 1500, easing: Easing.bounce }),
      -1, true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ translateX: x.value }] }));

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.box, { backgroundColor: '#2980b9' }, animatedStyle]} />
    </View>
  );
};

export const GsapEasings = () => {
  const boxRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(boxRef.current,
        { x: -100 },
        { x: 100, duration: 1.5, repeat: -1, yoyo: true, ease: "bounce.out" }
      );
    });
    return () => ctx.revert();
  }, []);

  return (
    <div style={gsapStyles.container}>
      <div ref={boxRef} style={{...gsapStyles.box, backgroundColor: '#2980b9'}} />
    </div>
  );
};

// Shared Styles
const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  box: { width: 100, height: 100 },
});

const gsapStyles = {
  container: { display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' },
  box: { width: '100px', height: '100px' }
};
