import React, { useRef, useState } from 'react';
import { motion, useAnimation, useMotionValue, useTransform } from 'motion/react';
import confetti from 'canvas-confetti';
import { Star, ArrowRight } from 'lucide-react';

interface WheelProps {
  onWin: (amount: number) => void;
}

const segments = [5, 10, 20, 15, 10, 5, 20, 30, 10, 5, 20, 50];

const colors = [
  '#6D28D9', // violet-600
  '#4C1D95', // violet-800
];

export default function Wheel({ onWin }: WheelProps) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const controls = useAnimation();
  const wheelRef = useRef<HTMLDivElement>(null);
  
  const x = useMotionValue(0);
  const background = useTransform(x, [0, 224], ['rgba(245,158,11,0)', 'rgba(245,158,11,0.2)']);

  const spin = async () => {
    if (isSpinning) return;
    setIsSpinning(true);

    const segmentAngle = 360 / segments.length;
    const targetIndex = Math.floor(Math.random() * segments.length);
    const amount = segments[targetIndex];

    const baseSpins = 5 + Math.floor(Math.random() * 5); // 5-10 full spins
    
    // Calculate the exact rotation needed to bring the target segment to the top
    const targetRotation = 360 - (targetIndex * segmentAngle);
    
    // Add a random offset within the segment (avoiding the exact edges)
    const maxOffset = (segmentAngle / 2) - 2; 
    const offset = (Math.random() * 2 * maxOffset) - maxOffset;

    const currentMod = rotation % 360;
    let rotationNeeded = targetRotation - currentMod;
    if (rotationNeeded < 0) rotationNeeded += 360;

    const totalRotation = rotation + (baseSpins * 360) + rotationNeeded + offset;
    
    setRotation(totalRotation);

    await controls.start({
      rotate: totalRotation,
      transition: {
        duration: 4,
        ease: [0.1, 0.5, 0.1, 1],
      }
    });

    setIsSpinning(false);

    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 }
    });

    setTimeout(() => onWin(amount), 1000);
  };

  const handleDragEnd = (event: any, info: any) => {
    if (info.offset.x > 150) {
      spin();
    }
  };

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="relative w-72 h-72 md:w-80 md:h-80">
        {/* Top Pointer */}
        <div className="absolute top-[-10px] left-1/2 -translate-x-1/2 z-30 w-0 h-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-t-[30px] border-t-[#FDE68A] drop-shadow-md" />
        
        {/* Outer Rim */}
        <div className="absolute inset-[-8px] rounded-full border-[8px] border-[#FDE68A] shadow-[0_0_30px_rgba(245,158,11,0.3)] z-0" />

        <motion.div
          ref={wheelRef}
          animate={controls}
          className="w-full h-full rounded-full overflow-hidden relative bg-violet-900 shadow-inner"
          style={{ transformOrigin: 'center' }}
        >
          {/* Wheel Slices */}
          {segments.map((val, i) => {
            const angle = 360 / segments.length;
            // Center segment 0 at the top (-90deg)
            const rotate = -90 - (angle / 2) + (i * angle);
            return (
              <div
                key={i}
                className="absolute top-1/2 left-1/2 origin-top-left"
                style={{
                  width: '100%',
                  height: '100%',
                  transform: `rotate(${rotate}deg)`,
                  backgroundColor: colors[i % colors.length],
                  // Add 1 degree to angle to prevent 1px anti-aliasing gaps between slices
                  clipPath: `polygon(0 0, 100% 0, 100% ${Math.tan(((angle + 1) * Math.PI) / 180) * 100}%, 0 0)`,
                }}
              />
            );
          })}

          {/* Wheel Text */}
          {segments.map((val, i) => {
            const angle = 360 / segments.length;
            const rotate = -90 + (i * angle);
            return (
              <div
                key={`text-${i}`}
                className="absolute top-1/2 left-1/2 w-[50%] h-12 -translate-y-1/2 origin-left flex items-center justify-end pr-4 md:pr-6"
                style={{
                  transform: `rotate(${rotate}deg)`,
                }}
              >
                <div 
                  className="flex flex-col items-center justify-center w-16"
                  style={{ transform: 'rotate(90deg)' }}
                >
                  <span className="text-xl md:text-2xl font-black text-white drop-shadow-md leading-none text-center">
                    {val}৳
                  </span>
                </div>
              </div>
            );
          })}
        </motion.div>

        {/* Center Star Icon */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-gradient-to-br from-[#FDE68A] via-[#F59E0B] to-[#D97706] rounded-full shadow-[0_0_20px_rgba(245,158,11,0.4)] z-40 flex items-center justify-center border-4 border-white/30"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none rounded-full" />
          <Star className="text-white fill-white drop-shadow-md relative z-10" size={28} />
        </div>
      </div>

      {/* Spin Slider */}
      <div className="mt-4 w-72 h-16 bg-black/40 rounded-full border border-white/10 relative overflow-hidden flex items-center shadow-inner">
        <motion.div style={{ background }} className="absolute inset-0 pointer-events-none" />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="text-white/50 font-bold text-sm tracking-widest uppercase ml-8">
            {isSpinning ? 'Spinning...' : 'Swipe to Spin'}
          </span>
        </div>
        
        {!isSpinning && (
          <motion.div
            drag="x"
            dragConstraints={{ left: 0, right: 224 }}
            dragSnapToOrigin={true}
            onDragEnd={handleDragEnd}
            style={{ x }}
            className="absolute left-2 top-2 bottom-2 w-12 bg-gradient-gold rounded-full flex items-center justify-center cursor-grab active:cursor-grabbing shadow-[0_0_15px_rgba(245,158,11,0.5)] z-10 border border-amber-300/50"
          >
            <ArrowRight className="text-black" size={24} />
          </motion.div>
        )}
      </div>
    </div>
  );
}
