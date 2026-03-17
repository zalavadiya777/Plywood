import React, { useState, useEffect, useRef } from 'react';
import './LandingPage.css';

const LandingPage = ({ theme, toggleTheme, onNavigate }) => {
    const [rotation, setRotation] = useState({ x: 0, y: 0 });
    const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
    const [activeTouch, setActiveTouch] = useState(null);

    useEffect(() => {
        const updateTracking = (clientX, clientY) => {
            const x = (clientY / window.innerHeight - 0.5) * 30;
            const y = (clientX / window.innerWidth) * 50;
            setRotation({ x, y });
            
            // Background tracking (Spotlight & Parallax)
            const bgX = (clientX / window.innerWidth) * 100;
            const bgY = (clientY / window.innerHeight) * 100;
            setMousePos({ x: bgX, y: bgY });
        };

        const handleMouseMove = (e) => updateTracking(e.clientX, e.clientY);
        const handleTouchMove = (e) => {
            if (e.touches.length > 0) {
                updateTracking(e.touches[0].clientX, e.touches[0].clientY);
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('touchmove', handleTouchMove, { passive: true });
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('touchmove', handleTouchMove);
        };
    }, []);

    const handleTouchStart = (name) => {
        setActiveTouch(name);
    };

    const handleTouchEnd = (name, e) => {
        // If it was a quick tap, trigger enter
        // If it's just clearing the hover, we do that anyway
        setActiveTouch(null);
    };

    return (
        <div 
            className="landing-wrapper"
            style={{
                '--mouse-x': `${mousePos.x}%`,
                '--mouse-y': `${mousePos.y}%`,
                '--move-x': `${(mousePos.x - 50) * 0.2}px`,
                '--move-y': `${(mousePos.y - 50) * 0.2}px`
            }}
        >
            <div className="bg-interactive-plus">
                <div className="plus-base"></div>
                <div className="plus-highlight"></div>
                <div className="plus-lines"></div>
            </div>
            <div className="landing-content">
                <div className="title-section">
                    <h1>PLYWOOD <span className="highlight">PROJECT</span></h1>
                    <p>Immersive Digital Experiences</p>
                </div>

                <div className="boxes-wrapper">
                    {['x', 'xx', 'xxx', 'xxxx'].map((name, index) => (
                        <div 
                            key={index}
                            className={`box-container glass-card ${activeTouch === name ? 'is-touch-hover' : ''}`}
                            onClick={() => onNavigate(`/collection/${name}`)}
                            onTouchStart={() => handleTouchStart(name)}
                            onTouchEnd={(e) => handleTouchEnd(name, e)}
                            onTouchCancel={() => setActiveTouch(null)}
                            style={{
                                transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`
                            }}
                        >
                            <div className="card-face front">
                                <div className="card-glass"></div>
                                <div className="folder-icon">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                        <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" />
                                    </svg>
                                </div>
                                <span className="box-label">{name}</span>
                                <div className="card-glow"></div>
                            </div>
                            
                            <div className="document-drawer">
                                <div className="document doc-1"></div>
                                <div className="document doc-2"></div>
                                <div className="document doc-3"></div>
                                <div className="document doc-4"></div>
                                <div className="document doc-5"></div>
                            </div>

                            <div className="card-shadow"></div>
                        </div>
                    ))}
                </div>

                <button className="enter-btn" onClick={() => onNavigate('/collection/general')}>
                    <span>ENTER EXPERIENCE</span>
                    <div className="btn-glow"></div>
                </button>
            </div>
            
            <div className={`theme-toggle-switch ${theme}`} onClick={toggleTheme}>
                <div className="toggle-track">
                    <div className="toggle-knob">
                        {theme === 'dark' ? (
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="moon-icon">
                                <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
                            </svg>
                        ) : (
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="sun-icon">
                                <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
                            </svg>
                        )}
                    </div>
                </div>
            </div>
            <div className="bg-grid"></div>
        </div>
    );
};

export default LandingPage;
