import React, { useState, useEffect, useMemo } from 'react';
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
    useDerivedValue,
} from 'react-native-reanimated';
import { View, Text, Pressable, StyleSheet, Dimensions } from 'react-native-web';
import { gsap } from 'gsap';

// ==========================================
// Demo 26: Premium Currency Exchange
// Features: Glassmorphism, Background Particles, Glowing Orbs, 
//           Number Counting, Shimmer & Bursts.
// ==========================================

const Particle = ({ delay, style }) => {
    const y = useSharedValue(0);
    const opacity = useSharedValue(0);

    useEffect(() => {
        y.value = withRepeat(
            withSequence(
                withTiming(-100, { duration: 4000 + Math.random() * 2000, easing: Easing.linear }),
                withTiming(0, { duration: 0 })
            ),
            -1,
            false
        );
        opacity.value = withRepeat(
            withSequence(
                withTiming(0.6, { duration: 2000 }),
                withTiming(0, { duration: 2000 })
            ),
            -1,
            true
        );
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: y.value }],
        opacity: opacity.value,
    }));

    return <Animated.View style={[styles.particle, style, animatedStyle]} />;
};

const NumberCounter = ({ value, prefix = "", suffix = "", delay = 0 }) => {
    const animatedValue = useSharedValue(0);
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
        animatedValue.value = withDelay(delay, withTiming(value, { duration: 1500, easing: Easing.out(Easing.exp) }));
    }, [value]);

    useDerivedValue(() => {
        // Only update state if needed to avoid infinite loops, though on Web/Reanimated this is tricky
        // For simplicity in this demo, let's just use a simple state update tied to a listener if possible
        // but Reanimated 3 on web is better with direct derived values. 
        // We'll use a hacky way for display or just show the final value if reactive counting is hard.
    });

    // Since actual live number counting in Text is hard with pure Reanimated on Web without additional libs,
    // we'll use a simpler approach: fade in the number or use a fast-interval state for the effect.
    useEffect(() => {
        let start = 0;
        const end = value;
        const duration = 1500;
        let startTime = null;

        const animate = (currentTime) => {
            if (!startTime) startTime = currentTime;
            const progress = Math.min((currentTime - startTime) / duration, 1);
            const currentCount = progress * end;
            setDisplayValue(currentCount.toFixed(2));
            if (progress < 1) requestAnimationFrame(animate);
        };

        const timeout = setTimeout(() => requestAnimationFrame(animate), delay);
        return () => clearTimeout(timeout);
    }, [value, delay]);

    return <Text style={styles.coinAmount}>{prefix}{displayValue}{suffix}</Text>;
};

