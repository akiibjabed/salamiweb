import React, { useState } from 'react';
import { motion } from 'motion/react';
import { db, collection, query, where, getDocs, updateDoc, doc } from '../firebase';
import { Pass } from '../types';
import { ArrowLeft, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

interface ClaimFormProps {
  type: 'claim' | 'try';
  initialName?: string;
  initialToken?: string;
  onBack: () => void;
  onSuccess: (name: string, token?: string, bkash?: string, alreadyClaimedAmount?: number) => void;
}

export default function ClaimForm({ type, initialName = '', initialToken = '', onBack, onSuccess }: ClaimFormProps) {
  const [name, setName] = useState(initialName);
  const [token, setToken] = useState(initialToken);
  const [bkash, setBkash] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (type === 'try') {
      // For "Give a Try", we just need a name
      setTimeout(() => {
        onSuccess(name);
        setLoading(false);
      }, 1000);
      return;
    }

    // For "Claim", we need to validate the token
    try {
      const q = query(collection(db, 'passes'), where('token', '==', token.toUpperCase()));
      const snap = await getDocs(q);

      if (snap.empty) {
        setError('Invalid salami pass or this pass has already been used!');
        setLoading(false);
        return;
      }

      const passDoc = snap.docs[0];
      const passData = passDoc.data() as Pass;

      if (passData.isUsed) {
        const claimsQ = query(collection(db, 'claims'), where('passToken', '==', passData.token));
        const claimsSnap = await getDocs(claimsQ);
        
        if (!claimsSnap.empty) {
          const claimData = claimsSnap.docs[0].data();
          onSuccess(name, passData.token, claimData.bkashNumber, claimData.amount);
          return;
        } else {
          setError('This pass has already been used!');
          setLoading(false);
          return;
        }
      }

      onSuccess(name, passData.token, bkash);
    } catch (err) {
      console.error('Error validating pass:', err);
      setError('Invalid salami pass or this pass has already been used!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 w-full max-w-md mx-auto relative z-10">
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={onBack}
        className="self-start mb-8 text-white/50 hover:text-white transition-colors flex items-center gap-2 font-medium"
      >
        <ArrowLeft size={20} />
        Back
      </motion.button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full glass-panel rounded-[2rem] p-8 md:p-10 relative overflow-hidden"
      >
        {/* Card Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent pointer-events-none rounded-[2rem]" />

        <div className="text-center mb-8 relative z-10">
          <h2 className="text-3xl font-display font-bold text-white mb-2 tracking-tight">
            Enter Details
          </h2>
          <p className="text-white/50 text-sm">
            {type === 'claim' 
              ? 'Use your unique salami pass to claim your salami.'
              : 'Just enter your name and give it a spin!'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-white/70 uppercase tracking-wider ml-1">Your Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-transparent transition-all"
              placeholder="e.g. Abir"
              required
              disabled={loading}
            />
          </div>

          {type === 'claim' && (
            <>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-white/70 uppercase tracking-wider ml-1">Salami Pass (auto-fill)</label>
                <input
                  type="text"
                  value={token}
                  onChange={(e) => setToken(e.target.value.toUpperCase())}
                  className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-transparent transition-all font-mono tracking-widest"
                  placeholder="Enter salami pass"
                  required
                  disabled={loading}
                />
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 text-red-300 bg-red-500/10 p-3 rounded-lg text-sm font-medium border border-red-500/20"
                >
                  <AlertCircle size={18} />
                  {error}
                </motion.div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-white/70 uppercase tracking-wider ml-1">bKash Number</label>
                <input
                  type="tel"
                  value={bkash}
                  onChange={(e) => setBkash(e.target.value)}
                  pattern="^01[3-9]\d{8}$"
                  className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-transparent transition-all font-mono tracking-wider"
                  placeholder="01XXXXXXXXX"
                  required
                  disabled={loading}
                />
                <p className="text-xs text-white/40 font-medium ml-1">Your salami will be sent to this number.</p>
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-gold text-black font-bold text-lg py-4 rounded-xl shadow-[0_0_20px_rgba(245,158,11,0.2)] hover:shadow-[0_0_30px_rgba(245,158,11,0.4)] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-4 group border border-amber-300/50"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={24} />
            ) : (
              <>
                Continue
                <CheckCircle2 className="group-hover:scale-110 transition-transform" size={20} />
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
