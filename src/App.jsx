import React, { useState } from 'react';
import DragParallaxSlider from './components/Slider/DragParallaxSlider';
import LandingPage from './components/Landing/LandingPage';
import './App.css';

function App() {
  const [showSlider, setShowSlider] = useState(false);
  const [category, setCategory] = useState('');

  return (
    <div className="app-container">
      {!showSlider ? (
        <LandingPage onEnter={(cat) => { setShowSlider(true); setCategory(cat); }} />
      ) : (
        <main className="gallery-content">
          <DragParallaxSlider category={category} onBack={() => setShowSlider(false)} />
        </main>
      )}
    </div>
  );
}

export default App;
