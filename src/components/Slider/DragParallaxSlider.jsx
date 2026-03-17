import React, { useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { Draggable } from 'gsap/Draggable';
import birch from '../../assets/textures/birch.png';
import walnut from '../../assets/textures/walnut.png';
import oak from '../../assets/textures/oak.png';
import marine from '../../assets/textures/marine.png';
import maple from '../../assets/textures/maple.png';
import cherry from '../../assets/textures/cherry.png';
import zebra from '../../assets/textures/zebra.png';
import pine from '../../assets/textures/pine.png';
import rosewood from '../../assets/textures/rosewood.png';
import teak from '../../assets/textures/teak.png';
import bamboo from '../../assets/textures/bamboo.png';
import mahogany from '../../assets/textures/mahogany.png';
import './Slider.css';

gsap.registerPlugin(Draggable);

const cardsData = [
    { id: 1, title: 'Nordic Birch', img: birch },
    { id: 2, title: 'American Walnut', img: walnut },
    { id: 3, title: 'Natural Oak', img: oak },
    { id: 4, title: 'Marine Plywood', img: marine },
    { id: 5, title: 'Arctic Maple', img: maple },
    { id: 6, title: 'Cherry Wood', img: cherry },
    { id: 7, title: 'Zebrawood Ply', img: zebra },
    { id: 8, title: 'Knotty Pine', img: pine },
    { id: 9, title: 'Premium Rosewood', img: rosewood },
    { id: 10, title: 'Teak Wood', img: teak },
    { id: 11, title: 'Pressed Bamboo', img: bamboo },
    { id: 12, title: 'Polished Mahogany', img: mahogany },
];

const DragParallaxSlider = ({ category, onBack, theme, toggleTheme }) => {
    const containerRef = useRef(null);
    const trackRef = useRef(null);
    const progressFillRef = useRef(null);
    const [expandedCard, setExpandedCard] = useState(null);
    const [isDraggingOverlay, setIsDraggingOverlay] = useState(false);
    const [overlayRotation, setOverlayRotation] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(0.9);
    const lastPos = useRef({ x: 0, y: 0 });

    const targetX = useRef(0);
    const smoothedX = useRef(0);
    const velocity = useRef(0);
    const isDragging = useRef(false);

    const expandedRef = useRef(null);
    useLayoutEffect(() => {
        expandedRef.current = expandedCard;
    }, [expandedCard]);

    useLayoutEffect(() => {
        const track = trackRef.current;
        const container = containerRef.current;
        if (!track || !container) return;

        const cards = Array.from(track.querySelectorAll('.parallax-card'));
        const images = Array.from(track.querySelectorAll('.p-img'));

        let trackWidth = track.scrollWidth;
        let maxDrag = window.innerWidth - trackWidth;

        const updateParallax = (x) => {
            const progress = maxDrag !== 0 ? Math.abs(x / maxDrag) : 0;
            if (progressFillRef.current) {
                progressFillRef.current.style.width = `${Math.min(100, progress * 100)}%`;
            }

            images.forEach((img, i) => {
                const card = cards[i];
                if (!card) return;
                const cardRect = card.getBoundingClientRect();
                const viewportCenter = window.innerWidth / 2;
                const cardCenter = cardRect.left + cardRect.width / 2;
                const distanceFromCenter = (cardCenter - viewportCenter) / (window.innerWidth / 2);
                const clampedDist = Math.max(-1.5, Math.min(1.5, distanceFromCenter));

                gsap.set(img, { xPercent: clampedDist * 15, overwrite: "auto" });
                gsap.set(card, { rotationY: clampedDist * 5, overwrite: "auto" });
            });
        };

        const drag = Draggable.create(track, {
            type: "x",
            inertia: false,
            bounds: { minX: Math.min(0, maxDrag), maxX: 0 },
            edgeResistance: 0.65,
            onDragStart: function () {
                isDragging.current = true;
                velocity.current = 0;
                trackWidth = track.scrollWidth;
                maxDrag = window.innerWidth - trackWidth;
                this.applyBounds({ minX: Math.min(0, maxDrag), maxX: 0 });
            },
            onDrag: function () {
                velocity.current = this.x - smoothedX.current;
                smoothedX.current = this.x;
                targetX.current = this.x;
                updateParallax(this.x);
            },
            onDragEnd: function () {
                isDragging.current = false;
            }
        })[0];

        const tick = () => {
            if (expandedRef.current || isDragging.current) return;

            if (Math.abs(velocity.current) > 0.1) {
                smoothedX.current += velocity.current;
                velocity.current *= 0.95;
                targetX.current = smoothedX.current;
            } else {
                const diff = targetX.current - smoothedX.current;
                if (Math.abs(diff) > 0.1) {
                    smoothedX.current += diff * 0.1;
                } else {
                    smoothedX.current = targetX.current;
                }
            }

            if (smoothedX.current > 0) { smoothedX.current = 0; velocity.current = 0; }
            if (smoothedX.current < maxDrag) { smoothedX.current = maxDrag; velocity.current = 0; }

            gsap.set(track, { x: smoothedX.current });
            updateParallax(smoothedX.current);
            drag.update();
        };

        gsap.ticker.add(tick);

        const handleWheel = (e) => {
            if (expandedRef.current || isDragging.current) return;
            velocity.current = 0;
            const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
            targetX.current -= delta * 1.5;
            if (targetX.current > 0) targetX.current = 0;
            if (targetX.current < maxDrag) targetX.current = maxDrag;
        };

        container.addEventListener('wheel', handleWheel, { passive: true });

        gsap.fromTo(cards,
            { y: 100, opacity: 0 },
            { y: 0, opacity: 1, duration: 1.2, stagger: 0.05, ease: "power4.out", delay: 0.1 }
        );

        const handleResize = () => {
            trackWidth = track.scrollWidth;
            maxDrag = window.innerWidth - trackWidth;
            drag.applyBounds({ minX: Math.min(0, maxDrag), maxX: 0 });
            if (targetX.current < maxDrag) targetX.current = maxDrag;
            updateParallax(smoothedX.current);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            container.removeEventListener('wheel', handleWheel);
            window.removeEventListener('resize', handleResize);
            gsap.ticker.remove(tick);
            drag.kill();
        };
    }, []);

    React.useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') setExpandedCard(null);
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const handleOverlayDown = (e) => {
        setIsDraggingOverlay(true);
        const clientX = e.clientX || e.touches[0].clientX;
        const clientY = e.clientY || e.touches[0].clientY;
        lastPos.current = { x: clientX, y: clientY };
    };

    const handleOverlayMove = (e) => {
        if (!isDraggingOverlay) return;
        const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
        const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
        const deltaX = clientX - lastPos.current.x;
        const deltaY = clientY - lastPos.current.y;

        setOverlayRotation(prev => ({
            y: prev.y + deltaX * 0.5,
            x: prev.x - deltaY * 0.5
        }));
        lastPos.current = { x: clientX, y: clientY };
        if (e.type.includes('touch')) e.preventDefault();
    };

    const handleOverlayWheel = (e) => {
        const delta = e.deltaX !== 0 ? e.deltaX : e.deltaY;
        setOverlayRotation(prev => ({ ...prev, y: prev.y + delta * 0.1 }));
    };

    return (
        <div className="slider-wrapper" ref={containerRef}>
            <header className="slider-header">
                <div className="header-left">
                    <button className="nav-back-btn" onClick={onBack}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M19 12H5M12 19l-7-7 7-7" />
                        </svg>
                        <span>BACK TO HOME</span>
                    </button>
                    <h1>{category.toUpperCase()} <span className="highlight">COLLECTION</span></h1>
                    <p>DRAG HORIZONTALLY TO EXPLORE</p>
                </div>
                <div className={`theme-toggle-switch slider-theme-toggle ${theme}`} onClick={toggleTheme}>
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
            </header>

            <div className="slider-container">
                <div className="slider-track" ref={trackRef}>
                    {cardsData.map((card, i) => (
                        <div
                            key={card.id}
                            className="parallax-card"
                            onClick={() => {
                                setExpandedCard(card);
                                setOverlayRotation({ x: 0, y: 0 });
                                setZoom(0.9);
                            }}
                        >
                            <div className="card-inner">
                                <img src={card.img} alt={card.title} className="p-img" draggable="false" />
                                <div className="card-content">
                                    <span>{String(i + 1).padStart(2, '0')}</span>
                                    <h3>{card.title}</h3>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="progress-bar">
                <div className="progress-fill" ref={progressFillRef}></div>
            </div>

            {expandedCard && (
                <div
                    className="expansion-overlay"
                    style={{ display: 'flex', opacity: 1 }}
                    onMouseMove={handleOverlayMove}
                    onTouchMove={handleOverlayMove}
                    onMouseUp={() => setIsDraggingOverlay(false)}
                    onTouchEnd={() => setIsDraggingOverlay(false)}
                    onMouseLeave={() => setIsDraggingOverlay(false)}
                >
                    <button className="close-btn" onClick={() => setExpandedCard(null)}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                    </button>

                    <div className="overlay-header">
                        <span>{String(cardsData.findIndex(c => c.id === expandedCard.id) + 1).padStart(2, '0')}</span>
                        <h2>{expandedCard.title}</h2>
                    </div>

                    <div
                        className="overlay-scene"
                        onMouseDown={handleOverlayDown}
                        onTouchStart={handleOverlayDown}
                        onWheel={handleOverlayWheel}
                    >
                        <div
                            className="overlay-card"
                            style={{
                                transform: `rotateX(${overlayRotation.x}deg) rotateY(${overlayRotation.y}deg) scale(${zoom})`
                            }}
                        >
                            <div className="card-face card-front">
                                <img src={expandedCard.img} alt="Front" draggable="false" />
                            </div>
                            <div className="card-face card-back">
                                <img src={expandedCard.img} alt="Back" draggable="false" />
                            </div>
                        </div>
                    </div>

                    <div className="zoom-controls">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /><line x1="8" y1="11" x2="14" y2="11" /></svg>
                        <input
                            type="range"
                            min="0.3"
                            max="1.5"
                            step="0.01"
                            value={zoom}
                            style={{ '--progress': `${((zoom - 0.3) / 1.2) * 100}%` }}
                            onChange={(e) => setZoom(parseFloat(e.target.value))}
                        />
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /><line x1="11" y1="8" x2="11" y2="14" /><line x1="8" y1="11" x2="14" y2="11" /></svg>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DragParallaxSlider;
