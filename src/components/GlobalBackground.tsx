
import React from 'react';
import { motion } from 'motion/react';

export const GlobalBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Aura Blue Blob */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 50, 0],
          y: [0, -30, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-[#4F84C4]/20 blur-[100px] dark:bg-[#4F84C4]/10"
      />

      {/* Amber Blob */}
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          x: [0, -40, 0],
          y: [0, 60, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
        className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[#FFBF00]/20 blur-[100px] dark:bg-[#FFBF00]/10"
      />

      {/* Pastel Pink Blob */}
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          x: [0, 30, 0],
          y: [0, 40, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 5,
        }}
        className="absolute top-[30%] right-[10%] w-[40%] h-[40%] rounded-full bg-[#FFD1DC]/20 blur-[100px] dark:bg-[#FFD1DC]/10"
      />
      
      {/* Subtle Noise Overlay */}
      <div className="absolute inset-0 noise-bg opacity-[0.02] dark:opacity-[0.03]"></div>
    </div>
  );
};
