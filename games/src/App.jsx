import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ShakeGame from './pages/ShakeGame';
import OrientationGame from './pages/OrientationGame';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shake" element={<ShakeGame />} />
        <Route path="/orientation" element={<OrientationGame />} />
      </Routes>
    </Router>
  );
};

export default App;