export const ReanimatedExchange = () => {
    const [isVisible, setIsVisible] = useState(false);

    // Modal Shared Values
    const modalScale = useSharedValue(0);
    const modalOpacity = useSharedValue(0);
    const modalRotate = useSharedValue(5);

    // Content Shared Values
    const leftX = useSharedValue(-150);
    const rightX = useSharedValue(150);
    const contentOpacity = useSharedValue(0);
    const arrowScale = useSharedValue(0);

    // Effects Shared Values
    const shimmerX = useSharedValue(-200);
    const rightShakeX = useSharedValue(0);
    const glowOpacity = useSharedValue(0);
    const burstScale = useSharedValue(0);
    const burstOpacity = useSharedValue(0);

    const openModal = () => {
        setIsVisible(true);
        // Modal Entrance
        modalScale.value = withSpring(1, { damping: 15 });
        modalOpacity.value = withTiming(1, { duration: 500 });
        modalRotate.value = withSpring(0);

        // Content Sequence
        contentOpacity.value = withDelay(500, withTiming(1, { duration: 600 }));
        leftX.value = withDelay(500, withSpring(0, { damping: 12 }));
        rightX.value = withDelay(500, withSpring(0, { damping: 12 }));

        // Arrow & Burst
        arrowScale.value = withDelay(1000, withSpring(1.2, { damping: 10 }));
        burstScale.value = withDelay(1000, withSequence(withTiming(1.5, { duration: 200 }), withTiming(2, { duration: 300 })));
        burstOpacity.value = withDelay(1000, withSequence(withTiming(1, { duration: 100 }), withTiming(0, { duration: 400 })));

        // Glow
        glowOpacity.value = withDelay(1200, withRepeat(withTiming(0.6, { duration: 2000 }), -1, true));

        // Shimmer
        shimmerX.value = withDelay(1500, withRepeat(
            withSequence(
                withTiming(200, { duration: 1500, easing: Easing.inOut(Easing.quad) }),
                withTiming(-200, { duration: 0 }) // Instant reset to start
            ),
            -1,
            false
        ));

        // Periodic Shake
        rightShakeX.value = withDelay(3000, withRepeat(
            withSequence(
                withTiming(-3, { duration: 60 }),
                withTiming(3, { duration: 60 }),
                withTiming(-3, { duration: 60 }),
                withTiming(3, { duration: 60 }),
                withTiming(0, { duration: 60 }),
                withDelay(4000, withTiming(0, { duration: 0 }))
            ),
            -1,
            false
        ));
    };

    const closeModal = () => {
        modalScale.value = withTiming(0, { duration: 300 });
        modalOpacity.value = withTiming(0, { duration: 300 });
        modalRotate.value = withTiming(-5, { duration: 300 });

        setTimeout(() => {
            setIsVisible(false);
            // Reset
            leftX.value = -150;
            rightX.value = 150;
            contentOpacity.value = 0;
            arrowScale.value = 0;
            shimmerX.value = -200;
            glowOpacity.value = 0;
            burstScale.value = 0;
        }, 300);
    };

    const modalStyle = useAnimatedStyle(() => ({
        transform: [{ scale: modalScale.value }, { rotate: `${modalRotate.value}deg` }],
        opacity: modalOpacity.value,
    }));

    const leftStyle = useAnimatedStyle(() => ({
        opacity: contentOpacity.value,
        transform: [{ translateX: leftX.value }],
    }));

    const rightStyle = useAnimatedStyle(() => ({
        opacity: contentOpacity.value,
        transform: [{ translateX: rightX.value + rightShakeX.value }],
    }));

    const glowStyle = useAnimatedStyle(() => ({
        opacity: glowOpacity.value,
    }));

    const arrowStyle = useAnimatedStyle(() => ({
        transform: [{ scale: arrowScale.value }],
        opacity: arrowScale.value,
    }));

    const shimmerStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: shimmerX.value }, { rotate: '25deg' }],
    }));

    const burstStyle = useAnimatedStyle(() => ({
        transform: [{ scale: burstScale.value }],
        opacity: burstOpacity.value,
    }));

    return (
        <View style={styles.container}>
            {/* Background Orbs */}
            <View style={[styles.bgOrb, { top: '20%', left: '10%', backgroundColor: '#4a90e233' }]} />
            <View style={[styles.bgOrb, { bottom: '20%', right: '10%', backgroundColor: '#e91e6322' }]} />

            {/* Background Particles */}
            {[...Array(15)].map((_, i) => (
                <Particle key={i} style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }} />
            ))}

            {!isVisible ? (
                <Pressable style={styles.openBtn} onPress={openModal}>
                    <Text style={styles.btnText}>Launch Exchange</Text>
                </Pressable>
            ) : (
                <View style={StyleSheet.absoluteFillObject}>
                    <Pressable style={styles.backdrop} onPress={closeModal} />
                    <View style={styles.modalCenter}>
                        <Animated.View style={[styles.modal, modalStyle]}>
                            <View style={styles.glassHeader}>
                                <Text style={styles.modalTitle}>Convert Currency</Text>
                            </View>

                            <View style={styles.exchangeRow}>
                                {/* Left Block */}
                                <Animated.View style={[styles.coinBlock, leftStyle]}>
                                    <Text style={styles.coinEmoji}>🇺🇸</Text>
                                    <Text style={styles.coinText}>USD Account</Text>
                                    <NumberCounter value={100} prefix="$" delay={800} />
                                </Animated.View>

                                {/* Arrow Section */}
                                <View style={styles.centerSection}>
                                    <Animated.View style={[styles.burst, burstStyle]} />
                                    <Animated.View style={[styles.arrowCircle, arrowStyle]}>
                                        <Text style={styles.arrowIcon}>➔</Text>
                                    </Animated.View>
                                </View>

                                {/* Right Block */}
                                <Animated.View style={[styles.coinBlock, styles.rightBlock, rightStyle]}>
                                    <Animated.View style={[styles.rightGlow, glowStyle]} />
                                    <Text style={styles.coinEmoji}>🇪🇺</Text>
                                    <Text style={styles.coinText}>EUR Balance</Text>
                                    <NumberCounter value={92.45} prefix="€" delay={1200} />

                                    {/* Premium Shimmer */}
                                    <Animated.View style={[styles.shimmer, shimmerStyle]} />
                                </Animated.View>
                            </View>

                            <Pressable style={styles.confirmBtn} onPress={closeModal}>
                                <Text style={styles.confirmText}>Authorize Transfer</Text>
                            </Pressable>
                        </Animated.View>
                    </View>
                </View>
            )}
        </View>
    );
};

