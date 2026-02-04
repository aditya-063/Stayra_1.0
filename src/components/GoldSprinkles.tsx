"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export const GoldSprinkles = () => {
    const [mounted, setMounted] = useState(false);
    const [sprinkles, setSprinkles] = useState<any[]>([]);

    useEffect(() => {
        setMounted(true);
        // Create random sprinkles
        const count = 30;
        const newSprinkles = Array.from({ length: count }).map((_, i) => ({
            id: i,
            x: Math.random() * 100, // %
            y: Math.random() * 100, // %
            size: Math.random() > 0.8 ? 3 : 1.5, // Mixed sizes
            duration: 5 + Math.random() * 10,
            delay: Math.random() * 5,
        }));
        setSprinkles(newSprinkles);
    }, []);

    if (!mounted) return null;

    return (
        <div className="fixed inset-0 pointer-events-none z-[1] overflow-hidden">
            {sprinkles.map((s) => (
                <motion.div
                    key={s.id}
                    className="absolute rounded-full bg-gradient-to-tr from-[#fcd34d] via-[#fbbf24] to-[#b45309] shadow-[0_0_8px_rgba(252,211,77,0.6)]"
                    style={{
                        left: `${s.x}%`,
                        top: `${s.y}%`,
                        width: s.size,
                        height: s.size,
                    }}
                    animate={{
                        y: [0, -100, 0], // Float up and down slightly
                        opacity: [0, 0.8, 0], // Fade in and out
                        scale: [0, 1.5, 0], // Twinkle
                    }}
                    transition={{
                        duration: s.duration,
                        repeat: Infinity,
                        delay: s.delay,
                        ease: "easeInOut",
                    }}
                />
            ))}
        </div>
    );
};
