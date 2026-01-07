import React, { useState, useRef } from 'react';
import { motion, useMotionValue, useMotionTemplate } from 'framer-motion';

export const LensHero: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Motion values for mouse position
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top } = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - left);
    mouseY.set(e.clientY - top);
  };

  const maskImage = useMotionTemplate`radial-gradient(
    250px circle at ${mouseX}px ${mouseY}px,
    black 0%,
    transparent 100%
  )`;

  return (
    <div
      ref={containerRef}
      className="relative h-[400px] w-full overflow-hidden border-b border-white/5 flex items-center justify-center cursor-crosshair bg-transparent"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Base Layer - Visible White Default */}
      <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center pointer-events-none">
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-white uppercase select-none transition-opacity duration-300">
          AI Art Prompt<br />Engineering
        </h1>
        <p className="mt-4 text-slate-400 font-mono text-sm tracking-widest uppercase">
          by Piotr Macai & Ainsider
        </p>
      </div>

      {/* Masked Layer - Lit up with Modern Orange Gradient */}
      <motion.div
        className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center pointer-events-none bg-background/90"
        style={{
          maskImage: maskImage,
          WebkitMaskImage: maskImage
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent opacity-50" />
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-600 uppercase select-none drop-shadow-[0_0_25px_rgba(249,115,22,0.5)]">
          AI Art Prompt<br />Engineering
        </h1>
        <p className="mt-4 text-primary font-mono text-sm tracking-widest uppercase font-bold drop-shadow-md">
          Reverse Engineer The Impossible
        </p>
      </motion.div>
    </div>
  );
};