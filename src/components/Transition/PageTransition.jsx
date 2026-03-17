import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import gsap from 'gsap';
import './PageTransition.css';

const PageTransition = forwardRef((props, ref) => {
    const containerRef = useRef(null);
    const cardsRef = useRef([]);

    useImperativeHandle(ref, () => ({
        play: (callback) => {
            const tl = gsap.timeline();
            
            // Phase 1: Exit - Cover the screen
            tl.to(cardsRef.current, {
                y: '0%',
                duration: 0.7,
                stagger: 0.09,
                ease: "power4.inOut"
            })
            // Call the swap callback in the middle
            .add(() => {
                if (callback) callback();
            })
            // Phase 2: Enter - Reveal the content
            .to(cardsRef.current, {
                y: '-100%',
                duration: 0.7,
                stagger: 0.09,
                ease: "power4.inOut",
                delay: 0.1
            })
            // Reset to bottom for next time
            .set(cardsRef.current, { y: '100%' });
        }
    }));

    return (
        <div className="transition-container" ref={containerRef}>
            <div className="transition-card card-dark" ref={el => cardsRef.current[0] = el}></div>
            <div className="transition-card card-accent" ref={el => cardsRef.current[1] = el}></div>
            <div className="transition-card card-light" ref={el => cardsRef.current[2] = el}></div>
        </div>
    );
});

export default PageTransition;
