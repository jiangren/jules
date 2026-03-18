import React, { useState, useEffect, useRef, useMemo } from 'react';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    withDelay,
    withSpring,
    withSequence,
    withRepeat,
    Easing,
    interpolate,
} from 'react-native-reanimated';
import { View, Text, Pressable, StyleSheet } from 'react-native-web';
import { gsap } from 'gsap';

// ==========================================
// Demo 27: VIP Promo Popup
// Features: Radial burst background, price card cascade,
//           discount arrow slide, badge bounce, CTA button,
//           floating particles, shimmer effect.
// Reference: NetEase Cloud Music SVIP 7th Anniversary Promo
// ==========================================

// --- Sub-Components ---

const FloatingParticle = ({ delay: particleDelay, style }) => {
    const y = useSharedValue(0);
    const opacity = useSharedValue(0);
    const x = useSharedValue(0);

    useEffect(() => {
        y.value = withDelay(
            particleDelay || 0,
            withRepeat(
                withSequence(
                    withTiming(-80 - Math.random() * 60, { duration: 3000 + Math.random() * 2000, easing: Easing.linear }),
                    withTiming(0, { duration: 0 })
                ),
                -1,
                false
            )
        );
        opacity.value = withDelay(
            particleDelay || 0,
            withRepeat(
                withSequence(
                    withTiming(0.8, { duration: 1500 }),
                    withTiming(0, { duration: 1500 })
                ),
                -1,
                true
            )
        );
        x.value = withDelay(
            particleDelay || 0,
            withRepeat(
                withSequence(
                    withTiming(Math.random() * 20 - 10, { duration: 2000, easing: Easing.inOut(Easing.quad) }),
                    withTiming(0, { duration: 2000, easing: Easing.inOut(Easing.quad) })
                ),
                -1,
                true
            )
        );
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: y.value }, { translateX: x.value }],
        opacity: opacity.value,
    }));

    return <Animated.View style={[styles.particle, style, animatedStyle]} />;
};

