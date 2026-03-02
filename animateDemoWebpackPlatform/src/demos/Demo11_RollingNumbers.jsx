import React, { useEffect } from 'react';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    withDelay,
    Easing,
} from 'react-native-reanimated';
import { View, Text, StyleSheet } from 'react-native-web';
import { gsap } from 'gsap';

const DIGIT_HEIGHT = 60;
const NUMBERS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

// Reanimated Implementation
const RollingDigit = ({ targetDigit, index }) => {
    const translateY = useSharedValue(0);

    useEffect(() => {
        const animation = withTiming(-targetDigit * DIGIT_HEIGHT, {
            duration: 2500,
            // Custom easing for fast start and springy/back finish
            easing: Easing.out(Easing.back(1.5)),
        });

        // Add staggering delay from right-to-left or left-to-right (right-to-left feels more like an odometer usually, but standard stagger is left-to-right)
        // Let's do left-to-right for simplicity, typical of Slot Machines
        translateY.value = withDelay(index * 150, animation);
    }, [targetDigit, index]);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateY: translateY.value }],
        };
    });

    return (
        <View style={styles.digitContainer}>
            <Animated.View style={[styles.digitColumn, animatedStyle]}>
                {NUMBERS.map((num) => (
                    <View key={num} style={styles.digitBox}>
                        <Text style={styles.digitText}>{num}</Text>
                    </View>
                ))}
            </Animated.View>
        </View>
    );
};

export const ReanimatedRollingCounter = () => {
    const target = "678";
    const digits = target.split('');

    return (
        <View style={styles.container}>
            <View style={styles.counterRow}>
                {digits.map((d, i) => (
                    <RollingDigit key={i} targetDigit={parseInt(d, 10)} index={i} />
                ))}
            </View>
        </View>
    );
};

// GSAP Implementation
export const GsapRollingCounter = () => {
    const target = "678";
    const digits = target.split('');
    const columnRefs = React.useRef([]);

    useEffect(() => {
        digits.forEach((d, i) => {
            if (columnRefs.current[i]) {
                gsap.to(columnRefs.current[i], {
                    y: -parseInt(d, 10) * DIGIT_HEIGHT,
                    duration: 2.5,
                    delay: i * 0.15,
                    ease: "back.out(1.5)",
                });
            }
        });
    }, []);

    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <div style={{ display: 'flex', flexDirection: 'row' }}>
                {digits.map((d, i) => (
                    <div
                        key={i}
                        style={{
                            width: '40px',
                            height: `${DIGIT_HEIGHT}px`,
                            overflow: 'hidden',
                            backgroundColor: '#f1f2f6',
                            margin: '0 2px',
                            borderRadius: '4px',
                            boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)'
                        }}
                    >
                        <div
                            ref={el => columnRefs.current[i] = el}
                            style={{ display: 'flex', flexDirection: 'column' }}
                        >
                            {NUMBERS.map(num => (
                                <div
                                    key={num}
                                    style={{
                                        height: `${DIGIT_HEIGHT}px`,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '36px',
                                        fontWeight: 'bold',
                                        color: '#2d3436'
                                    }}
                                >
                                    {num}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
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
    counterRow: {
        flexDirection: 'row',
    },
    digitContainer: {
        width: 40,
        height: DIGIT_HEIGHT,
        overflow: 'hidden',
        backgroundColor: '#f1f2f6',
        marginHorizontal: 2,
        borderRadius: 4,
        // Web shadow
        boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)',
    },
    digitColumn: {
        flexDirection: 'column',
    },
    digitBox: {
        height: DIGIT_HEIGHT,
        alignItems: 'center',
        justifyContent: 'center',
    },
    digitText: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#2d3436',
    },
});
