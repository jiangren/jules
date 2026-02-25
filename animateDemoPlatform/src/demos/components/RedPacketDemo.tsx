'use client';

import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Platform } from 'react-native';
import { UniversalAnimator } from '../../components/UniversalAnimator';
import { AnimationSchema } from '../../types/AnimationSchema';

type RedPacketDemoProps = {
  engine: 'reanimated' | 'gsap';
};

const LidOpenSchema: AnimationSchema = {
  initial: { rotateX: '0deg' },
  steps: [
    { to: { rotateX: '180deg' }, duration: 600, easing: 'ease-in-out' }
  ],
  loop: false
};

const CoinPopSchema: AnimationSchema = {
  initial: { y: 0, opacity: 0, scale: 0.5 },
  steps: [
    { to: { y: -120, opacity: 1, scale: 1 }, duration: 800, delay: 300, easing: 'spring' }
  ],
  loop: false
};

const LidClosedSchema: AnimationSchema = {
  initial: { rotateX: '0deg' },
  steps: [],
  loop: false
};

const CoinHiddenSchema: AnimationSchema = {
  initial: { y: 0, opacity: 0, scale: 0.5 },
  steps: [],
  loop: false
};

export const RedPacketDemo: React.FC<RedPacketDemoProps> = ({ engine }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [key, setKey] = useState(0);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
    setKey(k => k + 1); // Force remount to replay animation or reset
  };

  const lidSchema = isOpen ? LidOpenSchema : LidClosedSchema;
  const coinSchema = isOpen ? CoinPopSchema : CoinHiddenSchema;

  return (
    <View style={styles.container}>
      <View style={styles.envelopeContainer}>
        {/* Coin (Behind Lid, inside envelope) */}
        <View style={styles.coinWrapper}>
           <UniversalAnimator
              key={`coin-${key}`}
              engine={engine}
              schema={coinSchema}
              style={styles.coinAnimator}
            >
              <View style={styles.coin}>
                <Text style={styles.coinText}>¥</Text>
              </View>
            </UniversalAnimator>
        </View>

        {/* Envelope Body (Front, bottom part) */}
        <View style={[styles.envelopeBody, { backgroundColor: '#d32f2f' }]}>
           <View style={styles.envelopeFront} />
        </View>

        {/* Envelope Lid (Top flap) */}
        <View style={styles.lidWrapper}>
          <UniversalAnimator
            key={`lid-${key}`}
            engine={engine}
            schema={lidSchema}
            style={styles.lidAnimator}
          >
            <View style={styles.lid} />
          </UniversalAnimator>
        </View>
      </View>

      <Pressable onPress={toggleOpen} style={styles.button}>
        <Text style={styles.buttonText}>{isOpen ? 'Reset' : 'Open'}</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  envelopeContainer: {
    width: 200,
    height: 140,
    position: 'relative',
    marginBottom: 40,
    // perspective: 1000, // Important for 3D rotation
  } as any, // Cast for web-specific style 'perspective'
  envelopeBody: {
    position: 'absolute',
    top: 40, // Explicit top instead of bottom
    left: 0,
    width: 200,
    height: 100,
    backgroundColor: 'red',
    borderWidth: 1,
    borderColor: 'darkred',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    overflow: 'hidden',
    zIndex: 10,
  },
  envelopeFront: {
     // A slightly lighter red overlay or shape to give depth?
     width: '100%',
     height: '100%',
     backgroundColor: '#c62828',
  },
  lidWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 200,
    height: 100, // Enough height for the flap
    zIndex: 20, // Above body initially
    // We need to pivot from top.
    // In RN/UniversalAnimator, we rotate the container.
    // If we rotateX, it pivots around center by default.
    // We can use transformOrigin in style if supported, or translateY trick.
    // Let's rely on standard center pivot but position it so the pivot is the hinge.
    // Center of this wrapper is at (100, 50).
    // If we want hinge at (100, 40) (top of body), we need to align them.
    // Let's adjust styles:
    // Hinge is at y=40 relative to container (140 height total: 40 top space + 100 body).
    // Actually, let's say envelope body starts at y=40.
    // Lid hinge is at y=40.
  },
  lidAnimator: {
    width: 200,
    height: 100,
    // transformOrigin: 'top center' is standard web, might work in RNW.
    // For native, need anchor point support or offset trick.
    // Reanimated 2/3 supports transformOrigin in style for web.
    transformOrigin: '50% 0%',
    top: 40, // Hinge position
  } as any,
  lid: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 100,
    borderRightWidth: 100,
    borderTopWidth: 70, // Height of the triangle
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: 'orange', // Lighter red for lid (using named color to be safe)
    // The borderTop creates a triangle pointing DOWN.
    // This looks like a closed flap.
  },
  coinWrapper: {
    position: 'absolute',
    top: 40,
    left: 0,
    width: 200,
    height: 100,
    zIndex: 5, // Between back and body
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible',
  },
  coinAnimator: {
    // Animator container
  },
  coin: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFD700',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFA000',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  coinText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#E65100',
  },
  button: {
    backgroundColor: '#333',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
