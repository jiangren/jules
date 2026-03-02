import React, { useRef, useState, useEffect } from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  withDelay,
  withRepeat,
  Easing,
  runOnJS,
  interpolateColor
} from 'react-native-reanimated';
import { View, Text, Pressable, StyleSheet } from 'react-native-web';
import { gsap } from 'gsap';

// ==========================================
// Demo 24: Form Submit Success
// Sequence: Button shrinks to circle -> Spinner rotates -> Morphs to checkmark -> Expands green -> Text appears
// ==========================================

export const ReanimatedSubmit = () => {
  const [state, setState] = useState('idle'); // idle | loading | success

  const btnWidth = useSharedValue(200);
  const btnBgColorProgress = useSharedValue(0); // 0 = blue, 1 = green
  const textOpacity = useSharedValue(1);
  const spinnerOpacity = useSharedValue(0);
  const spinnerRotate = useSharedValue(0);
  const checkOpacity = useSharedValue(0);

  const handleSubmit = () => {
    if (state !== 'idle') return;
    setState('loading');

    // 1. Fade out text, shrink to circle
    textOpacity.value = withTiming(0, { duration: 200 });
    btnWidth.value = withTiming(50, { duration: 400, easing: Easing.inOut(Easing.ease) });

    // 2. Show spinner and rotate
    spinnerOpacity.value = withDelay(400, withTiming(1, { duration: 200 }));
    spinnerRotate.value = withDelay(400, withRepeat(withTiming(360, { duration: 1000, easing: Easing.linear }), 2, false, () => {
      runOnJS(showSuccess)();
    }));
  };

  const showSuccess = () => {
    setState('success');
    // Stop spinner, hide it
    spinnerOpacity.value = withTiming(0, { duration: 200 });

    // Morph to success
    btnBgColorProgress.value = withTiming(1, { duration: 300 });
    btnWidth.value = withTiming(200, { duration: 400, easing: Easing.out(Easing.back(1.5)) });

    // Show checkmark/success text
    checkOpacity.value = withDelay(300, withTiming(1, { duration: 300 }));
  };

  const reset = () => {
    setState('idle');
    btnWidth.value = 200;
    btnBgColorProgress.value = 0;
    textOpacity.value = 1;
    spinnerOpacity.value = 0;
    spinnerRotate.value = 0;
    checkOpacity.value = 0;
  };

  const btnStyle = useAnimatedStyle(() => ({
    width: btnWidth.value,
    backgroundColor: interpolateColor(btnBgColorProgress.value, [0, 1], ['#3498db', '#2ecc71'])
  }));

  const spinnerStyle = useAnimatedStyle(() => ({
    opacity: spinnerOpacity.value,
    transform: [{ rotate: `${spinnerRotate.value}deg` }]
  }));

  // Reanimated throws an error when interpolating opacity directly in inline styles in some web setups
  const textStyle = useAnimatedStyle(() => ({ opacity: textOpacity.value }));
  const checkStyle = useAnimatedStyle(() => ({ opacity: checkOpacity.value }));

  return (
    <View style={styles.container}>
      <Pressable onPress={handleSubmit}>
        <Animated.View style={[styles.button, btnStyle]}>
          <Animated.Text style={[styles.btnText, { position: 'absolute' }, textStyle]}>
            Submit
          </Animated.Text>

          <Animated.View style={[styles.spinner, spinnerStyle]} />

          <Animated.View style={[styles.successContent, checkStyle]}>
            <Text style={styles.checkIcon}>✓</Text>
            <Text style={styles.successText}>Success</Text>
          </Animated.View>
        </Animated.View>
      </Pressable>

      {state === 'success' && (
        <Pressable onPress={reset} style={{marginTop: 20}}><Text style={{color: '#95a5a6'}}>Reset</Text></Pressable>
      )}
    </View>
  );
};

export const GsapSubmit = () => {
  const [state, setState] = useState('idle');
  const btnRef = useRef(null);
  const textRef = useRef(null);
  const spinnerRef = useRef(null);
  const checkRef = useRef(null);
  const spinnerTween = useRef(null);

  const handleSubmit = () => {
    if (state !== 'idle') return;
    setState('loading');

    const tl = gsap.timeline();

    tl.to(textRef.current, { opacity: 0, duration: 0.2 })
      .to(btnRef.current, { width: '50px', duration: 0.4, ease: "power2.inOut" })
      .to(spinnerRef.current, { opacity: 1, duration: 0.2 }, "-=0.1")
      .call(() => {
        // Start infinite rotation
        spinnerTween.current = gsap.to(spinnerRef.current, { rotation: 360, duration: 1, repeat: -1, ease: "none" });

        // Simulate network request then trigger success
        setTimeout(showSuccess, 2000);
      });
  };

  const showSuccess = () => {
    if (spinnerTween.current) spinnerTween.current.kill();
    setState('success');

    const tl = gsap.timeline();
    tl.to(spinnerRef.current, { opacity: 0, duration: 0.2 })
      .to(btnRef.current, { backgroundColor: '#2ecc71', duration: 0.3 }, "-=0.1")
      .to(btnRef.current, { width: '200px', duration: 0.4, ease: "back.out(1.5)" })
      .to(checkRef.current, { opacity: 1, duration: 0.3 });
  };

  const reset = () => {
    setState('idle');
    gsap.set(btnRef.current, { width: '200px', backgroundColor: '#3498db' });
    gsap.set(textRef.current, { opacity: 1 });
    gsap.set(spinnerRef.current, { opacity: 0, rotation: 0 });
    gsap.set(checkRef.current, { opacity: 0 });
  };

  return (
    <div style={gsapStyles.container}>
      <button ref={btnRef} onClick={handleSubmit} style={gsapStyles.button}>
        <span ref={textRef} style={gsapStyles.btnText}>Submit</span>
        <div ref={spinnerRef} style={gsapStyles.spinner} />
        <div ref={checkRef} style={gsapStyles.successContent}>
          <span style={{marginRight: '8px'}}>✓</span> Success
        </div>
      </button>
      {state === 'success' && (
        <button onClick={reset} style={{marginTop: '20px', background: 'none', border: 'none', color: '#95a5a6', cursor: 'pointer'}}>Reset</button>
      )}
    </div>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  button: { height: 50, borderRadius: 25, alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative' },
  btnText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  spinner: { position: 'absolute', width: 24, height: 24, borderRadius: 12, borderWidth: 3, borderColor: 'rgba(255,255,255,0.3)', borderTopColor: 'white' },
  successContent: { position: 'absolute', flexDirection: 'row', alignItems: 'center' },
  checkIcon: { color: 'white', fontSize: 18, fontWeight: 'bold', marginRight: 8 },
  successText: { color: 'white', fontSize: 16, fontWeight: 'bold' }
});

const gsapStyles = {
  container: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' },
  button: { width: '200px', height: '50px', borderRadius: '25px', backgroundColor: '#3498db', border: 'none', cursor: 'pointer', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  btnText: { color: 'white', fontSize: '16px', fontWeight: 'bold', position: 'absolute' },
  spinner: { position: 'absolute', width: '24px', height: '24px', borderRadius: '50%', border: '3px solid rgba(255,255,255,0.3)', borderTopColor: 'white', opacity: 0, boxSizing: 'border-box' },
  successContent: { position: 'absolute', display: 'flex', alignItems: 'center', color: 'white', fontSize: '16px', fontWeight: 'bold', opacity: 0 }
};