export const GsapExchange = () => {
    const [isVisible, setIsVisible] = useState(false);
    const modalRef = React.useRef(null);
    const leftRef = React.useRef(null);
    const rightRef = React.useRef(null);
    const arrowRef = React.useRef(null);
    const shimmerRef = React.useRef(null);
    const burstRef = React.useRef(null);
    const glowRef = React.useRef(null);
    const [amount1, setAmount1] = useState(0);
    const [amount2, setAmount2] = useState(0);

    const openModal = () => setIsVisible(true);

    useEffect(() => {
        if (isVisible) {
            const tl = gsap.timeline();

            // Reset counting state
            setAmount1(0); setAmount2(0);

            // Modal Entrance
            tl.fromTo(modalRef.current,
                { scale: 0.8, opacity: 0, rotationY: 45 },
                { scale: 1, opacity: 1, rotationY: 0, duration: 0.8, ease: "elastic.out(1, 0.75)" }
            );

            // Blocks
            tl.fromTo([leftRef.current, rightRef.current],
                { opacity: 0, y: 30, scale: 0.9 },
                { opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.2, ease: "power3.out" },
                "-=0.4"
            );

            // Number Counting (USD)
            tl.to({ val: 0 }, {
                val: 100,
                duration: 1.5,
                delay: 0.2,
                onUpdate: function () { setAmount1(this.targets()[0].val.toFixed(2)); }
            }, "-=0.6");

            // Arrow & Burst
            tl.fromTo(arrowRef.current,
                { scale: 0, rotation: -180 },
                { scale: 1, rotation: 0, duration: 0.6, ease: "back.out(2)" },
                "-=0.8"
            );
            tl.fromTo(burstRef.current,
                { scale: 0, opacity: 0.8 },
                { scale: 2.5, opacity: 0, duration: 0.6, ease: "power2.out" },
                "-=0.6"
            );

            // Number Counting (EUR)
            tl.to({ val: 0 }, {
                val: 92.45,
                duration: 1.5,
                onUpdate: function () { setAmount2(this.targets()[0].val.toFixed(2)); }
            }, "-=0.8");

            // Glow and Shimmer
            tl.to(glowRef.current, { opacity: 0.6, duration: 0.8, repeat: -1, yoyo: true });

            // Separate Shimmer from main timeline for cleaner infinite loop
            gsap.fromTo(shimmerRef.current,
                { x: -150 },
                { x: 150, duration: 1, repeat: -1, ease: "power2.inOut", repeatDelay: 2 }
            );

            // Shake Loop (Using a sub-timeline to group the fast shakes with a long delay between them)
            gsap.timeline({ repeat: -1, repeatDelay: 3 })
                .to(rightRef.current, {
                    x: 4,
                    duration: 0.05,
                    repeat: 7,
                    yoyo: true,
                    delay: 3 // Initial delay before the first shake group
                });
        }
    }, [isVisible]);

    const closeModal = () => {
        gsap.to(modalRef.current, { scale: 0.9, opacity: 0, y: 20, duration: 0.4, onComplete: () => setIsVisible(false) });
    };

    return (
        <div style={gsapStyles.container}>
            {/* BG Decor */}
            <div style={{ ...gsapStyles.bgOrb, top: '15%', right: '5%', background: 'radial-gradient(circle, #00d2ff 0%, transparent 70%)', opacity: 0.2 }} />
            <div style={{ ...gsapStyles.bgOrb, bottom: '10%', left: '10%', background: 'radial-gradient(circle, #9d50bb 0%, transparent 70%)', opacity: 0.2 }} />

            {!isVisible ? (
                <button style={gsapStyles.openBtn} onClick={openModal}>Launch Exchange</button>
            ) : (
                <div style={gsapStyles.overlay}>
                    <div style={gsapStyles.backdrop} onClick={closeModal} />
                    <div ref={modalRef} style={gsapStyles.modal}>
                        <div style={gsapStyles.glassHeader}>
                            <h2 style={gsapStyles.modalTitle}>Convert Currency</h2>
                        </div>

                        <div style={gsapStyles.exchangeRow}>
                            <div ref={leftRef} style={gsapStyles.coinBlock}>
                                <div style={gsapStyles.coinEmoji}>🇺🇸</div>
                                <div style={gsapStyles.coinText}>USD Account</div>
                                <div style={gsapStyles.coinAmount}>${amount1}</div>
                            </div>

                            <div style={gsapStyles.centerSection}>
                                <div ref={burstRef} style={gsapStyles.burst} />
                                <div ref={arrowRef} style={gsapStyles.arrowCircle}>
                                    <span style={gsapStyles.arrowIcon}>➔</span>
                                </div>
                            </div>

                            <div ref={rightRef} style={{ ...gsapStyles.coinBlock, ...gsapStyles.rightBlock }}>
                                <div ref={glowRef} style={gsapStyles.rightGlow} />
                                <div style={gsapStyles.coinEmoji}>🇪🇺</div>
                                <div style={gsapStyles.coinText}>EUR Balance</div>
                                <div style={gsapStyles.coinAmount}>€{amount2}</div>
                                <div ref={shimmerRef} style={gsapStyles.shimmer} />
                            </div>
                        </div>

                        <button style={gsapStyles.confirmBtn} onClick={closeModal}>Authorize Transfer</button>
                    </div>
                </div>
            )}
        </div>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0f172a', overflow: 'hidden' },
    bgOrb: { position: 'absolute', width: 300, height: 300, borderRadius: 150, pointerEvents: 'none' },
    particle: { position: 'absolute', width: 4, height: 4, borderRadius: 2, backgroundColor: 'white', pointerEvents: 'none' },
    openBtn: { paddingVertical: 14, paddingHorizontal: 30, backgroundColor: '#3b82f6', borderRadius: 16, shadowColor: '#3b82f6', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 10, zIndex: 10 },
    btnText: { color: 'white', fontWeight: '800', fontSize: 18, letterSpacing: 0.5 },
    backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' },
    modalCenter: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    modal: { width: 360, backgroundColor: 'rgba(30, 41, 59, 0.8)', borderRadius: 32, padding: 24, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', shadowColor: '#000', shadowOffset: { width: 0, height: 20 }, shadowOpacity: 0.5, shadowRadius: 30, backdropFilter: 'blur(16px)' },
    glassHeader: { marginBottom: 30, alignItems: 'center' },
    modalTitle: { fontSize: 22, fontWeight: '900', color: '#f8fafc', letterSpacing: -0.5 },
    exchangeRow: { flexDirection: 'row', alignItems: 'center', width: '100%', justifyContent: 'space-between', marginBottom: 40 },
    coinBlock: { width: 120, height: 140, padding: 16, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 24, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
    rightBlock: { backgroundColor: 'rgba(59, 130, 246, 0.1)', borderColor: 'rgba(59, 130, 246, 0.3)', overflow: 'hidden' },
    rightGlow: { position: 'absolute', width: 100, height: 100, borderRadius: 50, backgroundColor: '#3b82f633', pointerEvents: 'none' },
    coinEmoji: { fontSize: 36, marginBottom: 10 },
    coinText: { fontSize: 11, color: '#94a3b8', fontWeight: '700', textTransform: 'uppercase' },
    coinAmount: { fontSize: 18, color: '#fff', fontWeight: '800', marginTop: 6 },
    centerSection: { width: 50, height: 50, alignItems: 'center', justifyContent: 'center', position: 'relative' },
    arrowCircle: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#3b82f6', alignItems: 'center', justifyContent: 'center', shadowColor: '#3b82f6', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.8, shadowRadius: 15 },
    arrowIcon: { fontSize: 20, color: 'white' },
    burst: { position: 'absolute', width: 40, height: 40, borderRadius: 20, borderWidth: 2, borderColor: '#3b82f6', pointerEvents: 'none' },
    shimmer: { position: 'absolute', top: -100, bottom: -100, width: 40, backgroundColor: 'rgba(255,255,255,0.15)', transform: [{ rotate: '25deg' }], pointerEvents: 'none' },
    confirmBtn: { width: '100%', padding: 18, backgroundColor: '#fff', borderRadius: 20, alignItems: 'center', shadowColor: '#fff', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 10 },
    confirmText: { color: '#0f172a', fontWeight: '900', fontSize: 16, textTransform: 'uppercase' }
});

const gsapStyles = {
    container: { height: '100%', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0f172a', position: 'relative', overflow: 'hidden' },
    bgOrb: { position: 'absolute', width: '300px', height: '300px', borderRadius: '150px', filter: 'blur(60px)', pointerEvents: 'none' },
    openBtn: { padding: '14px 30px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '16px', fontWeight: '800', cursor: 'pointer', fontSize: '18px', boxShadow: '0 4px 15px rgba(59, 130, 246, 0.4)', position: 'relative', zIndex: 10 },
    overlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 },
    backdrop: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' },
    modal: { position: 'relative', width: '360px', backgroundColor: 'rgba(30, 41, 59, 0.85)', borderRadius: '32px', padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: '0 20px 50px rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(12px)' },
    glassHeader: { marginBottom: '30px' },
    modalTitle: { fontSize: '22px', fontWeight: '900', color: '#f8fafc', margin: 0 },
    exchangeRow: { display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between', marginBottom: '40px' },
    coinBlock: { width: '120px', height: '140px', padding: '16px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.1)', position: 'relative' },
    rightBlock: { backgroundColor: 'rgba(59, 130, 246, 0.1)', borderColor: 'rgba(59, 130, 246, 0.3)', overflow: 'hidden' },
    rightGlow: { position: 'absolute', width: '100px', height: '100px', backgroundColor: 'rgba(59, 130, 246, 0.2)', borderRadius: '50%', filter: 'blur(20px)', pointerEvents: 'none' },
    coinEmoji: { fontSize: '36px', marginBottom: '10px' },
    coinText: { fontSize: '11px', color: '#94a3b8', fontWeight: '700', textTransform: 'uppercase' },
    coinAmount: { fontSize: '18px', color: '#fff', fontWeight: '800', marginTop: '6px', fontFamily: 'monospace' },
    centerSection: { width: '50px', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' },
    arrowCircle: { width: '44px', height: '44px', borderRadius: '22px', backgroundColor: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px rgba(59, 130, 246, 0.6)' },
    arrowIcon: { fontSize: '20px', color: 'white' },
    burst: { position: 'absolute', width: '40px', height: '40px', borderRadius: '50%', border: '2px solid #3b82f6', pointerEvents: 'none' },
    shimmer: { position: 'absolute', top: '-100px', bottom: '-100px', width: '40px', backgroundColor: 'rgba(255,255,255,0.15)', transform: 'rotate(25deg)', pointerEvents: 'none' },
    confirmBtn: { width: '100%', padding: '18px', backgroundColor: '#fff', color: '#0f172a', border: 'none', borderRadius: '20px', fontWeight: '900', fontSize: '16px', cursor: 'pointer', textTransform: 'uppercase', boxShadow: '0 4px 15px rgba(255,255,255,0.2)' }
};
