import React, { useLayoutEffect, useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import './Deck.css';

const cardsData = [
    { id: 1, title: 'Neural Flow', img: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80' },
    { id: 2, title: 'Void Walker', img: 'https://images.unsplash.com/photo-1633167606207-d840b5070fc2?w=800&q=80' },
    { id: 3, title: 'Neon Horizon', img: 'https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?w=800&q=80' },
    { id: 4, title: 'Cyber Dreams', img: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=800&q=80' },
    { id: 5, title: 'Glass Prism', img: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=800&q=80' },
    { id: 6, title: 'Fluid Motion', img: 'https://images.unsplash.com/photo-1477346611705-65d1883cee1e?w=800&q=80' },
    { id: 7, title: 'Velvet Abyss', img: 'https://images.unsplash.com/photo-1549490349-8643362247b5?w=800&q=80' },
    { id: 8, title: 'Spectral Shift', img: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=800&q=80' },
    { id: 9, title: 'Prism Core', img: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=800&q=80' },
    { id: 10, title: 'Digital Peak', img: 'https://images.unsplash.com/photo-1557683311-eac922347aa1?w=800&q=80' },
    { id: 11, title: 'Lunar Ghost', img: 'https://images.unsplash.com/photo-1618556450991-2f1af64e8191?w=800&q=80' },
    { id: 12, title: 'Gradient Sky', img: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80' },
    { id: 13, title: 'Deep Ocean', img: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=800&q=80' },
    { id: 14, title: 'Abstract Path', img: 'https://images.unsplash.com/photo-1493612216891-65cbf3b5c420?w=800&q=80' },
    { id: 15, title: 'Sunset Breeze', img: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=800&q=80' },
    { id: 16, title: 'Color Burst', img: 'https://images.unsplash.com/photo-1574169208507-84376144848b?w=800&q=80' },
    { id: 17, title: 'Ethereal Mist', img: 'https://images.unsplash.com/photo-1567095761054-7a02e69e5c43?w=800&q=80' },
    { id: 18, title: 'Parallel Worlds', img: 'https://images.unsplash.com/photo-1502691876148-a84978e59af8?w=800&q=80' },
    { id: 19, title: 'Light Study', img: 'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?w=800&q=80' },
    { id: 20, title: 'Cosmic Dust', img: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80' },
];

const CardDeckSpread = () => {
    const [isSpread, setIsSpread] = useState(false);
    const [hoveredCard, setHoveredCard] = useState(null);
    const cardsRef = useRef([]);
    const stackRef = useRef(null);

    const config = {
        cardWidth: 220,
        overlap: 60,
        entranceDuration: 0.7,
    };

    useLayoutEffect(() => {
        const totalCards = cardsData.length;
        const totalWidth = config.cardWidth + (totalCards - 1) * config.overlap;
        stackRef.current.style.width = isSpread ? `${totalWidth}px` : `${config.cardWidth}px`;

        cardsRef.current.forEach((card, i) => {
            if (!card) return;
            if (isSpread) {
                const offset = i - (totalCards - 1) / 2;
                gsap.to(card, {
                    left: i * config.overlap,
                    top: Math.abs(offset) * 2,
                    rotation: offset * 2,
                    opacity: 1,
                    scale: 1,
                    duration: config.entranceDuration,
                    delay: i * 0.03,
                    ease: "back.out(1.2)"
                });
            } else {
                gsap.to(card, {
                    left: (totalCards - 1) * config.overlap / 2 - (i * 2),
                    top: i * 2,
                    rotation: 0,
                    scale: 0.9,
                    duration: 0.6,
                    ease: "power3.inOut"
                });
            }
        });
    }, [isSpread]);

    useEffect(() => {
        const handleWheel = (e) => {
            if (e.deltaY > 0) setIsSpread(true);
            else setIsSpread(false);
        };
        window.addEventListener('wheel', handleWheel, { passive: true });
        
        // Auto-spread timer
        const timer = setTimeout(() => setIsSpread(true), 500);

        return () => {
            window.removeEventListener('wheel', handleWheel);
            clearTimeout(timer);
        };
    }, []);

    return (
        <div className="deck-wrapper">
            <div className={`deck-container ${hoveredCard !== null ? 'has-hover' : ''}`}>
                <div className="deck-stack" ref={stackRef}>
                    {cardsData.map((card, i) => (
                        <div 
                            key={card.id}
                            className="deck-card"
                            ref={el => cardsRef.current[i] = el}
                            onMouseEnter={() => setHoveredCard(i)}
                            onMouseLeave={() => setHoveredCard(null)}
                        >
                            <img src={card.img} alt={card.title} draggable="false" />
                            <div className="card-title">{card.title}</div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="controls">
                <button onClick={() => setIsSpread(true)}>Spread Deck</button>
                <button onClick={() => setIsSpread(false)}>Reset Deck</button>
            </div>
        </div>
    );
};

export default CardDeckSpread;
