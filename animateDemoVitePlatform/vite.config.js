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
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
    'require': '(() => undefined)', // Mock require for some poorly behaved packages on web
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
});
