import React, { useRef, useState } from 'react';
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
// Demo 22: Shopping Cart Add
// Sequence: Button click -> Item flies to cart -> Cart shakes -> Counter updates
// ==========================================

export const ReanimatedCart = () => {
  const [count, setCount] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const flyX = useSharedValue(0);
  const flyY = useSharedValue(0);
  const flyScale = useSharedValue(0);
  const flyOpacity = useSharedValue(0);

  const cartRotation = useSharedValue(0);

  const incrementCount = () => setCount(prev => prev + 1);
  const finishAnimation = () => setIsAnimating(false);

  const addToCart = () => {
    if (isAnimating) return;
    setIsAnimating(true);

    // Reset fly item
    flyX.value = 0;
    flyY.value = 0;
    flyScale.value = 1;
    flyOpacity.value = 1;

    // Step 1: Fly item up and right to the cart
    flyY.value = withTiming(-150, { duration: 600, easing: Easing.in(Easing.back(1)) });
    flyX.value = withTiming(120, { duration: 600, easing: Easing.linear });
    flyScale.value = withTiming(0.2, { duration: 600 });
    flyOpacity.value = withDelay(500, withTiming(0, { duration: 100 }, () => {
      runOnJS(incrementCount)();
      runOnJS(finishAnimation)();
    }));

    // Step 2: Cart shake sequence (delayed until item arrives)
    cartRotation.value = withDelay(600, withSequence(
      withTiming(-15, { duration: 50 }),
      withTiming(15, { duration: 50 }),
      withTiming(-10, { duration: 50 }),
      withTiming(10, { duration: 50 }),
      withTiming(0, { duration: 50 })
    ));
  };

  const flyStyle = useAnimatedStyle(() => ({
    opacity: flyOpacity.value,
    transform: [
      { translateX: flyX.value },
      { translateY: flyY.value },
      { scale: flyScale.value }
    ]
  }));

  const cartStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${cartRotation.value}deg` }]
  }));

  return (
    <View style={styles.container}>
      {/* Header Cart */}
      <View style={styles.header}>
        <Animated.View style={[styles.cartIconContainer, cartStyle]}>
          <Text style={styles.cartIcon}>🛒</Text>
          {count > 0 && (
            <View style={styles.badge}><Text style={styles.badgeText}>{count}</Text></View>
          )}
        </Animated.View>
      </View>

      {/* Product */}
      <View style={styles.product}>
        <View style={styles.productImage}>
          {/* The flying clone */}
          <Animated.View style={[styles.flyingItem, flyStyle]} />
        </View>
        <Text style={styles.productName}>Awesome Sneakers</Text>
        <Pressable onPress={addToCart} style={styles.button}>
          <Text style={styles.buttonText}>Add to Cart</Text>
        </Pressable>
      </View>
    </View>
  );
};

export const GsapCart = () => {
  const [count, setCount] = useState(0);
  const containerRef = useRef(null);
  const flyRef = useRef(null);
  const cartRef = useRef(null);
  const isAnimating = useRef(false);

  const addToCart = () => {
    if (isAnimating.current) return;
    isAnimating.current = true;

    const tl = gsap.timeline({
      onComplete: () => {
        isAnimating.current = false;
        setCount(prev => prev + 1);
      }
    });

    // Reset flying item
    gsap.set(flyRef.current, { x: 0, y: 0, scale: 1, opacity: 1 });

    tl.to(flyRef.current, {
      x: 120,
      y: -150,
      scale: 0.2,
      duration: 0.6,
      ease: "back.in(1)"
    })
    .to(flyRef.current, { opacity: 0, duration: 0.1 })
    // Shake Cart
    .to(cartRef.current, { rotation: -15, duration: 0.05 })
    .to(cartRef.current, { rotation: 15, duration: 0.05 })
    .to(cartRef.current, { rotation: -10, duration: 0.05 })
    .to(cartRef.current, { rotation: 10, duration: 0.05 })
    .to(cartRef.current, { rotation: 0, duration: 0.05 });
  };

  return (
    <div ref={containerRef} style={gsapStyles.container}>
      <div style={gsapStyles.header}>
        <div ref={cartRef} style={gsapStyles.cartIconContainer}>
          <span style={gsapStyles.cartIcon}>🛒</span>
          {count > 0 && <div style={gsapStyles.badge}>{count}</div>}
        </div>
      </div>

      <div style={gsapStyles.product}>
        <div style={gsapStyles.productImage}>
          <div ref={flyRef} style={gsapStyles.flyingItem} />
        </div>
        <div style={gsapStyles.productName}>Awesome Sneakers</div>
        <button onClick={addToCart} style={gsapStyles.button}>Add to Cart</button>
      </div>
    </div>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff', alignItems: 'center' },
  header: { width: '100%', flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 50, paddingRight: 40 },
  cartIconContainer: { position: 'relative' },
  cartIcon: { fontSize: 32 },
  badge: { position: 'absolute', top: -5, right: -10, backgroundColor: '#e74c3c', width: 20, height: 20, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  badgeText: { color: 'white', fontSize: 12, fontWeight: 'bold' },
  product: { alignItems: 'center', padding: 20, borderWidth: 1, borderColor: '#eee', borderRadius: 12 },
  productImage: { width: 100, height: 100, backgroundColor: '#f1f2f6', borderRadius: 8, marginBottom: 15, position: 'relative' },
  flyingItem: { position: 'absolute', top: 0, left: 0, width: 100, height: 100, backgroundColor: '#3498db', borderRadius: 8, opacity: 0 },
  productName: { fontSize: 16, fontWeight: 'bold', marginBottom: 15 },
  button: { backgroundColor: '#2ecc71', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 20 },
  buttonText: { color: 'white', fontWeight: 'bold' }
});

const gsapStyles = {
  container: { display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px', height: '100%', backgroundColor: '#fff' },
  header: { width: '100%', display: 'flex', justifyContent: 'flex-end', marginBottom: '50px', paddingRight: '40px' },
  cartIconContainer: { position: 'relative', display: 'inline-block' },
  cartIcon: { fontSize: '32px' },
  badge: { position: 'absolute', top: '-5px', right: '-10px', backgroundColor: '#e74c3c', color: 'white', width: '20px', height: '20px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold' },
  product: { display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px', border: '1px solid #eee', borderRadius: '12px' },
  productImage: { width: '100px', height: '100px', backgroundColor: '#f1f2f6', borderRadius: '8px', marginBottom: '15px', position: 'relative' },
  flyingItem: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: '#3498db', borderRadius: '8px', opacity: 0 },
  productName: { fontSize: '16px', fontWeight: 'bold', marginBottom: '15px' },
  button: { backgroundColor: '#2ecc71', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '20px', fontWeight: 'bold', cursor: 'pointer' }
};
