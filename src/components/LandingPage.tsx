import React from 'react';
import { motion } from 'motion/react';
import { Gift, Sparkles, Star, ChevronRight, Moon } from 'lucide-react';

interface LandingPageProps {
  onStart: (type: 'claim' | 'try') => void;
  onAdmin: () => void;
}

export default function LandingPage({ onStart, onAdmin }: LandingPageProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-12 relative">
      {/* Animated Background Elements */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        className="absolute top-[-10%] left-[-10%] text-amber-500/10 opacity-20 pointer-events-none"
      >
        <Star size={400} />
      </motion.div>
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-[-10%] right-[-10%] text-violet-500/10 opacity-20 pointer-events-none"
      >
        <Star size={500} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-6 z-10 mt-12"
      >
        <div className="flex items-center justify-center gap-3 mb-6">
          <Moon className="text-amber-300 fill-amber-300/20" size={24} />
          <Sparkles className="text-amber-400 animate-pulse" size={20} />
          <span className="text-amber-300 font-bold tracking-[0.2em] uppercase text-sm drop-shadow-md">Eid Mubarak</span>
          <Sparkles className="text-amber-400 animate-pulse" size={20} />
        </div>
        <h1 className="text-5xl md:text-7xl font-display font-bold text-white leading-[1.1] tracking-tight">
          Claim your salami <br />
          <span className="text-gradient-gold">from Akib in a fun way!</span>
        </h1>
        <p className="text-white/60 max-w-lg mx-auto text-[17px] leading-relaxed">
          Spin the 🎡 wheel and get up to 50 BDT Eid Salami! To try this, just click the 'Claim Salami' button below.
        </p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex flex-col md:flex-row gap-4 w-full max-w-md z-10"
      >
        <button
          onClick={() => onStart('claim')}
          className="flex-1 bg-gradient-gold text-black px-8 py-4 rounded-2xl font-bold text-lg shadow-[0_0_30px_rgba(245,158,11,0.2)] hover:shadow-[0_0_40px_rgba(245,158,11,0.4)] transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2 group border border-amber-300/50"
        >
          <Gift className="group-hover:rotate-12 transition-transform" size={20} />
          Claim Salami
        </button>
        <button
          onClick={() => onStart('try')}
          className="flex-1 glass-panel text-white/90 px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-white/10 hover:text-white transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2 group"
        >
          Test the Wheel! (Demo)
          <ChevronRight className="group-hover:translate-x-1 transition-transform" size={20} />
        </button>
      </motion.div>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        onClick={onAdmin}
        className="text-white/30 text-sm hover:text-white/60 transition-colors z-10 font-medium tracking-wide"
      >
        Admin Panel
      </motion.button>

      <div className="absolute bottom-8 text-white/20 text-[10px] font-bold tracking-[0.2em] uppercase flex flex-col items-center gap-2 pointer-events-none">
        <span>Made with ❤️ for Eid</span>
      </div>
    </div>
  );
}
