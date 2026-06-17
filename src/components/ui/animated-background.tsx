/* eslint-disable react-hooks/purity, react-hooks/set-state-in-effect */
"use client";

import { motion } from "framer-motion";
import { useEffect, useState, useMemo } from "react";

export function AnimatedBackground() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Generate random positions for floating orbs and leaves ONCE
  const elements = useMemo(() => Array.from({ length: 15 }).map((_, i) => ({
    id: i,
    size: Math.random() * 60 + 20,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: Math.random() * 20 + 10,
    delay: Math.random() * 5,
    type: i % 3 === 0 ? 'leaf' : 'orb'
  })), []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
      {/* Base gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-accent/5 to-primary/10" />
      
      {/* Glowing orbs and leaves */}
      {elements.map((el) => (
        <motion.div
          key={el.id}
          className={`absolute rounded-full mix-blend-multiply filter blur-sm opacity-40 ${
            el.type === 'leaf' ? 'bg-primary' : 'bg-accent'
          }`}
          style={{
            width: el.size * 2,
            height: el.size * 2,
            left: `${el.x}%`,
            top: `${el.y}%`,
          }}
          animate={{
            x: [0, Math.random() * 100 - 50, 0],
            y: [0, Math.random() * 100 - 50, 0],
            scale: [1, Math.random() + 0.5, 1],
          }}
          transition={{
            duration: el.duration,
            delay: el.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}
