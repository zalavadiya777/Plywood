import React, { useLayoutEffect, useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import './Stack.css';

const cardsData = [
    { id: 1, title: 'Neural Flow', desc: 'Digital abstraction', img: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80' },
    { id: 2, title: 'Void Walker', desc: '3D exploration', img: 'https://images.unsplash.com/photo-1633167606207-d840b5070fc2?w=800&q=80' },
    { id: 3, title: 'Neon Horizon', desc: 'Techno-visuals', img: 'https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?w=800&q=80' },
    { id: 4, title: 'Cyber Dreams', desc: 'Vibrant energy', img: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=800&q=80' },
    { id: 5, title: 'Glass Prism', desc: 'Light study', img: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=800&q=80' },
    { id: 6, title: 'Fluid Motion', desc: 'Abstract dynamics', img: 'https://images.unsplash.com/photo-1477346611705-65d1883cee1e?w=800&q=80' },
    { id: 7, title: 'Velvet Abyss', desc: 'Deep textures', img: 'https://images.unsplash.com/photo-1549490349-8643362247b5?w=800&q=80' },
    { id: 8, title: 'Spectral Shift', desc: 'Color theory', img: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=800&q=80' },
    { id: 9, title: 'Prism Core', desc: 'Geometric art', img: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=800&q=80' },
    { id: 10, title: 'Digital Peak', desc: 'Mountain study', img: 'https://images.unsplash.com/photo-1557683311-eac922347aa1?w=800&q=80' },
    { id: 11, title: 'Lunar Ghost', desc: 'Space exploration', img: 'https://images.unsplash.com/photo-1618556450991-2f1af64e8191?w=800&q=80' },
    { id: 12, title: 'Gradient Sky', desc: 'Atmospheric study', img: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80' },
    { id: 13, title: 'Deep Ocean', desc: 'Marine abstraction', img: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=800&q=80' },
    { id: 14, title: 'Abstract Path', desc: 'Urban visuals', img: 'https://images.unsplash.com/photo-1493612216891-65cbf3b5c420?w=800&q=80' },
    { id: 15, title: 'Sunset Breeze', desc: 'Nature study', img: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=800&q=80' },
    { id: 16, title: 'Color Burst', desc: 'Vibrant energy', img: 'https://images.unsplash.com/photo-1574169208507-84376144848b?w=800&q=80' },
    { id: 17, title: 'Ethereal Mist', desc: 'Soft textures', img: 'https://images.unsplash.com/photo-1567095761054-7a02e69e5c43?w=800&q=80' },
    { id: 18, title: 'Parallel Worlds', desc: 'Sci-fi visions', img: 'https://images.unsplash.com/photo-1502691876148-a84978e59af8?w=800&q=80' },
    { id: 19, title: 'Light Study', desc: 'Optical exploration', img: 'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?w=800&q=80' },
    { id: 20, title: 'Cosmic Dust', desc: 'Nebula study', img: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80' },
];

const DepthStackGallery = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [expandedCard, setExpandedCard] = useState(null);
    const sceneRef = useRef(null);
    const cardsRef = useRef([]);
    const isScrolling = useRef(false);

    const config = {
        gapZ: -100,
        gapY: -20,
        scaleStep: 0.1,
        opacityStep: 0.2,
        visibleItems: 4
    };

    useLayoutEffect(() => {
        const totalCards = cardsData.length;
        cardsRef.current.forEach((card, i) => {
            if (!card) return;
            let relIndex = i - currentIndex;
            if (relIndex < 0) relIndex += totalCards;
            
            const isVisible = relIndex < config.visibleItems;
            const zIndex = totalCards - relIndex;

            if (isVisible) {
                gsap.to(card, {
                    x: 0,
                    y: relIndex * config.gapY,
                    z: relIndex * config.gapZ,
                    scale: 1 - (relIndex * config.scaleStep),
                    opacity: 1 - (relIndex * config.opacityStep),
                    autoAlpha: 1,
                    zIndex: zIndex,
                    duration: 0.5,
                    ease: "expo.out",
                    overwrite: true
                });
            } else {
                gsap.to(card, {
                    z: config.visibleItems * config.gapZ - 200,
                    opacity: 0,
                    autoAlpha: 0,
                    duration: 0.4,
                    ease: "power2.inOut"
                });
            }
        });
    }, [currentIndex]);

    useEffect(() => {
        // Entrance Animation
        gsap.from(cardsRef.current, {
            y: 100,
            z: -1000,
            opacity: 0,
            stagger: 0.1,
            duration: 1.2,
            ease: "power4.out",
            delay: 0.2
        });

        const handleMouseMove = (e) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 20;
            const y = (e.clientY / window.innerHeight - 0.5) * 20;
            gsap.to(sceneRef.current, {
                rotationY: x,
                rotationX: -y,
                duration: 1,
                ease: "power2.out"
            });
        };

        const handleWheel = (e) => {
            if (expandedCard || isScrolling.current) return;
            if (Math.abs(e.deltaY) > 10) {
                isScrolling.current = true;
                if (e.deltaY > 0) next();
                else prev();
                setTimeout(() => { isScrolling.current = false; }, 300);
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('wheel', handleWheel, { passive: true });

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('wheel', handleWheel);
        };
    }, [expandedCard]);

    const next = () => {
        const topCard = cardsRef.current[currentIndex];
        gsap.to(topCard, {
            x: 500,
            y: -100,
            rotationZ: 15,
            opacity: 0,
            duration: 0.4,
            ease: "power2.in",
            onComplete: () => {
                setCurrentIndex(prev => (prev + 1) % cardsData.length);
            }
        });
    };

    const prev = () => {
        const newIndex = (currentIndex - 1 + cardsData.length) % cardsData.length;
        const newTop = cardsRef.current[newIndex];
        gsap.set(newTop, { x: -500, rotationZ: -15, opacity: 0, autoAlpha: 1, zIndex: cardsData.length });
        setCurrentIndex(newIndex);
    };

    return (
        <div className="gallery-wrapper">
            <header className="gallery-header">
                <h1>Depth Stack <span className="highlight">Gallery</span></h1>
                <p>Interactive 3D browsing experience</p>
            </header>

            <div className="gallery-container">
                <div className="gallery-scene" ref={sceneRef}>
                    {cardsData.map((card, i) => (
                        <div 
                            key={card.id}
                            className="stack-card"
                            ref={el => cardsRef.current[i] = el}
                            onClick={() => {
                                if (i === currentIndex) setExpandedCard(card);
                                else setCurrentIndex(i);
                            }}
                        >
                            <img src={card.img} alt={card.title} draggable="false" />
                            <div className="card-content">
                                <h3>{card.title}</h3>
                                <p>{card.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="navigation-controls">
                <button onClick={prev} className="nav-btn" aria-label="Previous">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"></polyline></svg>
                </button>
                <div className="stack-indicator">{currentIndex + 1} / {cardsData.length}</div>
                <button onClick={next} className="nav-btn" aria-label="Next">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 6 15 12 9 18"></polyline></svg>
                </button>
            </div>

            {expandedCard && (
                <div className="expansion-overlay active">
                    <button className="close-btn" onClick={() => setExpandedCard(null)}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                    <div className="overlay-content">
                        <img src={expandedCard.img} alt={expandedCard.title} />
                        <div className="overlay-info">
                            <h2>{expandedCard.title}</h2>
                            <p>{expandedCard.desc}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DepthStackGallery;
