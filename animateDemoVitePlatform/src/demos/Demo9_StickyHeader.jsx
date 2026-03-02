import React, { useEffect, useRef } from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring
} from 'react-native-reanimated';
import { View, Text, StyleSheet, ScrollView } from 'react-native-web';
import { gsap } from 'gsap';

// Reanimated Implementation
export const ReanimatedSticky = () => {
  const scrollY = useSharedValue(0);
  const headerY = useSharedValue(0);
  const prevScrollY = useSharedValue(0);

  const onScroll = (e) => {
    const currentScrollY = e.nativeEvent.contentOffset.y;
    const diff = currentScrollY - prevScrollY.value;

    // If scrolling down, hide header. If up, show.
    if (diff > 0 && currentScrollY > 50) {
      headerY.value = withTiming(-60, { duration: 300 });
    } else {
      headerY.value = withTiming(0, { duration: 300 });
    }

    prevScrollY.value = currentScrollY;
    scrollY.value = currentScrollY;
  };

  const headerStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: headerY.value }],
  }));

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.header, headerStyle]}>
        <Text style={styles.headerText}>Sticky Header</Text>
      </Animated.View>
      <ScrollView
        onScroll={onScroll}
        scrollEventThrottle={16}
        style={styles.scrollView}
      >
        <View style={styles.content}>
          {Array.from({ length: 20 }).map((_, i) => (
            <View key={i} style={styles.item}>
              <Text>Item {i + 1}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

// GSAP Implementation
export const GsapSticky = () => {
  const headerRef = useRef(null);
  const scrollRef = useRef(null);
  const prevScrollY = useRef(0);

  useEffect(() => {
    const el = scrollRef.current;

    const onScroll = () => {
      const currentScrollY = el.scrollTop;
      const diff = currentScrollY - prevScrollY.current;

      if (diff > 0 && currentScrollY > 50) {
        gsap.to(headerRef.current, { y: -60, duration: 0.3 });
      } else {
        gsap.to(headerRef.current, { y: 0, duration: 0.3 });
      }

      prevScrollY.current = currentScrollY;
    };

    el.addEventListener('scroll', onScroll);
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
      <div
        ref={headerRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '60px',
          backgroundColor: '#34495e',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10,
          boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
        }}
      >
        <h3 style={{ margin: 0 }}>Sticky Header</h3>
      </div>
      <div
        ref={scrollRef}
        style={{ width: '100%', height: '100%', overflowY: 'auto', paddingTop: '60px' }}
      >
        <div style={{ padding: '20px' }}>
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              style={{
                padding: '20px',
                borderBottom: '1px solid #eee',
                backgroundColor: 'white',
                marginBottom: '10px',
                borderRadius: '8px'
              }}
            >
              Item {i + 1}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    height: '100%',
    width: '100%',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: '#34495e',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  headerText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
    paddingTop: 60,
  },
  content: {
    padding: 20,
  },
  item: {
    padding: 20,
    backgroundColor: 'white',
    marginBottom: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
  },
});
