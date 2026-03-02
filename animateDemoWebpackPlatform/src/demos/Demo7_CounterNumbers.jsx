import React, { useEffect, useState, useRef } from 'react';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  Easing,
  useAnimatedReaction,
  runOnJS
} from 'react-native-reanimated';
import { View, Text, TextInput, StyleSheet } from 'react-native-web';
import { gsap } from 'gsap';

// Reanimated Implementation
// Note: Animating text directly is tricky in RN-Web. We'll use a TextInput as a workaround for display.
const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

export const ReanimatedCounter = () => {
  const count = useSharedValue(0);

  useEffect(() => {
    count.value = withTiming(1000, { duration: 2000, easing: Easing.out(Easing.exp) });
  }, []);

  const animatedProps = useAnimatedProps(() => {
    return {
      text: `${Math.round(count.value)}`,
      // For TextInput to update
      defaultValue: `${Math.round(count.value)}`,
    };
  });

  // Reanimated 2/3 text animation workaround for web often involves using state or ref.
  // Here we use a simpler approach: runOnJS or just a key for forced re-render isn't ideal for 60fps.
  // Let's try the TextInput "text" prop trick which works on native, but on web it might need `value`.
  // Actually, on web, we can just use a React state for simplicity if Reanimated's text handling is limited,
  // BUT the user asked for Reanimated.

  // Alternative: create a component that accepts a shared value and renders it.

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Users</Text>
      <ReText style={styles.number} text={count} />
    </View>
  );
};

// Helper component for Reanimated Text
const ReText = ({ text, style }) => {
  const [displayedText, setDisplayedText] = useState('0');

  // We use useAnimatedReaction to update state on JS thread
  // This is less performant than native Text binding but works on Web
  useAnimatedReaction(
    () => Math.round(text.value),
    (result, previous) => {
      if (result !== previous) {
        runOnJS(setDisplayedText)(`${result}`);
      }
    },
    [text]
  );

  return <Text style={style}>{displayedText}</Text>;
};


// GSAP Implementation
export const GsapCounter = () => {
  const numberRef = useRef(null);
  const [count, setCount] = useState({ value: 0 });

  useEffect(() => {
    gsap.to(count, {
      value: 1000,
      duration: 2,
      ease: 'power2.out',
      onUpdate: () => {
        if (numberRef.current) {
          numberRef.current.innerText = Math.round(count.value);
        }
      }
    });
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
      <div style={{ fontSize: '18px', color: '#666', marginBottom: '8px' }}>Users</div>
      <div
        ref={numberRef}
        style={{ fontSize: '48px', fontWeight: 'bold', color: '#2d3436', fontFamily: 'monospace' }}
      >
        0
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
  label: {
    fontSize: 18,
    color: '#666',
    marginBottom: 8,
  },
  number: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#2d3436',
    fontFamily: 'monospace',
  },
});