export const ReanimatedVipPromo = () => {
    const [isVisible, setIsVisible] = useState(false);

    // Gift phase
    const giftScale = useSharedValue(0);
    const giftOpacity = useSharedValue(0);
    const giftShake = useSharedValue(0);
    const contentOpacity = useSharedValue(0);

    // Popup
    const popupScale = useSharedValue(0);
    const popupOpacity = useSharedValue(0);

    // Radial burst bg
    const burstScale = useSharedValue(0.5);
    const burstOpacity = useSharedValue(0);
    const burstRotate = useSharedValue(0);

    // Title
    const titleOpacity = useSharedValue(0);
    const titleY = useSharedValue(-20);

    // Price card
    const cardScale = useSharedValue(0.8);
    const cardOpacity = useSharedValue(0);
    const cardY = useSharedValue(30);

    // Original price block — starts centered
    const origPriceOpacity = useSharedValue(0);
    const origPriceX = useSharedValue(55);
    const origPriceScale = useSharedValue(1.15);

    // Discount arrow
    const arrowScale = useSharedValue(0);
    const arrowRotate = useSharedValue(-45);
    const arrowOpacity = useSharedValue(0);

    // Discount price
    const discountScale = useSharedValue(0);
    const discountOpacity = useSharedValue(0);

    // Badge ("全年底价")
    const badgeScale = useSharedValue(0);
    const badgeRotate = useSharedValue(-30);
    const badgeShakeRotate = useSharedValue(0);

    // CTA Button
    const ctaY = useSharedValue(40);
    const ctaOpacity = useSharedValue(0);
    const ctaGlow = useSharedValue(0);

    // Close button
    const closeOpacity = useSharedValue(0);

    // Shimmer
    const shimmerX = useSharedValue(-300);

    // Brand text
    const brandOpacity = useSharedValue(0);

    const GIFT_DURATION = 1800; // gift phase duration

    const openPopup = () => {
        setIsVisible(true);

        // Reset all
        giftScale.value = 0; giftOpacity.value = 0; giftShake.value = 0; contentOpacity.value = 0;
        popupScale.value = 0; popupOpacity.value = 0;
        burstScale.value = 0.5; burstOpacity.value = 0; burstRotate.value = 0;
        titleOpacity.value = 0; titleY.value = -20;
        cardScale.value = 0.8; cardOpacity.value = 0; cardY.value = 30;
        origPriceOpacity.value = 0; origPriceX.value = 55; origPriceScale.value = 1.15;
        arrowScale.value = 0; arrowRotate.value = -45; arrowOpacity.value = 0;
        discountScale.value = 0; discountOpacity.value = 0;
        badgeScale.value = 0; badgeRotate.value = -30; badgeShakeRotate.value = 0;
        ctaY.value = 40; ctaOpacity.value = 0; ctaGlow.value = 0;
        closeOpacity.value = 0; shimmerX.value = -300; brandOpacity.value = 0;

        // === Phase 0: Gift shaking (0ms) ===
        popupScale.value = withSpring(1, { damping: 14, stiffness: 100 });
        popupOpacity.value = withTiming(1, { duration: 400 });
        // Gift appear → hold → fade out (single sequence to avoid overwrite)
        giftOpacity.value = withSequence(
            withTiming(1, { duration: 300 }),
            withDelay(GIFT_DURATION - 600, withTiming(0, { duration: 300 }))
        );
        giftScale.value = withSequence(
            withTiming(1.2, { duration: 200 }),
            withTiming(1, { duration: 150 }),
            withDelay(GIFT_DURATION - 650, withTiming(0.5, { duration: 300 }))
        );
        // Gift shake loop
        giftShake.value = withDelay(400, withSequence(
            withTiming(-12, { duration: 60 }), withTiming(12, { duration: 60 }),
            withTiming(-12, { duration: 60 }), withTiming(12, { duration: 60 }),
            withTiming(-8, { duration: 60 }), withTiming(8, { duration: 60 }),
            withTiming(-8, { duration: 60 }), withTiming(8, { duration: 60 }),
            withTiming(-4, { duration: 60 }), withTiming(4, { duration: 60 }),
            withTiming(0, { duration: 60 })
        ));

        // === Phase 1: Content appears (after gift) ===
        const D = GIFT_DURATION;
        contentOpacity.value = withDelay(D, withTiming(1, { duration: 400 }));

        // Radial burst with continuous rotation
        burstScale.value = withDelay(D, withTiming(1, { duration: 800, easing: Easing.out(Easing.quad) }));
        burstOpacity.value = withDelay(D, withTiming(0.6, { duration: 600 }));
        burstRotate.value = withDelay(D, withRepeat(withTiming(360, { duration: 20000, easing: Easing.linear }), -1, false));

        // Title
        titleOpacity.value = withDelay(D + 200, withTiming(1, { duration: 500 }));
        titleY.value = withDelay(D + 200, withSpring(0, { damping: 12 }));

        // Price card
        cardOpacity.value = withDelay(D + 500, withTiming(1, { duration: 400 }));
        cardScale.value = withDelay(D + 500, withSpring(1, { damping: 12 }));
        cardY.value = withDelay(D + 500, withSpring(0, { damping: 14 }));

        // OrigPrice: appear centered first
        origPriceOpacity.value = withDelay(D + 700, withTiming(1, { duration: 400 }));
        // Then move to left after a pause
        origPriceX.value = withDelay(D + 1400, withTiming(0, { duration: 500, easing: Easing.inOut(Easing.quad) }));
        origPriceScale.value = withDelay(D + 1400, withTiming(1, { duration: 500, easing: Easing.inOut(Easing.quad) }));

        // Brand text
        brandOpacity.value = withDelay(D + 900, withTiming(0.6, { duration: 400 }));

        // Discount arrow (after origPrice moves)
        arrowOpacity.value = withDelay(D + 1700, withTiming(1, { duration: 300 }));
        arrowScale.value = withDelay(D + 1700, withSpring(1, { damping: 10, stiffness: 150 }));
        arrowRotate.value = withDelay(D + 1700, withSpring(0, { damping: 10 }));

        // Discount price
        discountOpacity.value = withDelay(D + 2000, withTiming(1, { duration: 300 }));
        discountScale.value = withDelay(D + 2000, withSequence(
            withSpring(1.2, { damping: 8, stiffness: 200 }),
            withSpring(1, { damping: 12 })
        ));

        // Badge appear
        badgeScale.value = withDelay(D + 2300, withSequence(
            withSpring(1.3, { damping: 6, stiffness: 200 }),
            withSpring(1, { damping: 10 })
        ));
        badgeRotate.value = withDelay(D + 2300, withSpring(0, { damping: 8 }));

        // Badge periodic shake
        badgeShakeRotate.value = withDelay(D + 3500, withRepeat(
            withSequence(
                withTiming(-10, { duration: 50 }), withTiming(10, { duration: 50 }),
                withTiming(-10, { duration: 50 }), withTiming(10, { duration: 50 }),
                withTiming(-6, { duration: 50 }), withTiming(6, { duration: 50 }),
                withTiming(0, { duration: 50 }),
                withDelay(3000, withTiming(0, { duration: 0 }))
            ), -1, false
        ));

        // CTA Button
        ctaOpacity.value = withDelay(D + 2600, withTiming(1, { duration: 400 }));
        ctaY.value = withDelay(D + 2600, withSpring(0, { damping: 12 }));

        // CTA Glow loop
        ctaGlow.value = withDelay(D + 3000, withRepeat(
            withSequence(withTiming(1, { duration: 1000 }), withTiming(0, { duration: 1000 })), -1, true
        ));

        // Close button
        closeOpacity.value = withDelay(D + 3000, withTiming(0.8, { duration: 400 }));

        // Shimmer loop
        shimmerX.value = withDelay(D + 3500, withRepeat(
            withSequence(withTiming(300, { duration: 1500, easing: Easing.inOut(Easing.quad) }), withTiming(-300, { duration: 0 })), -1, false
        ));
    };

    const closePopup = () => {
        popupScale.value = withTiming(0.8, { duration: 250 });
        popupOpacity.value = withTiming(0, { duration: 250 });
        setTimeout(() => setIsVisible(false), 260);
    };

    // Animated styles
    const popupStyle = useAnimatedStyle(() => ({ transform: [{ scale: popupScale.value }], opacity: popupOpacity.value }));
    const giftStyle = useAnimatedStyle(() => ({ transform: [{ scale: giftScale.value }, { rotate: `${giftShake.value}deg` }], opacity: giftOpacity.value }));
    const contentStyle = useAnimatedStyle(() => ({ opacity: contentOpacity.value }));
    const burstStyle = useAnimatedStyle(() => ({ transform: [{ scale: burstScale.value }, { rotate: `${burstRotate.value}deg` }], opacity: burstOpacity.value }));
    const titleStyle = useAnimatedStyle(() => ({ opacity: titleOpacity.value, transform: [{ translateY: titleY.value }] }));
    const cardStyle = useAnimatedStyle(() => ({ opacity: cardOpacity.value, transform: [{ scale: cardScale.value }, { translateY: cardY.value }] }));
    const origPriceStyle = useAnimatedStyle(() => ({ opacity: origPriceOpacity.value, transform: [{ translateX: origPriceX.value }, { scale: origPriceScale.value }] }));
    const arrowStyle = useAnimatedStyle(() => ({ opacity: arrowOpacity.value, transform: [{ scale: arrowScale.value }, { rotate: `${arrowRotate.value}deg` }] }));
    const discountStyle = useAnimatedStyle(() => ({ opacity: discountOpacity.value, transform: [{ scale: discountScale.value }] }));
    const badgeStyle = useAnimatedStyle(() => ({ transform: [{ scale: badgeScale.value }, { rotate: `${badgeRotate.value + badgeShakeRotate.value}deg` }], opacity: badgeScale.value }));
    const ctaStyle = useAnimatedStyle(() => ({ opacity: ctaOpacity.value, transform: [{ translateY: ctaY.value }] }));
    const ctaGlowStyle = useAnimatedStyle(() => ({ opacity: interpolate(ctaGlow.value, [0, 1], [0, 0.4]) }));
    const closeStyle = useAnimatedStyle(() => ({ opacity: closeOpacity.value }));
    const shimmerStyle = useAnimatedStyle(() => ({ transform: [{ translateX: shimmerX.value }, { rotate: '25deg' }] }));
    const brandStyle = useAnimatedStyle(() => ({ opacity: brandOpacity.value }));

    return (
        <View style={styles.container}>
            {[...Array(12)].map((_, i) => (
                <FloatingParticle key={i} delay={i * 200} style={{ left: `${10 + Math.random() * 80}%`, top: `${10 + Math.random() * 80}%`, width: 2 + Math.random() * 3, height: 2 + Math.random() * 3 }} />
            ))}

            {!isVisible ? (
                <Pressable style={styles.openBtn} onPress={openPopup}>
                    <Text style={styles.btnText}>🎉 Open VIP Promo</Text>
                </Pressable>
            ) : (
                <View style={StyleSheet.absoluteFillObject}>
                    <Pressable style={styles.backdrop} onPress={closePopup} />
                    <View style={styles.popupCenter}>
                        <Animated.View style={[styles.popup, popupStyle]}>
                            {/* Radial Burst Background — rotates */}
                            <Animated.View style={[styles.radialBurst, burstStyle]} />

                            {/* Gift shaking phase */}
                            <Animated.View style={[styles.giftWrap, giftStyle]}>
                                <Text style={styles.giftEmoji}>🎁</Text>
                            </Animated.View>

                            {/* Main content — fades in after gift */}
                            <Animated.View style={[{ width: '100%', alignItems: 'center' }, contentStyle]}>
                                <Animated.View style={[styles.headerSection, titleStyle]}>
                                    <Text style={styles.headerLabel}>弹窗合集</Text>
                                    <Text style={styles.headerTitle}>会员7周年庆</Text>
                                    <Text style={styles.headerTitle}>SVIP年卡 2.1折!</Text>
                                </Animated.View>

                                <Animated.View style={[styles.priceCard, cardStyle]}>
                                    <Animated.View style={[styles.cardShimmer, shimmerStyle]} />
                                    <View style={styles.priceRow}>
                                        <Animated.View style={[styles.origPriceBlock, origPriceStyle]}>
                                            <Text style={styles.origLabel}>刊例价</Text>
                                            <Text style={styles.origPrice}>¥480/年</Text>
                                        </Animated.View>
                                        <View style={styles.discountSection}>
                                            <Animated.View style={[styles.discountArrowWrap, arrowStyle]}>
                                                <View style={styles.discountArrowBody}>
                                                    <Text style={styles.discountArrowLabel}>直降</Text>
                                                    <Text style={styles.discountArrowAmount}>¥382</Text>
                                                </View>
                                                <View style={styles.discountArrowTip} />
                                            </Animated.View>
                                            <Animated.View style={[styles.bigPriceWrap, discountStyle]}>
                                                <Text style={styles.bigPriceYen}>¥</Text>
                                                <Text style={styles.bigPrice}>98</Text>
                                                <Text style={styles.bigPriceUnit}>/年</Text>
                                            </Animated.View>
                                        </View>
                                        <Animated.View style={[styles.badge, badgeStyle]}>
                                            <Text style={styles.badgeText}>全年</Text>
                                            <Text style={styles.badgeText}>底价</Text>
                                        </Animated.View>
                                    </View>
                                    <Animated.View style={[styles.brandSection, brandStyle]}>
                                        <Text style={styles.brandText}>NETEASE CLOUD MUSIC</Text>
                                    </Animated.View>
                                </Animated.View>

                                <Animated.View style={[styles.ctaContainer, ctaStyle]}>
                                    <Animated.View style={[styles.ctaGlow, ctaGlowStyle]} />
                                    <Pressable style={styles.ctaBtn} onPress={closePopup}>
                                        <Text style={styles.ctaText}>¥98 新客限购一次</Text>
                                    </Pressable>
                                </Animated.View>

                                <Animated.View style={[styles.closeBtn, closeStyle]}>
                                    <Pressable onPress={closePopup}>
                                        <Text style={styles.closeText}>✕</Text>
                                    </Pressable>
                                </Animated.View>
                            </Animated.View>
                        </Animated.View>
                    </View>
                </View>
            )}
        </View>
    );
};

