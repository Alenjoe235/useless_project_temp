import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Translate from './components/Translate';
import History from './components/History';
import DogDiary from './components/DogDiary';
import './App.css';
// In your main App.js or index.js
import { library } from '@fortawesome/fontawesome-svg-core';
import { 
  faMicrophone, 
  faUpload, 
  faWaveSquare, 
  faBrain, 
  faLanguage, 
  faChartLine, 
  faClock, 
  faVolumeUp,
  faGrinBeam,
  faExclamation,
  faUtensils,
  faBell,
  faFootballBall,
  faQuestion
} from '@fortawesome/free-solid-svg-icons';

library.add(
  faMicrophone, 
  faUpload, 
  faWaveSquare, 
  faBrain, 
  faLanguage, 
  faChartLine, 
  faClock, 
  faVolumeUp,
  faGrinBeam,
  faExclamation,
  faUtensils,
  faBell,
  faFootballBall,
  faQuestion
);
function App() {
  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/translate" element={<Translate />} />
        <Route path="/history" element={<History />} />
        <Route path="/diary" element={<DogDiary />} />
      </Routes>
    </div>
  );
}

export default App;