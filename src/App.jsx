import React, { useState, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useParams, useLocation } from 'react-router-dom';
import DragParallaxSlider from './components/Slider/DragParallaxSlider';
import LandingPage from './components/Landing/LandingPage';
import PageTransition from './components/Transition/PageTransition';
import './App.css';

// Navigation wrapper to coordinate PageTransition
const NavProvider = ({ children, transitionRef }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigate = (to, callback) => {
    if (location.pathname === to) return;
    
    if (transitionRef.current) {
      transitionRef.current.play(() => {
        navigate(to);
        if (callback) callback();
      });
    } else {
      navigate(to);
      if (callback) callback();
    }
  };

  return React.cloneElement(children, { onNavigate: handleNavigate });
};

// Wrapper for the slider to provide category from URL
const SliderWrapper = ({ theme, toggleTheme, onNavigate }) => {
  const { category } = useParams();
  return (
    <main className="gallery-content">
      <DragParallaxSlider 
        theme={theme}
        toggleTheme={toggleTheme}
        category={category || 'general'} 
        onBack={() => onNavigate('/')} 
      />
    </main>
  );
};

function App() {
  const [theme, setTheme] = useState('dark');
  const transitionRef = useRef(null);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
    <Router>
      <div className={`app-container ${theme}-theme`}>
        <PageTransition ref={transitionRef} />
        <Routes>
          <Route path="/" element={
            <NavProvider transitionRef={transitionRef}>
              <LandingPage 
                theme={theme}
                toggleTheme={toggleTheme}
                onEnter={(cat) => { /* handled via onNavigate prop passed by NavProvider */ }}
              />
            </NavProvider>
          } />
          <Route path="/collection/:category" element={
            <NavProvider transitionRef={transitionRef}>
              <SliderWrapper theme={theme} toggleTheme={toggleTheme} />
            </NavProvider>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
