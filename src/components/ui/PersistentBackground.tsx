"use client";

import { motion } from "framer-motion";

import { usePathname } from "next/navigation";

export function PersistentBackground() {
  const pathname = usePathname();
  
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Massive Background Text */}
      {pathname !== '/' && (
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.08]">
          <h1 className="text-[12vw] font-black leading-none whitespace-nowrap text-foreground select-none">
            EcoTrace AI
          </h1>
        </div>
      )}

      {/* Floating Pink Glowing Orbs */}
      <motion.div
        animate={{
          y: [0, -50, 0],
          x: [0, 30, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 left-1/4 w-[40vw] h-[40vw] max-w-[600px] max-h-[600px] bg-pink-500/20 rounded-full blur-[100px]"
      />

      <motion.div
        animate={{
          y: [0, 50, 0],
          x: [0, -40, 0],
          scale: [1, 1.5, 1],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute bottom-1/4 right-1/4 w-[30vw] h-[30vw] max-w-[500px] max-h-[500px] bg-rose-500/20 rounded-full blur-[120px]"
      />
      
      <motion.div
        animate={{
          y: [-20, 20, -20],
          x: [-20, 20, -20],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 5 }}
        className="absolute top-3/4 left-1/3 w-[20vw] h-[20vw] max-w-[300px] max-h-[300px] bg-fuchsia-500/20 rounded-full blur-[80px]"
      />
    </div>
  );
}
