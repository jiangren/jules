import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ShakeGame from './pages/ShakeGame';
import RollBallGame from './pages/RollBallGame';
import CatchGame from './pages/CatchGame';
import OrientationGame from './pages/OrientationGame';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shake" element={<ShakeGame />} />
        <Route path="/rollball" element={<RollBallGame />} />
        <Route path="/catch" element={<CatchGame />} />
        <Route path="/orientation" element={<OrientationGame />} />
      </Routes>
    </Router>
  );
};

export default App;
