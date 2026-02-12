'use client';

import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Platform } from 'react-native';
import { useParams, useRouter } from 'next/navigation';
import { UniversalAnimator } from '../../../src/components/UniversalAnimator';
import { DemoAnimations } from '../../../src/demos/animations';
import { AnimationSchema } from '../../../src/types/AnimationSchema';

export default function DemoPage() {
  const params = useParams();
  const router = useRouter();
  const [remountKey, setRemountKey] = useState(0);

  const slug = typeof params.slug === 'string' ? params.slug : params.slug?.[0];

  // Find the key from slug
  const demoKey = Object.keys(DemoAnimations).find(
    k => k.toLowerCase().replace(/\s+/g, '-') === slug
  );

  const currentSchema: AnimationSchema | undefined = demoKey ? DemoAnimations[demoKey as keyof typeof DemoAnimations] : undefined;

  const restart = () => setRemountKey(prev => prev + 1);

  if (!currentSchema) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={styles.notFoundText}>Demo not found: {slug}</Text>
        <Pressable onPress={() => router.push('/')} style={styles.backButton}>
          <Text style={styles.backButtonText}>Go Home</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.push('/')} style={styles.backLink}>
          <Text style={styles.backLinkText}>← Back to List</Text>
        </Pressable>
        <Text style={styles.title}>{demoKey}</Text>
      </View>

      <View style={styles.actionContainer}>
         <Pressable onPress={restart} style={styles.restartButton}>
            <Text style={styles.restartButtonText}>Restart Animation</Text>
          </Pressable>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        <View style={styles.demoSection}>
          <View style={styles.demoWrapper}>
            <Text style={styles.engineLabel}>Reanimated</Text>
            <View style={styles.canvas}>
              <UniversalAnimator
                key={`reanimated-${slug}-${remountKey}`}
                engine="reanimated"
                schema={currentSchema}
              >
                <View style={styles.box} />
              </UniversalAnimator>
            </View>
          </View>

          <View style={styles.demoWrapper}>
            <Text style={styles.engineLabel}>GSAP</Text>
            <View style={styles.canvas}>
              <UniversalAnimator
                key={`gsap-${slug}-${remountKey}`}
                engine="gsap"
                schema={currentSchema}
              >
                <View style={[styles.box, { backgroundColor: '#FF5252' }]} />
              </UniversalAnimator>
            </View>
          </View>
        </View>

        <View style={styles.codeSection}>
          <Text style={styles.codeTitle}>JSON Schema</Text>
          <View style={styles.codeBlock}>
            <Text style={styles.code}>
              {JSON.stringify(currentSchema, null, 2)}
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
    paddingTop: 20,
    minHeight: '100vh' as any,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  notFoundText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
  },
  header: {
    paddingHorizontal: 20,
    marginBottom: 20,
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  backLink: {
    marginBottom: 10,
    padding: 5,
  },
  backLinkText: {
    color: '#007AFF',
    fontSize: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1A1A1A',
  },
  actionContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  restartButton: {
    backgroundColor: '#24292E',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  restartButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  demoSection: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingHorizontal: 10,
    marginBottom: 40,
    flexWrap: 'wrap',
    gap: 20,
  },
  demoWrapper: {
    alignItems: 'center',
    width: 160,
  },
  engineLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#444',
  },
  canvas: {
    width: 160,
    height: 160,
    backgroundColor: '#fff',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#eee',
  },
  box: {
    width: 50,
    height: 50,
    backgroundColor: '#007AFF',
    borderRadius: 8,
  },
  codeSection: {
    marginHorizontal: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
    maxWidth: 800,
    alignSelf: 'center',
    width: '90%',
  },
  codeTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
    color: '#24292E',
  },
  codeBlock: {
    backgroundColor: '#F6F8FA',
    padding: 15,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E1E4E8',
    overflow: 'scroll', // Allow horizontal scroll for code
  },
  code: {
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontSize: 12,
    color: '#24292E',
  },
  backButton: {
    padding: 10,
    backgroundColor: '#007AFF',
    borderRadius: 5,
  },
  backButtonText: {
    color: '#fff',
  },
});
