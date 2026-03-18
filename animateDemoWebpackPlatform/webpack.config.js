const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  entry: ['./src/env.js', './src/main.jsx'],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/',
  },
  resolve: {
    alias: {
      'react-native$': 'react-native-web',
      'events': path.resolve(__dirname, 'src/shims/events.js'),
    },
    extensions: ['.web.js', '.web.jsx', '.web.ts', '.web.tsx', '.js', '.jsx', '.json'],
  },
  module: {
    rules: [
      {
        oneOf: [
          // 1. Raw source loading (matched first)
          {
            test: /\.jsx?$/,
            resourceQuery: /original/,
            use: 'raw-loader',
          },
          // 2. Standard JS/JSX compilation (including problematic node_modules)
          {
            test: /\.(js|jsx)$/,
            exclude: /node_modules\/(?!react-native-reanimated|react-native-web|culori)/,
            use: {
              loader: 'babel-loader',
              options: {
                presets: [
                  ['@babel/preset-env', { targets: { chrome: '58' } }],
                  ['@babel/preset-react', { runtime: 'automatic' }]
                ],
                plugins: [
                  'react-native-reanimated/plugin'
                ]
              }
            },
          },
          // 3. CSS
          {
            test: /\.css$/,
            use: [
              'style-loader',
              {
                loader: 'css-loader',
                options: {
                  modules: {
                    localIdentName: '[name]__[local]--[hash:base64:5]',
                  },
                },
              },
            ],
          },
          // 4. Assets
          {
            test: /\.(png|svg|jpg|jpeg|gif)$/i,
            use: [
              {
                loader: 'file-loader',
                options: {
                  name: '[path][name].[ext]',
                },
              },
            ],
          },
        ]
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
    }),
  ],
  devServer: {
    historyApiFallback: true,
    port: 3000,
    hot: true,
  },
};
