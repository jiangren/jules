'use client';

import React from 'react';
import Link from 'next/link';
import { View, Text, StyleSheet } from 'react-native';
import { DemoAnimations } from '../src/demos/animations';

export default function HomePage() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Universal Animation Platform</Text>
        <Text style={styles.subtitle}>Select a demo to view animations</Text>
      </View>

      <View style={styles.list}>
        {Object.keys(DemoAnimations).map((key) => {
          // Slugify key
          const slug = key.toLowerCase().replace(/\s+/g, '-');
          return (
            <Link key={key} href={`/demo/${slug}`} style={{ textDecoration: 'none', width: '100%' }}>
              <View style={styles.card}>
                <Text style={styles.cardText}>{key}</Text>
              </View>
            </Link>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F7FA',
    alignItems: 'center',
    minHeight: '100vh' as any,
  },
  header: {
    marginTop: 40,
    marginBottom: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1A1A1A',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  list: {
    width: '100%',
    maxWidth: 600,
    display: 'flex',
    flexDirection: 'column',
    gap: 15,
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    // elevation is not supported in CSS directly via RNW in same way, but it maps roughly.
    borderWidth: 1,
    borderColor: '#E1E4E8',
    alignItems: 'center',
  },
  cardText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#007AFF',
  },
});
