import React, { useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { Draggable } from 'gsap/Draggable';
import './Slider.css';

gsap.registerPlugin(Draggable);

const cardsData = [
    { id: 1, title: 'Neural Flow', img: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1000&q=80' },
    { id: 2, title: 'Void Walker', img: 'https://images.unsplash.com/photo-1633167606207-d840b5070fc2?w=1000&q=80' },
    { id: 3, title: 'Neon Horizon', img: 'https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?w=1000&q=80' },
    { id: 4, title: 'Cyber Dreams', img: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=1000&q=80' },
    { id: 5, title: 'Glass Prism', img: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=1000&q=80' },
    { id: 6, title: 'Fluid Motion', img: 'https://images.unsplash.com/photo-1477346611705-65d1883cee1e?w=1000&q=80' },
    { id: 7, title: 'Velvet Abyss', img: 'https://images.unsplash.com/photo-1549490349-8643362247b5?w=1000&q=80' },
    { id: 8, title: 'Spectral Shift', img: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=1000&q=80' },
    { id: 9, title: 'Prism Core', img: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=1000&q=80' },
    { id: 10, title: 'Digital Peak', img: 'https://images.unsplash.com/photo-1557683311-eac922347aa1?w=1000&q=80' },
    { id: 11, title: 'Lunar Ghost', img: 'https://images.unsplash.com/photo-1618556450991-2f1af64e8191?w=1000&q=80' },
    { id: 12, title: 'Gradient Sky', img: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1000&q=80' },
    { id: 13, title: 'Deep Ocean', img: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=1000&q=80' },
    { id: 14, title: 'Abstract Path', img: 'https://images.unsplash.com/photo-1493612216891-65cbf3b5c420?w=1000&q=80' },
    { id: 15, title: 'Sunset Breeze', img: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=1000&q=80' },
    { id: 16, title: 'Color Burst', img: 'https://images.unsplash.com/photo-1574169208507-84376144848b?w=1000&q=80' },
    { id: 17, title: 'Ethereal Mist', img: 'https://images.unsplash.com/photo-1567095761054-7a02e69e5c43?w=1000&q=80' },
    { id: 18, title: 'Parallel Worlds', img: 'https://images.unsplash.com/photo-1502691876148-a84978e59af8?w=1000&q=80' },
    { id: 19, title: 'Light Study', img: 'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?w=1000&q=80' },
    { id: 20, title: 'Cosmic Dust', img: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1000&q=80' },
];

const DragParallaxSlider = () => {
    const containerRef = useRef(null);
    const trackRef = useRef(null);
    const progressFillRef = useRef(null);
    const [expandedCard, setExpandedCard] = useState(null);
    const [isDraggingOverlay, setIsDraggingOverlay] = useState(false);
    const [overlayRotation, setOverlayRotation] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(0.9); // 0.9 is the 50% mark of 0.3-1.5 range
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

                gsap.set(img, {
                    xPercent: clampedDist * 15,
                    overwrite: "auto"
                });

                gsap.set(card, {
                    rotationY: clampedDist * 5,
                    overwrite: "auto"
                });
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
                
                // Refresh bounds on start to handle any layout shifts
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
            } 
            else {
                const diff = targetX.current - smoothedX.current;
                if (Math.abs(diff) > 0.1) {
                    smoothedX.current += diff * 0.1;
                } else {
                    smoothedX.current = targetX.current;
                }
            }

            if (smoothedX.current > 0) {
                smoothedX.current = 0;
                velocity.current = 0;
            }
            if (smoothedX.current < maxDrag) {
                smoothedX.current = maxDrag;
                velocity.current = 0;
            }

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
            {
                y: 0,
                opacity: 1,
                duration: 1.2,
                stagger: 0.05,
                ease: "power4.out",
                delay: 0.1
            }
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

    // Separate effect for keyboard accessibility to avoid restarting animations
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
                <h1>Dynamic <span className="highlight">Parallax</span></h1>
                <p>Drag horizontally to explore</p>
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
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
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
