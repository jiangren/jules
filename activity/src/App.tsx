import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Bargain from './pages/Bargain';
import CardCollection from './pages/CardCollection';
import LuckyWheel from './pages/LuckyWheel';
import ScratchCard from './pages/ScratchCard';
import GiftRain from './pages/GiftRain';
import CheckIn from './pages/CheckIn';
import BlindBox from './pages/BlindBox';
import Quiz from './pages/Quiz';
import Shake from './pages/Shake';
import Merge from './pages/Merge';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/bargain" element={<Bargain />} />
        <Route path="/card-collection" element={<CardCollection />} />
        <Route path="/lucky-wheel" element={<LuckyWheel />} />
        <Route path="/scratch-card" element={<ScratchCard />} />
        <Route path="/gift-rain" element={<GiftRain />} />
        <Route path="/check-in" element={<CheckIn />} />
        <Route path="/blind-box" element={<BlindBox />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/shake" element={<Shake />} />
        <Route path="/merge" element={<Merge />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
