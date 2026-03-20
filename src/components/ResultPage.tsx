import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { db, collection, addDoc, query, where, getDocs, updateDoc, doc } from '../firebase';
import { Timestamp } from 'firebase/firestore';
import { CheckCircle, Loader2, Home, AlertCircle, Sparkles, Gift, Heart, Coins } from 'lucide-react';

interface ResultPageProps {
  type: 'claim' | 'try';
  name: string;
  amount: number;
  token?: string;
  bkashNumber: string;
  isAlreadyClaimed?: boolean;
  onReset: () => void;
}

export default function ResultPage({ type, name, amount, token, bkashNumber, isAlreadyClaimed, onReset }: ResultPageProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const hasSubmitted = useRef(false);

  useEffect(() => {
    if (hasSubmitted.current) return;
    hasSubmitted.current = true;

    const submitClaim = async () => {
      if (type === 'try' || isAlreadyClaimed) {
        // Skip database submission for demo spins or already claimed passes
        setLoading(false);
        return;
      }

      try {
        if (token && token !== 'TRY_USER') {
          const q = query(collection(db, 'passes'), where('token', '==', token.toUpperCase()));
          const snap = await getDocs(q);
          
          if (!snap.empty) {
            const passDoc = snap.docs[0];
            await updateDoc(doc(db, 'passes', passDoc.id), {
              isUsed: true
            });
          }
        }

        await addDoc(collection(db, 'claims'), {
          name,
          amount,
          bkashNumber,
          status: 'pending',
          claimedAt: Timestamp.now(),
          passToken: token || 'TRY_USER'
        });
      } catch (err) {
        console.error('Error submitting claim:', err);
        setError('Failed to submit claim. Please try again!');
      } finally {
        setLoading(false);
      }
    };

    submitClaim();
  }, [type, name, amount, token, bkashNumber, isAlreadyClaimed]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center relative w-full">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-md glass-panel p-10 rounded-[2.5rem] space-y-8 relative z-10"
      >
        {/* Card Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent pointer-events-none rounded-[2.5rem]" />

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 space-y-4 relative z-10">
            <Loader2 className="animate-spin text-amber-500" size={48} />
            <p className="text-white/60 font-medium animate-pulse">Processing your Salami...</p>
          </div>
        ) : error ? (
          <div className="space-y-6 relative z-10 py-8">
            <div className="flex justify-center">
              <div className="p-4 bg-red-500/10 rounded-full text-red-400 border border-red-500/20">
                <AlertCircle size={48} />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-white">Oops!</h2>
            <p className="text-red-400">{error}</p>
            <button
              onClick={onReset}
              className="w-full bg-gradient-gold text-black py-4 rounded-xl font-bold mt-4"
            >
              Back to Home
            </button>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8 py-4 relative z-10"
          >
            {/* Floating Background Elements */}
            <motion.div
              animate={{ y: [-10, 10, -10], rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-12 -left-8 text-amber-500/20 pointer-events-none"
            >
              <Coins size={64} />
            </motion.div>
            <motion.div
              animate={{ y: [10, -10, 10], rotate: [0, -10, 10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-8 -right-8 text-violet-500/20 pointer-events-none"
            >
              <Gift size={80} />
            </motion.div>

            <div className="relative inline-block">
              <motion.div 
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="p-6 bg-gradient-to-br from-amber-400/20 to-amber-600/20 border border-amber-500/30 rounded-full text-amber-400 shadow-[0_0_30px_rgba(245,158,11,0.2)]"
              >
                <Gift size={56} />
              </motion.div>
              <Sparkles className="absolute -top-2 -right-2 text-amber-300 animate-pulse" size={28} />
            </div>

            <div className="space-y-2">
              <p className="text-amber-400/80 font-bold tracking-widest uppercase text-xs">
                You Secured
              </p>
              <div className="relative inline-block">
                <h2 className="text-7xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600 drop-shadow-lg tracking-tight">
                  {amount}
                  <span className="text-4xl font-serif italic text-amber-500 ml-2">৳</span>
                </h2>
              </div>
              {type === 'try' ? (
                <>
                  <p className="text-white/90 font-medium leading-relaxed text-xl pt-4 flex items-center justify-center gap-2">
                    This is a demo spin!
                  </p>
                  <p className="text-white/60 text-sm px-4">
                    To claim your actual Salami, go to the home screen and click the "Claim Salami" button.
                  </p>
                </>
              ) : isAlreadyClaimed ? (
                <>
                  <p className="text-white/90 font-medium leading-relaxed text-xl pt-4 flex items-center justify-center gap-2">
                    🌙 Eid Mubarak! ❤️️
                  </p>
                  <p className="text-white/60 text-sm">You have already claimed this pass.</p>
                </>
              ) : (
                <>
                  <p className="text-white/90 font-medium leading-relaxed text-xl pt-4 flex items-center justify-center gap-2">
                    🌙 Eid Mubarak! ❤️️
                  </p>
                  <p className="text-white/60 text-sm">You will shortly receive it on your bKash.</p>
                </>
              )}
            </div>

            <div className="bg-gradient-to-br from-white/5 to-white/0 p-6 rounded-2xl border border-white/10 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <p className="text-sm text-white/80 leading-relaxed italic relative z-10">
                "May the blessings of Allah fill your life with joy, success, and prosperity. Have a wonderful and blessed Eid! 🌙✨"
              </p>
            </div>

            <button
              onClick={onReset}
              className="w-full bg-gradient-gold text-black py-4 rounded-xl font-bold text-lg shadow-[0_0_20px_rgba(245,158,11,0.2)] hover:shadow-[0_0_30px_rgba(245,158,11,0.4)] transition-all flex items-center justify-center gap-3 transform hover:-translate-y-1"
            >
              Back to Home
            </button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
