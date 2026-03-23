import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ShakeGame from './pages/ShakeGame';
import GravityGame from './pages/GravityGame';
import RollBallGame from './pages/RollBallGame';
import CatchGame from './pages/CatchGame';
import OrientationGame from './pages/OrientationGame';
import CompassGame from './pages/CompassGame';
import GeoCacheGame from './pages/GeoCacheGame';
import VoiceWindmillGame from './pages/VoiceWindmillGame';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shake" element={<ShakeGame />} />
        <Route path="/gravity" element={<GravityGame />} />
        <Route path="/rollball" element={<RollBallGame />} />
        <Route path="/catch" element={<CatchGame />} />
        <Route path="/orientation" element={<OrientationGame />} />
        <Route path="/compass" element={<CompassGame />} />
        <Route path="/geocache" element={<GeoCacheGame />} />
        <Route path="/windmill" element={<VoiceWindmillGame />} />
      </Routes>
    </Router>
  );
};

export default App;
