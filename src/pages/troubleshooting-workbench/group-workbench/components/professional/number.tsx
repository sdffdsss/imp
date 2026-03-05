import React, { useState, useEffect, useRef } from 'react';
import anime from 'animejs/lib/anime.es.js';

export default function Number({ number }) {
    const placeholderNumberRef = useRef<HTMLDivElement>(null);
    const showNumberRef = useRef<HTMLDivElement>(null);
    const isMountRef = useRef(true);
    const [showNum, setShowNum] = useState(number);

    useEffect(() => {
        if (isMountRef.current) {
            isMountRef.current = false;
            return;
        }

        anime({
            targets: showNumberRef.current,
            scale: [1, 1.8],
            opacity: [1, 0],
            duration: 3000,
            complete: () => {
                if (showNumberRef.current) {
                    showNumberRef.current!.style.display = 'none';
                }
            },
            begin: () => {
                if (placeholderNumberRef.current && placeholderNumberRef.current.style) {
                    placeholderNumberRef.current!.style.display = 'block';
                    anime({
                        targets: placeholderNumberRef.current,
                        scale: [1.8, 1],
                        opacity: [0, 1],
                        delay: 300,
                        duration: 3000,
                        complete: () => {
                            if (placeholderNumberRef.current && placeholderNumberRef.current.style) {
                                placeholderNumberRef.current!.style.display = 'none';
                                showNumberRef.current!.style.display = 'block';
                                showNumberRef.current!.style.opacity = '1';
                                showNumberRef.current!.style.transform = 'scale(1)';
                                setShowNum(number);
                            }
                        },
                    });
                }
            },
        });
    }, [number]);

    return (
        <div className={`button-item-num ${number > 0 ? 'showColor' : ''}`}>
            <span style={{ display: 'none' }} ref={placeholderNumberRef}>
                {number}
            </span>
            <span ref={showNumberRef} style={{ opacity: showNum === 0 ? '0.8' : '1' }}>
                {showNum}
            </span>
        </div>
    );
}
