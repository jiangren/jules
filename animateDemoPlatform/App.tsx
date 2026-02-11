import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, View, Pressable, ScrollView, Platform } from 'react-native';
import { UniversalAnimator, AnimationEngine } from './src/components/UniversalAnimator';
import { DemoAnimations } from './src/demos/animations';
import { AnimationSchema } from './src/types/AnimationSchema';

type DemoKey = keyof typeof DemoAnimations;

export default function App() {
  const [selectedDemo, setSelectedDemo] = useState<DemoKey>('Marketing Modal');
  const [remountKey, setRemountKey] = useState(0);

  const restart = () => setRemountKey(prev => prev + 1);

  const handleSelect = (key: string) => {
    setSelectedDemo(key as DemoKey);
    restart();
  };

  const currentSchema: AnimationSchema = DemoAnimations[selectedDemo];

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />

      <View style={styles.header}>
        <Text style={styles.title}>Universal Animation Platform</Text>
        <Text style={styles.subtitle}>Reanimated v3 vs GSAP</Text>
      </View>

      <View style={styles.tabsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsContent}>
          {Object.keys(DemoAnimations).map((key) => (
            <Pressable
              key={key}
              style={[styles.tab, selectedDemo === key && styles.activeTab]}
              onPress={() => handleSelect(key)}
            >
              <Text style={[styles.tabText, selectedDemo === key && styles.activeTabText]}>{key}</Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <View style={styles.actionContainer}>
         <Pressable onPress={restart} style={styles.restartButton}>
            <Text style={styles.restartButtonText}>Restart Animation</Text>
          </Pressable>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.demoSection}>
          <View style={styles.demoWrapper}>
            <Text style={styles.engineLabel}>Reanimated</Text>
            <View style={styles.canvas}>
              <UniversalAnimator
                key={`reanimated-${selectedDemo}-${remountKey}`}
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
                key={`gsap-${selectedDemo}-${remountKey}`}
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
    paddingTop: 60,
  },
  header: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  tabsContainer: {
    height: 50,
    marginBottom: 10,
  },
  tabsContent: {
    paddingHorizontal: 15,
    alignItems: 'center',
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#E1E4E8',
    borderRadius: 20,
    marginRight: 10,
  },
  activeTab: {
    backgroundColor: '#007AFF',
  },
  tabText: {
    color: '#586069',
    fontWeight: '600',
    fontSize: 14,
  },
  activeTabText: {
    color: '#fff',
  },
  actionContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  restartButton: {
    backgroundColor: '#24292E',
    paddingVertical: 12,
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
  demoSection: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  demoWrapper: {
    alignItems: 'center',
    width: '45%',
  },
  engineLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#444',
  },
  canvas: {
    width: 140,
    height: 140,
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
  },
  box: {
    width: 50,
    height: 50,
    backgroundColor: '#007AFF',
    borderRadius: 8,
  },
  codeSection: {
    marginHorizontal: 20,
    marginBottom: 40,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
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
  },
  code: {
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontSize: 12,
    color: '#24292E',
  },
});