// ==========================================
// GSAP Version
// ==========================================

export const GsapVipPromo = () => {
    const [isVisible, setIsVisible] = useState(false);

    const popupRef = useRef(null);
    const burstRef = useRef(null);
    const giftRef = useRef(null);
    const contentRef = useRef(null);
    const headerRef = useRef(null);
    const cardRef = useRef(null);
    const origPriceRef = useRef(null);
    const arrowRef = useRef(null);
    const discountRef = useRef(null);
    const badgeRef = useRef(null);
    const ctaRef = useRef(null);
    const ctaGlowRef = useRef(null);
    const closeRef = useRef(null);
    const shimmerRef = useRef(null);
    const brandRef = useRef(null);

    const openPopup = () => setIsVisible(true);

    useEffect(() => {
        if (!isVisible) return;

        const tl = gsap.timeline();

        // Phase 0: Popup + Gift shaking
        tl.fromTo(popupRef.current, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.6, ease: "elastic.out(1, 0.7)" });
        tl.fromTo(giftRef.current, { scale: 0, opacity: 0 }, { scale: 1.2, opacity: 1, duration: 0.3, ease: "back.out(2)" }, "-=0.3");
        tl.to(giftRef.current, { scale: 1, duration: 0.2 });
        // Gift shake
        tl.to(giftRef.current, { rotation: -12, duration: 0.06, ease: "none" }, "+=0.2");
        tl.to(giftRef.current, { rotation: 12, duration: 0.06, ease: "none" });
        tl.to(giftRef.current, { rotation: -12, duration: 0.06, ease: "none" });
        tl.to(giftRef.current, { rotation: 12, duration: 0.06, ease: "none" });
        tl.to(giftRef.current, { rotation: -8, duration: 0.06, ease: "none" });
        tl.to(giftRef.current, { rotation: 8, duration: 0.06, ease: "none" });
        tl.to(giftRef.current, { rotation: -4, duration: 0.06, ease: "none" });
        tl.to(giftRef.current, { rotation: 4, duration: 0.06, ease: "none" });
        tl.to(giftRef.current, { rotation: 0, duration: 0.06, ease: "none" });
        // Gift fade out
        tl.to(giftRef.current, { scale: 0.5, opacity: 0, duration: 0.3 }, "+=0.3");

        // Phase 1: Content
        tl.fromTo(contentRef.current, { opacity: 0 }, { opacity: 1, duration: 0.4 });

        // Radial burst + rotation
        tl.fromTo(burstRef.current, { scale: 0.5, opacity: 0 }, { scale: 1, opacity: 0.6, duration: 0.8, ease: "power2.out" }, "-=0.3");
        gsap.to(burstRef.current, { rotation: 360, duration: 20, repeat: -1, ease: "none", delay: 1.8 });

        // Title
        tl.fromTo(headerRef.current, { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" }, "-=0.5");

        // Price card
        tl.fromTo(cardRef.current, { opacity: 0, scale: 0.8, y: 30 }, { opacity: 1, scale: 1, y: 0, duration: 0.6, ease: "back.out(1.5)" }, "-=0.2");

        // OrigPrice: appear centered, then move left
        tl.fromTo(origPriceRef.current, { opacity: 0, x: 55, scale: 1.15 }, { opacity: 1, x: 55, scale: 1.15, duration: 0.4, ease: "power2.out" }, "-=0.3");
        // Brand text
        tl.fromTo(brandRef.current, { opacity: 0 }, { opacity: 0.6, duration: 0.4 }, "-=0.2");
        // Pause, then move origPrice to left
        tl.to(origPriceRef.current, { x: 0, scale: 1, duration: 0.5, ease: "power2.inOut" }, "+=0.5");

        // Discount arrow (after origPrice moves)
        tl.fromTo(arrowRef.current, { opacity: 0, scale: 0, rotation: -45 }, { opacity: 1, scale: 1, rotation: 0, duration: 0.4, ease: "back.out(2)" }, "-=0.1");

        // Discount price
        tl.fromTo(discountRef.current, { opacity: 0, scale: 0 }, { opacity: 1, scale: 1.2, duration: 0.3, ease: "back.out(3)" });
        tl.to(discountRef.current, { scale: 1, duration: 0.2 });

        // Badge
        tl.fromTo(badgeRef.current, { scale: 0, rotation: -30 }, { scale: 1.3, rotation: 0, duration: 0.3, ease: "back.out(3)" }, "-=0.3");
        tl.to(badgeRef.current, { scale: 1, duration: 0.2 });

        // CTA
        tl.fromTo(ctaRef.current, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" }, "-=0.2");

        // Close button
        tl.fromTo(closeRef.current, { opacity: 0 }, { opacity: 0.8, duration: 0.4 }, "-=0.3");

        // Looping effects
        gsap.to(ctaGlowRef.current, { opacity: 0.4, duration: 1, repeat: -1, yoyo: true, delay: 4 });
        gsap.fromTo(shimmerRef.current, { x: -300 }, { x: 300, duration: 1.5, repeat: -1, ease: "power2.inOut", repeatDelay: 2 });

        // Badge periodic shake
        gsap.timeline({ repeat: -1, repeatDelay: 3, delay: 5 })
            .to(badgeRef.current, { rotation: -10, duration: 0.05, ease: "none" })
            .to(badgeRef.current, { rotation: 10, duration: 0.05, ease: "none" })
            .to(badgeRef.current, { rotation: -10, duration: 0.05, ease: "none" })
            .to(badgeRef.current, { rotation: 10, duration: 0.05, ease: "none" })
            .to(badgeRef.current, { rotation: -6, duration: 0.05, ease: "none" })
            .to(badgeRef.current, { rotation: 6, duration: 0.05, ease: "none" })
            .to(badgeRef.current, { rotation: 0, duration: 0.05, ease: "none" });

    }, [isVisible]);

    const closePopup = () => {
        gsap.to(popupRef.current, { scale: 0.8, opacity: 0, duration: 0.3, onComplete: () => setIsVisible(false) });
    };

    return (
        <div style={gsapStyles.container}>
            {[...Array(12)].map((_, i) => (
                <div key={i} style={{ ...gsapStyles.particle, left: `${10 + Math.random() * 80}%`, top: `${10 + Math.random() * 80}%`, width: `${2 + Math.random() * 3}px`, height: `${2 + Math.random() * 3}px`, animation: `float ${3 + Math.random() * 2}s ease-in-out infinite`, animationDelay: `${i * 0.2}s` }} />
            ))}

            {!isVisible ? (
                <button style={gsapStyles.openBtn} onClick={openPopup}>🎉 Open VIP Promo</button>
            ) : (
                <div style={gsapStyles.overlay}>
                    <div style={gsapStyles.backdrop} onClick={closePopup} />
                    <div ref={popupRef} style={gsapStyles.popup}>
                        <div ref={burstRef} style={gsapStyles.radialBurst} />

                        {/* Gift */}
                        <div ref={giftRef} style={gsapStyles.giftWrap}>
                            <span style={gsapStyles.giftEmoji}>🎁</span>
                        </div>

                        {/* Content */}
                        <div ref={contentRef} style={gsapStyles.contentWrap}>
                            <div ref={headerRef} style={gsapStyles.headerSection}>
                                <div style={gsapStyles.headerLabel}>弹窗合集</div>
                                <div style={gsapStyles.headerTitle}>会员7周年庆</div>
                                <div style={gsapStyles.headerTitle}>SVIP年卡 2.1折!</div>
                            </div>

                            <div ref={cardRef} style={gsapStyles.priceCard}>
                                <div ref={shimmerRef} style={gsapStyles.cardShimmer} />
                                <div style={gsapStyles.priceRow}>
                                    <div ref={origPriceRef} style={gsapStyles.origPriceBlock}>
                                        <div style={gsapStyles.origLabel}>刊例价</div>
                                        <div style={gsapStyles.origPrice}>¥480/年</div>
                                    </div>
                                    <div style={gsapStyles.discountSection}>
                                        <div ref={arrowRef} style={gsapStyles.discountArrowWrap}>
                                            <div style={gsapStyles.discountArrowBody}>
                                                <span style={gsapStyles.discountArrowLabel}>直降</span>
                                                <span style={gsapStyles.discountArrowAmount}>¥382</span>
                                            </div>
                                            <div style={gsapStyles.discountArrowTip} />
                                        </div>
                                        <div ref={discountRef} style={gsapStyles.bigPriceWrap}>
                                            <span style={gsapStyles.bigPriceYen}>¥</span>
                                            <span style={gsapStyles.bigPrice}>98</span>
                                            <span style={gsapStyles.bigPriceUnit}>/年</span>
                                        </div>
                                    </div>
                                    <div ref={badgeRef} style={gsapStyles.badge}>
                                        <span style={gsapStyles.badgeText}>全年</span>
                                        <span style={gsapStyles.badgeText}>底价</span>
                                    </div>
                                </div>
                                <div ref={brandRef} style={gsapStyles.brandSection}>
                                    <span style={gsapStyles.brandText}>NETEASE CLOUD MUSIC</span>
                                </div>
                            </div>

                            <div ref={ctaRef} style={gsapStyles.ctaContainer}>
                                <div ref={ctaGlowRef} style={gsapStyles.ctaGlow} />
                                <button style={gsapStyles.ctaBtn} onClick={closePopup}>¥98 新客限购一次</button>
                            </div>

                            <div ref={closeRef} style={gsapStyles.closeBtn} onClick={closePopup}>✕</div>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0) translateX(0); opacity: 0; }
                    25% { opacity: 0.8; }
                    50% { transform: translateY(-60px) translateX(5px); opacity: 0.6; }
                    75% { opacity: 0.3; }
                }
            `}</style>
        </div>
    );
};

// ==========================================
// Styles — Reanimated (React Native Web)
// ==========================================

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#1a1a2e',
        overflow: 'hidden',
    },
    particle: {
        position: 'absolute',
        borderRadius: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.6)',
        pointerEvents: 'none',
    },
    openBtn: {
        paddingVertical: 14,
        paddingHorizontal: 30,
        backgroundColor: '#e74c3c',
        borderRadius: 25,
        shadowColor: '#e74c3c',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 12,
        zIndex: 10,
    },
    btnText: {
        color: 'white',
        fontWeight: '800',
        fontSize: 18,
        letterSpacing: 0.5,
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
    },
    popupCenter: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    popup: {
        width: 320,
        backgroundColor: '#2d2d44',
        borderRadius: 24,
        paddingTop: 20,
        paddingBottom: 24,
        paddingHorizontal: 20,
        alignItems: 'center',
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 20 },
        shadowOpacity: 0.6,
        shadowRadius: 40,
    },
    radialBurst: {
        position: 'absolute',
        width: 400,
        height: 400,
        borderRadius: 200,
        top: -50,
        backgroundColor: 'transparent',
        borderWidth: 0,
        // Simulating radial lines with a radial gradient
        backgroundImage: `conic-gradient(
            from 0deg,
            rgba(255,255,255,0.06) 0deg,
            transparent 10deg,
            transparent 20deg,
            rgba(255,255,255,0.06) 20deg,
            transparent 30deg,
            transparent 40deg,
            rgba(255,255,255,0.06) 40deg,
            transparent 50deg,
            transparent 60deg,
            rgba(255,255,255,0.06) 60deg,
            transparent 70deg,
            transparent 80deg,
            rgba(255,255,255,0.06) 80deg,
            transparent 90deg,
            transparent 100deg,
            rgba(255,255,255,0.06) 100deg,
            transparent 110deg,
            transparent 120deg,
            rgba(255,255,255,0.06) 120deg,
            transparent 130deg,
            transparent 140deg,
            rgba(255,255,255,0.06) 140deg,
            transparent 150deg,
            transparent 160deg,
            rgba(255,255,255,0.06) 160deg,
            transparent 170deg,
            transparent 180deg,
            rgba(255,255,255,0.06) 180deg,
            transparent 190deg,
            transparent 200deg,
            rgba(255,255,255,0.06) 200deg,
            transparent 210deg,
            transparent 220deg,
            rgba(255,255,255,0.06) 220deg,
            transparent 230deg,
            transparent 240deg,
            rgba(255,255,255,0.06) 240deg,
            transparent 250deg,
            transparent 260deg,
            rgba(255,255,255,0.06) 260deg,
            transparent 270deg,
            transparent 280deg,
            rgba(255,255,255,0.06) 280deg,
            transparent 290deg,
            transparent 300deg,
            rgba(255,255,255,0.06) 300deg,
            transparent 310deg,
            transparent 320deg,
            rgba(255,255,255,0.06) 320deg,
            transparent 330deg,
            transparent 340deg,
            rgba(255,255,255,0.06) 340deg,
            transparent 350deg,
            transparent 360deg
        )`,
        pointerEvents: 'none',
    },
    headerSection: {
        alignItems: 'center',
        marginBottom: 16,
        zIndex: 2,
    },
    headerLabel: {
        fontSize: 14,
        color: 'rgba(255, 200, 150, 0.7)',
        fontWeight: '600',
        marginBottom: 6,
        letterSpacing: 2,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: '900',
        color: '#fff',
        textAlign: 'center',
        lineHeight: 30,
    },
    priceCard: {
        width: '100%',
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        borderRadius: 20,
        padding: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
        // gradient from golden to pink
        backgroundImage: 'linear-gradient(180deg, rgba(255,220,150,0.15) 0%, rgba(255,150,180,0.1) 100%)',
        zIndex: 2,
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12,
        minHeight: 80,
    },
    origPriceBlock: {
        backgroundColor: 'rgba(255,255,255,0.9)',
        borderRadius: 12,
        padding: 10,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(220,150,150,0.3)',
    },
    origLabel: {
        fontSize: 11,
        color: '#b08968',
        fontWeight: '700',
    },
    origPrice: {
        fontSize: 16,
        color: '#8b5e3c',
        fontWeight: '800',
    },
    discountSection: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 8,
    },
    discountArrowWrap: {
        alignItems: 'center',
        marginBottom: 2,
        position: 'relative',
    },
    discountArrowBody: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#e74c3c',
        paddingVertical: 5,
        paddingHorizontal: 12,
        borderTopLeftRadius: 14,
        borderTopRightRadius: 14,
        borderBottomLeftRadius: 14,
        borderBottomRightRadius: 4,
        shadowColor: '#e74c3c',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.4,
        shadowRadius: 6,
    },
    discountArrowTip: {
        width: 0,
        height: 0,
        borderLeftWidth: 10,
        borderRightWidth: 10,
        borderTopWidth: 12,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderTopColor: '#e74c3c',
        alignSelf: 'flex-end',
        marginRight: 6,
    },
    discountArrowLabel: {
        color: 'white',
        fontSize: 11,
        fontWeight: '700',
        marginRight: 2,
    },
    discountArrowAmount: {
        color: 'white',
        fontSize: 14,
        fontWeight: '900',
    },
    bigPriceWrap: {
        flexDirection: 'row',
        alignItems: 'baseline',
    },
    bigPriceYen: {
        fontSize: 20,
        color: '#e74c3c',
        fontWeight: '900',
    },
    bigPrice: {
        fontSize: 40,
        color: '#e74c3c',
        fontWeight: '900',
        lineHeight: 44,
    },
    bigPriceUnit: {
        fontSize: 14,
        color: '#e74c3c',
        fontWeight: '700',
    },
    badge: {
        backgroundColor: '#fff3cd',
        borderRadius: 30,
        width: 50,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#f0ad4e',
        shadowColor: '#f0ad4e',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.4,
        shadowRadius: 6,
    },
    badgeText: {
        fontSize: 11,
        fontWeight: '900',
        color: '#d35400',
        lineHeight: 14,
    },
    brandSection: {
        alignItems: 'center',
        marginTop: 4,
    },
    brandText: {
        fontSize: 10,
        color: 'rgba(255,255,255,0.4)',
        fontWeight: '600',
        letterSpacing: 2,
    },
    cardShimmer: {
        position: 'absolute',
        top: -100,
        bottom: -100,
        width: 50,
        backgroundColor: 'rgba(255,255,255,0.12)',
        pointerEvents: 'none',
    },
    ctaContainer: {
        width: '100%',
        marginTop: 16,
        zIndex: 2,
        position: 'relative',
    },
    ctaGlow: {
        position: 'absolute',
        top: -5,
        left: -5,
        right: -5,
        bottom: -5,
        borderRadius: 30,
        backgroundColor: '#e74c3c',
        pointerEvents: 'none',
    },
    ctaBtn: {
        width: '100%',
        paddingVertical: 16,
        backgroundColor: 'linear-gradient(90deg, #e74c3c, #ff6b6b)',
        borderRadius: 25,
        alignItems: 'center',
        overflow: 'hidden',
        // fallback bg
        backgroundImage: 'linear-gradient(90deg, #e74c3c, #ff6b6b)',
    },
    ctaText: {
        color: 'white',
        fontWeight: '900',
        fontSize: 17,
        letterSpacing: 0.5,
    },
    closeBtn: {
        marginTop: 16,
        width: 30,
        height: 30,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2,
    },
    closeText: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 14,
    },
    giftWrap: {
        position: 'absolute',
        zIndex: 10,
        alignItems: 'center',
        justifyContent: 'center',
        top: '35%',
    },
    giftEmoji: {
        fontSize: 64,
    },
});

// ==========================================
// Styles — GSAP (DOM/CSS)
// ==========================================

const gsapStyles = {
    container: {
        height: '100%',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#1a1a2e',
        position: 'relative',
        overflow: 'hidden',
    },
    particle: {
        position: 'absolute',
        borderRadius: '10px',
        backgroundColor: 'rgba(255, 255, 255, 0.6)',
        pointerEvents: 'none',
    },
    openBtn: {
        padding: '14px 30px',
        backgroundColor: '#e74c3c',
        color: 'white',
        border: 'none',
        borderRadius: '25px',
        fontWeight: '800',
        cursor: 'pointer',
        fontSize: '18px',
        boxShadow: '0 4px 15px rgba(231, 76, 60, 0.5)',
        position: 'relative',
        zIndex: 10,
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
    },
    backdrop: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
    },
    popup: {
        position: 'relative',
        width: '320px',
        backgroundColor: '#2d2d44',
        borderRadius: '24px',
        padding: '20px 20px 24px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        overflow: 'hidden',
        border: '1px solid rgba(255,255,255,0.08)',
        boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
    },
    radialBurst: {
        position: 'absolute',
        width: '400px',
        height: '400px',
        borderRadius: '200px',
        top: '-50px',
        background: `conic-gradient(
            from 0deg,
            rgba(255,255,255,0.06) 0deg,
            transparent 10deg,
            transparent 20deg,
            rgba(255,255,255,0.06) 20deg,
            transparent 30deg,
            transparent 40deg,
            rgba(255,255,255,0.06) 40deg,
            transparent 50deg,
            transparent 60deg,
            rgba(255,255,255,0.06) 60deg,
            transparent 70deg,
            transparent 80deg,
            rgba(255,255,255,0.06) 80deg,
            transparent 90deg,
            transparent 100deg,
            rgba(255,255,255,0.06) 100deg,
            transparent 110deg,
            transparent 120deg,
            rgba(255,255,255,0.06) 120deg,
            transparent 130deg,
            transparent 140deg,
            rgba(255,255,255,0.06) 140deg,
            transparent 150deg,
            transparent 160deg,
            rgba(255,255,255,0.06) 160deg,
            transparent 170deg,
            transparent 180deg,
            rgba(255,255,255,0.06) 180deg,
            transparent 190deg,
            transparent 200deg,
            rgba(255,255,255,0.06) 200deg,
            transparent 210deg,
            transparent 220deg,
            rgba(255,255,255,0.06) 220deg,
            transparent 230deg,
            transparent 240deg,
            rgba(255,255,255,0.06) 240deg,
            transparent 250deg,
            transparent 260deg,
            rgba(255,255,255,0.06) 260deg,
            transparent 270deg,
            transparent 280deg,
            rgba(255,255,255,0.06) 280deg,
            transparent 290deg,
            transparent 300deg,
            rgba(255,255,255,0.06) 300deg,
            transparent 310deg,
            transparent 320deg,
            rgba(255,255,255,0.06) 320deg,
            transparent 330deg,
            transparent 340deg,
            rgba(255,255,255,0.06) 340deg,
            transparent 350deg,
            transparent 360deg
        )`,
        pointerEvents: 'none',
    },
    headerSection: {
        textAlign: 'center',
        marginBottom: '16px',
        zIndex: 2,
        position: 'relative',
    },
    headerLabel: {
        fontSize: '14px',
        color: 'rgba(255, 200, 150, 0.7)',
        fontWeight: '600',
        marginBottom: '6px',
        letterSpacing: '2px',
    },
    headerTitle: {
        fontSize: '22px',
        fontWeight: '900',
        color: '#fff',
        lineHeight: '30px',
        margin: 0,
    },
    priceCard: {
        width: '100%',
        borderRadius: '20px',
        padding: '16px',
        overflow: 'hidden',
        border: '1px solid rgba(255,255,255,0.08)',
        background: 'linear-gradient(180deg, rgba(255,220,150,0.15) 0%, rgba(255,150,180,0.1) 100%)',
        position: 'relative',
        zIndex: 2,
    },
    priceRow: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '12px',
        minHeight: '80px',
    },
    origPriceBlock: {
        backgroundColor: 'rgba(255,255,255,0.9)',
        borderRadius: '12px',
        padding: '10px',
        textAlign: 'center',
        border: '1px solid rgba(220,150,150,0.3)',
    },
    origLabel: {
        fontSize: '11px',
        color: '#b08968',
        fontWeight: '700',
    },
    origPrice: {
        fontSize: '16px',
        color: '#8b5e3c',
        fontWeight: '800',
    },
    discountSection: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: '8px',
    },
    discountArrowWrap: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: '2px',
        position: 'relative',
    },
    discountArrowBody: {
        display: 'flex',
        alignItems: 'center',
        backgroundColor: '#e74c3c',
        padding: '5px 12px',
        borderRadius: '14px 14px 14px 4px',
        boxShadow: '0 3px 8px rgba(231, 76, 60, 0.4)',
    },
    discountArrowTip: {
        width: 0,
        height: 0,
        borderLeft: '10px solid transparent',
        borderRight: '10px solid transparent',
        borderTop: '12px solid #e74c3c',
        alignSelf: 'flex-end',
        marginRight: '6px',
    },
    discountArrowLabel: {
        color: 'white',
        fontSize: '11px',
        fontWeight: '700',
        marginRight: '2px',
    },
    discountArrowAmount: {
        color: 'white',
        fontSize: '14px',
        fontWeight: '900',
    },
    bigPriceWrap: {
        display: 'flex',
        alignItems: 'baseline',
    },
    bigPriceYen: {
        fontSize: '20px',
        color: '#e74c3c',
        fontWeight: '900',
    },
    bigPrice: {
        fontSize: '40px',
        color: '#e74c3c',
        fontWeight: '900',
        lineHeight: '44px',
    },
    bigPriceUnit: {
        fontSize: '14px',
        color: '#e74c3c',
        fontWeight: '700',
    },
    badge: {
        backgroundColor: '#fff3cd',
        borderRadius: '30px',
        width: '50px',
        height: '50px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        border: '2px solid #f0ad4e',
        boxShadow: '0 2px 8px rgba(240, 173, 78, 0.4)',
    },
    badgeText: {
        fontSize: '11px',
        fontWeight: '900',
        color: '#d35400',
        lineHeight: '14px',
    },
    brandSection: {
        textAlign: 'center',
        marginTop: '4px',
    },
    brandText: {
        fontSize: '10px',
        color: 'rgba(255,255,255,0.4)',
        fontWeight: '600',
        letterSpacing: '2px',
    },
    cardShimmer: {
        position: 'absolute',
        top: '-100px',
        bottom: '-100px',
        width: '50px',
        backgroundColor: 'rgba(255,255,255,0.12)',
        transform: 'rotate(25deg)',
        pointerEvents: 'none',
    },
    ctaContainer: {
        width: '100%',
        marginTop: '16px',
        zIndex: 2,
        position: 'relative',
    },
    ctaGlow: {
        position: 'absolute',
        top: '-5px',
        left: '-5px',
        right: '-5px',
        bottom: '-5px',
        borderRadius: '30px',
        backgroundColor: '#e74c3c',
        opacity: 0,
        pointerEvents: 'none',
        filter: 'blur(8px)',
    },
    ctaBtn: {
        width: '100%',
        padding: '16px',
        background: 'linear-gradient(90deg, #e74c3c, #ff6b6b)',
        color: 'white',
        border: 'none',
        borderRadius: '25px',
        fontWeight: '900',
        fontSize: '17px',
        cursor: 'pointer',
        letterSpacing: '0.5px',
        position: 'relative',
    },
    closeBtn: {
        marginTop: '16px',
        width: '30px',
        height: '30px',
        borderRadius: '15px',
        border: '1px solid rgba(255,255,255,0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'rgba(255,255,255,0.6)',
        fontSize: '14px',
        cursor: 'pointer',
        zIndex: 2,
        position: 'relative',
    },
    giftWrap: {
        position: 'absolute',
        zIndex: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        top: '35%',
    },
    giftEmoji: {
        fontSize: '64px',
    },
    contentWrap: {
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        opacity: 0,
    },
};
