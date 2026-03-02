import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import 'react-native-reanimated'; // Needed for setup

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
