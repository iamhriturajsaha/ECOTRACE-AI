"use client";

import { motion } from "framer-motion";

export function AnimatedLogo({ className = "", size = 64 }: { className?: string, size?: number }) {
  return (
    <div className={`relative flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Core Glowing Orb */}
        <motion.circle 
          cx="50" cy="50" r="15" 
          fill="url(#coreGradient)"
          animate={{ scale: [1, 1.2, 1], opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Outer Tech Ring */}
        <motion.circle 
          cx="50" cy="50" r="30" 
          stroke="url(#ringGradient)" 
          strokeWidth="2"
          strokeDasharray="40 10 10 10"
          animate={{ rotate: 360 }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "center" }}
        />

        {/* Inner Organic Ring (Leaf Motif) */}
        <motion.path 
          d="M50 25 C65 25, 75 35, 75 50 C75 65, 65 75, 50 75 C35 75, 25 65, 25 50 C25 35, 35 25, 50 25 Z" 
          stroke="url(#leafGradient)" 
          strokeWidth="3"
          strokeDasharray="20 5"
          animate={{ rotate: -360, scale: [0.9, 1.1, 0.9] }}
          transition={{ rotate: { duration: 20, repeat: Infinity, ease: "linear" }, scale: { duration: 4, repeat: Infinity, ease: "easeInOut" } }}
          style={{ transformOrigin: "center" }}
        />

        {/* Connecting Nodes */}
        {[0, 120, 240].map((angle, i) => (
          <motion.circle
            key={i}
            cx="50" cy="20" r="3" fill="#f43f5e"
            style={{ originX: "50px", originY: "50px", rotate: angle }}
            animate={{ rotate: angle + 360 }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          />
        ))}

        <defs>
          <radialGradient id="coreGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fbcfe8" /> {/* pink-200 */}
            <stop offset="100%" stopColor="#f43f5e" /> {/* rose-500 */}
          </radialGradient>
          <linearGradient id="ringGradient" x1="0" y1="0" x2="100" y2="100">
            <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.8" /> {/* rose-500 */}
            <stop offset="100%" stopColor="#a855f7" stopOpacity="0.2" /> {/* purple-500 */}
          </linearGradient>
          <linearGradient id="leafGradient" x1="0" y1="100" x2="100" y2="0">
            <stop offset="0%" stopColor="#fce7f3" /> {/* pink-100 */}
            <stop offset="100%" stopColor="#e11d48" /> {/* rose-600 */}
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
