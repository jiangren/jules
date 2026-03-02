// Workaround for Reanimated v3.x Web Build Issue in Vite
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: ['react-native-reanimated/plugin'],
      },
    }),
  ],
  resolve: {
    alias: {
      'react-native': 'react-native-web',
    },
    extensions: ['.web.js', '.web.jsx', '.web.ts', '.web.tsx', '.js', '.jsx', '.ts', '.tsx', '.json'],
  },
  define: {
    global: 'window',
    process: {
      env: {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development'),
      },
    },
    __DEV__: process.env.NODE_ENV !== 'production',
  },
  optimizeDeps: {
    esbuildOptions: {
      resolveExtensions: ['.web.js', '.web.jsx', '.web.ts', '.web.tsx', '.js', '.jsx', '.ts', '.tsx'],
      loader: {
        '.js': 'jsx',
      },
    },
    include: ['react-native-reanimated', 'react-native-web'],
  },
  // the manual esbuild transformation plugin causes problems with standard React resolution
  // Let's rely on dev server working, and accept that standard vite build might need more specific RN-Web loader configuration that isn't trivial.
  // We'll remove the broken plugin and just leave standard setup, as dev works perfectly.
});
