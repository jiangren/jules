import React, { useState, useRef } from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming
} from 'react-native-reanimated';
import { View, Text, Pressable, StyleSheet } from 'react-native-web';
import { gsap } from 'gsap';

// Reanimated Implementation
export const ReanimatedModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.8);

  const toggleModal = () => {
    if (!isOpen) {
      setIsOpen(true);
      opacity.value = withTiming(1, { duration: 200 });
      scale.value = withSpring(1, { damping: 15 });
    } else {
      opacity.value = withTiming(0, { duration: 200 }, () => {
        // In a real app, you'd unmount here, but we'll use state
      });
      scale.value = withTiming(0.8, { duration: 200 });
      setTimeout(() => setIsOpen(false), 200);
    }
  };

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const modalStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <View style={styles.container}>
      <Pressable onPress={toggleModal} style={styles.button}>
        <Text style={styles.buttonText}>Open Modal</Text>
      </Pressable>

      {isOpen && (
        <View style={[StyleSheet.absoluteFill, styles.overlayWrapper]}>
          <Animated.View style={[styles.backdrop, backdropStyle]}>
            <Pressable style={StyleSheet.absoluteFill} onPress={toggleModal} />
          </Animated.View>
          <Animated.View style={[styles.modal, modalStyle]}>
            <Text style={styles.modalTitle}>🎉 Surprise!</Text>
            <Text style={styles.modalText}>Here is some important content inside the modal.</Text>
            <Pressable onPress={toggleModal} style={[styles.button, styles.closeButton]}>
              <Text style={styles.buttonText}>Close</Text>
            </Pressable>
          </Animated.View>
        </View>
      )}
    </View>
  );
};

// GSAP Implementation
export const GsapModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const modalRef = useRef(null);
  const backdropRef = useRef(null);

  const openModal = () => {
    setIsOpen(true);
    // Use requestAnimationFrame to ensure DOM is ready
    requestAnimationFrame(() => {
      gsap.fromTo(backdropRef.current, { opacity: 0 }, { opacity: 1, duration: 0.2 });
      gsap.fromTo(modalRef.current,
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.4, ease: 'back.out(1.7)' }
      );
    });
  };

  const closeModal = () => {
    gsap.to(backdropRef.current, { opacity: 0, duration: 0.2 });
    gsap.to(modalRef.current, {
      scale: 0.8,
      opacity: 0,
      duration: 0.2,
      onComplete: () => setIsOpen(false)
    });
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
      <button
        onClick={openModal}
        style={{
          backgroundColor: '#6c5ce7',
          color: 'white',
          padding: '10px 20px',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '16px',
          fontWeight: '600'
        }}
      >
        Open Modal
      </button>

      {isOpen && (
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
          <div
            ref={backdropRef}
            onClick={closeModal}
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)' }}
          />
          <div
            ref={modalRef}
            style={{
              backgroundColor: 'white',
              padding: '30px',
              borderRadius: '16px',
              zIndex: 20,
              width: '80%',
              maxWidth: '300px',
              textAlign: 'center',
              boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
            }}
          >
            <h2 style={{ margin: '0 0 10px 0', color: '#2d3436' }}>🎉 Surprise!</h2>
            <p style={{ color: '#636e72', marginBottom: '20px' }}>Here is some important content inside the modal.</p>
            <button
              onClick={closeModal}
              style={{
                backgroundColor: '#e17055',
                color: 'white',
                padding: '8px 16px',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: '#6c5ce7',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  closeButton: {
    backgroundColor: '#e17055',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  overlayWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modal: {
    backgroundColor: 'white',
    padding: 30,
    borderRadius: 16,
    width: '80%',
    maxWidth: 300,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#2d3436',
  },
  modalText: {
    color: '#636e72',
    textAlign: 'center',
    marginBottom: 20,
  },
});
