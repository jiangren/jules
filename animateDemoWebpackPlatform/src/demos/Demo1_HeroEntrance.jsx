import React, { useEffect, useRef } from 'react';
import Animated, { useSharedValue, useAnimatedStyle, withDelay, withSpring } from 'react-native-reanimated';
import { View, Text, Pressable } from 'react-native-web';
import { gsap } from 'gsap';

// Reanimated Implementation
const ReanimatedHero = () => {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(50);

  useEffect(() => {
    opacity.value = withDelay(300, withSpring(1));
    translateY.value = withDelay(300, withSpring(0));
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ translateY: translateY.value }],
    };
  });

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Animated.View style={[animatedStyle, { padding: 20 }]}>
        <Text style={{ fontSize: 32, fontWeight: 'bold', marginBottom: 10 }}>
          Welcome Home
        </Text>
        <Text style={{ fontSize: 18, color: '#666', marginBottom: 20, textAlign: 'center' }}>
          Experience smooth animations with Reanimated v3.
        </Text>
        <Pressable
          style={{
            backgroundColor: '#007AFF',
            paddingVertical: 12,
            paddingHorizontal: 24,
            borderRadius: 8
          }}
          onPress={() => {
            opacity.value = 0;
            translateY.value = 50;
            setTimeout(() => {
              opacity.value = withSpring(1);
              translateY.value = withSpring(0);
            }, 100);
          }}
        >
          <Text style={{ color: 'white', fontWeight: '600' }}>Get Started</Text>
        </Pressable>
      </Animated.View>
    </View>
  );
};

// GSAP Implementation
const GsapHero = () => {
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const descRef = useRef(null);
  const btnRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from([titleRef.current, descRef.current, btnRef.current], {
        opacity: 0,
        y: 50,
        duration: 1,
        stagger: 0.2,
        ease: 'power3.out',
        delay: 0.3
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleRestart = () => {
    gsap.killTweensOf([titleRef.current, descRef.current, btnRef.current]);
    gsap.set([titleRef.current, descRef.current, btnRef.current], { clearProps: 'all' });
    gsap.from([titleRef.current, descRef.current, btnRef.current], {
        opacity: 0,
        y: 50,
        duration: 1,
        stagger: 0.2,
        ease: 'power3.out',
    });
  };

  return (
    <div ref={containerRef} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
      <h1 ref={titleRef} style={{ fontSize: '32px', fontWeight: 'bold', margin: '0 0 10px 0' }}>
        Welcome Home
      </h1>
      <p ref={descRef} style={{ fontSize: '18px', color: '#666', margin: '0 0 20px 0', textAlign: 'center' }}>
        Experience smooth animations with GSAP.
      </p>
      <button
        ref={btnRef}
        style={{
          backgroundColor: '#007AFF',
          color: 'white',
          border: 'none',
          padding: '12px 24px',
          borderRadius: '8px',
          fontSize: '16px',
          fontWeight: '600',
          cursor: 'pointer'
        }}
        onClick={handleRestart}
      >
        Get Started
      </button>
    </div>
  );
};

export { ReanimatedHero, GsapHero };
