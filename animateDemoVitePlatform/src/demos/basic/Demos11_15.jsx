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

// --- Demo 11: Fade In/Out (Opacity) ---
export const ReanimatedFade = () => {
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
      -1, true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.box, styles.blueBox, animatedStyle]} />
    </View>
  );
};

export const GsapFade = () => {
  const boxRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(boxRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 1, repeat: -1, yoyo: true, ease: "power1.inOut" }
      );
    });
    return () => ctx.revert();
  }, []);

  return (
    <div style={gsapStyles.container}>
      <div ref={boxRef} style={{...gsapStyles.box, backgroundColor: '#3498db'}} />
    </div>
  );
};

// --- Demo 12: Slide X (Translate X) ---
export const ReanimatedSlideX = () => {
  const x = useSharedValue(-100);

  useEffect(() => {
    x.value = withRepeat(
      withTiming(100, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
      -1, true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ translateX: x.value }] }));

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.box, styles.greenBox, animatedStyle]} />
    </View>
  );
};

export const GsapSlideX = () => {
  const boxRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(boxRef.current,
        { x: -100 },
        { x: 100, duration: 1, repeat: -1, yoyo: true, ease: "power1.inOut" }
      );
    });
    return () => ctx.revert();
  }, []);

  return (
    <div style={gsapStyles.container}>
      <div ref={boxRef} style={{...gsapStyles.box, backgroundColor: '#2ecc71'}} />
    </div>
  );
};

// --- Demo 13: Slide Y (Translate Y) ---
export const ReanimatedSlideY = () => {
  const y = useSharedValue(-100);

  useEffect(() => {
    y.value = withRepeat(
      withTiming(100, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
      -1, true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ translateY: y.value }] }));

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.box, styles.purpleBox, animatedStyle]} />
    </View>
  );
};

export const GsapSlideY = () => {
  const boxRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(boxRef.current,
        { y: -100 },
        { y: 100, duration: 1, repeat: -1, yoyo: true, ease: "power1.inOut" }
      );
    });
    return () => ctx.revert();
  }, []);

  return (
    <div style={gsapStyles.container}>
      <div ref={boxRef} style={{...gsapStyles.box, backgroundColor: '#9b59b6'}} />
    </div>
  );
};

// --- Demo 14: Scale ---
export const ReanimatedScale = () => {
  const scale = useSharedValue(0.5);

  useEffect(() => {
    scale.value = withRepeat(
      withTiming(1.5, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
      -1, true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.box, styles.orangeBox, animatedStyle]} />
    </View>
  );
};

export const GsapScale = () => {
  const boxRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(boxRef.current,
        { scale: 0.5 },
        { scale: 1.5, duration: 1, repeat: -1, yoyo: true, ease: "power1.inOut" }
      );
    });
    return () => ctx.revert();
  }, []);

  return (
    <div style={gsapStyles.container}>
      <div ref={boxRef} style={{...gsapStyles.box, backgroundColor: '#e67e22'}} />
    </div>
  );
};

// --- Demo 15: Rotate ---
export const ReanimatedRotate = () => {
  const rotate = useSharedValue(0);

  useEffect(() => {
    rotate.value = withRepeat(
      withTiming(360, { duration: 2000, easing: Easing.linear }),
      -1, false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ rotate: `${rotate.value}deg` }] }));

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.box, styles.redBox, animatedStyle]} />
    </View>
  );
};

export const GsapRotate = () => {
  const boxRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(boxRef.current,
        { rotation: 0 },
        { rotation: 360, duration: 2, repeat: -1, ease: "none" }
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

// Shared Styles
const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  box: { width: 100, height: 100, borderRadius: 16 },
  blueBox: { backgroundColor: '#3498db' },
  greenBox: { backgroundColor: '#2ecc71' },
  purpleBox: { backgroundColor: '#9b59b6' },
  orangeBox: { backgroundColor: '#e67e22' },
  redBox: { backgroundColor: '#e74c3c' },
});

const gsapStyles = {
  container: { display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' },
  box: { width: '100px', height: '100px', borderRadius: '16px' }
};
