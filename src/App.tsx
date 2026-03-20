import React, { useState, useEffect, Component, ErrorInfo, ReactNode } from 'react';
import { auth, onAuthStateChanged, signInWithPopup, googleProvider, db, collection, query, where, getDocs } from './firebase';
import { AppState } from './types';
import LandingPage from './components/LandingPage';
import ClaimForm from './components/ClaimForm';
import Wheel from './components/Wheel';
import ResultPage from './components/ResultPage';
import AdminPanel from './components/AdminPanel';
import { motion, AnimatePresence } from 'motion/react';
import { LogIn, LogOut, ShieldCheck, Loader2, Sparkles } from 'lucide-react';

export default function App() {
  const [state, setState] = useState<AppState>('landing');
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isCheckingUrl, setIsCheckingUrl] = useState(true);
  const [claimType, setClaimType] = useState<'claim' | 'try'>('claim');
  const [claimName, setClaimName] = useState('');
  const [claimToken, setClaimToken] = useState<string | undefined>(undefined);
  const [claimBkash, setClaimBkash] = useState('');
  const [wonAmount, setWonAmount] = useState(0);
  const [isAlreadyClaimed, setIsAlreadyClaimed] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });

    const checkUrlParams = async () => {
      const params = new URLSearchParams(window.location.search);
      const urlName = params.get('name');
      const urlToken = params.get('token');

      if (urlName && urlToken) {
        setClaimName(urlName);
        setClaimToken(urlToken);
        setClaimType('claim');
        
        try {
          const qPass = query(collection(db, 'passes'), where('token', '==', urlToken.toUpperCase()));
          const passSnap = await getDocs(qPass);
          
          if (!passSnap.empty) {
            const passData = passSnap.docs[0].data();
            if (passData.isUsed) {
              const qClaim = query(collection(db, 'claims'), where('passToken', '==', urlToken.toUpperCase()));
              const claimSnap = await getDocs(qClaim);
              if (!claimSnap.empty) {
                const claimData = claimSnap.docs[0].data();
                setWonAmount(claimData.amount);
                setClaimBkash(claimData.bkashNumber || '');
                setIsAlreadyClaimed(true);
                setState('result');
                window.history.replaceState({}, '', window.location.pathname);
                setIsCheckingUrl(false);
                return;
              }
            }
          }
        } catch (err) {
          console.error('Error checking URL pass:', err);
        }

        setState('claim');
        window.history.replaceState({}, '', window.location.pathname);
      }
      setIsCheckingUrl(false);
    };

    checkUrlParams();

    return () => unsub();
  }, []);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      console.error('Login error:', err);
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      setState('landing');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const isAdmin = user?.email === 'akibjabed10112004@gmail.com';

  const renderContent = () => {
    switch (state) {
      case 'landing':
        return (
          <LandingPage
            onStart={(type) => {
              setClaimType(type);
              if (type === 'try') {
                setClaimName('');
                setClaimToken(undefined);
                setClaimBkash('');
              }
              setState('claim');
            }}
            onAdmin={() => {
              if (isAdmin) setState('admin');
              else handleLogin();
            }}
          />
        );
      case 'claim':
        return (
          <ClaimForm
            type={claimType}
            initialName={claimName}
            initialToken={claimToken}
            onBack={() => setState('landing')}
            onSuccess={(name, token, bkash, alreadyClaimedAmount) => {
              setClaimName(name);
              setClaimToken(token);
              setClaimBkash(bkash || '');
              if (alreadyClaimedAmount !== undefined) {
                setWonAmount(alreadyClaimedAmount);
                setIsAlreadyClaimed(true);
                setState('result');
              } else {
                setIsAlreadyClaimed(false);
                setState('spin');
              }
            }}
          />
        );
      case 'spin':
        return (
          <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-12 relative">
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center space-y-6 z-10 mt-12"
            >
              <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full glass-panel text-amber-300 text-xs font-bold uppercase tracking-[0.2em]">
                <Sparkles size={14} className="text-amber-400" />
                Spin to Win
                <Sparkles size={14} className="text-amber-400" />
              </div>
              <h2 className="text-4xl md:text-6xl font-display font-bold text-white tracking-tight">
                Good Luck, <br className="md:hidden" />
                <span className="text-gradient-gold">{claimName}</span>!
              </h2>
              <p className="text-white/50 max-w-sm mx-auto text-lg">
                Your luck decides the salami amount!
              </p>
            </motion.div>

            <div className="relative z-10 flex-1 flex items-center justify-center w-full">
              <Wheel onWin={(amount) => {
                setWonAmount(amount);
                setState('result');
              }} />
            </div>
          </div>
        );
      case 'result':
        return (
          <ResultPage
            type={claimType}
            name={claimName}
            amount={wonAmount}
            token={claimToken}
            bkashNumber={claimBkash}
            isAlreadyClaimed={isAlreadyClaimed}
            onReset={() => setState('landing')}
          />
        );
      case 'admin':
        return <AdminPanel />;
      default:
        return <LandingPage onStart={() => {}} onAdmin={() => {}} />;
    }
  };

  if (loading || isCheckingUrl) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#05010d]">
        <Loader2 className="animate-spin text-amber-500" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#05010d] font-sans relative overflow-hidden">
      {/* Premium Background Effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_var(--tw-gradient-stops))] from-violet-900/20 via-[#05010d] to-[#05010d]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,_var(--tw-gradient-stops))] from-amber-900/10 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-violet-900/10 via-transparent to-transparent opacity-50" />
      </div>

      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 p-6 flex justify-between items-center z-50 pointer-events-none">
        <div className="pointer-events-auto">
          {state === 'spin' && (
            <button
              onClick={() => setState('landing')}
              className="glass-panel p-3 rounded-full hover:bg-white/10 transition-all text-white/70 hover:text-white group"
            >
              <HomeIcon className="group-hover:scale-110 transition-transform" />
            </button>
          )}
        </div>
        <div className="flex gap-3 pointer-events-auto">
          {user ? (
            <div className="flex items-center gap-3 glass-panel p-1.5 pr-5 rounded-full">
              <img src={user.photoURL} alt={user.displayName} className="w-8 h-8 rounded-full border border-white/20" />
              <span className="text-sm font-medium text-white/90 hidden md:inline">{user.displayName}</span>
              <div className="w-px h-4 bg-white/20 mx-1" />
              <button onClick={handleLogout} className="text-white/50 hover:text-red-400 transition-colors">
                <LogOut size={16} />
              </button>
              {isAdmin && state !== 'admin' && (
                <>
                  <div className="w-px h-4 bg-white/20 mx-1" />
                  <button
                    onClick={() => setState('admin')}
                    className="text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-1.5 font-semibold text-xs uppercase tracking-widest"
                  >
                    <ShieldCheck size={16} />
                    Admin
                  </button>
                </>
              )}
            </div>
          ) : (
            state === 'admin' && (
              <button
                onClick={handleLogin}
                className="glass-panel px-6 py-2.5 rounded-full hover:bg-white/10 transition-all flex items-center gap-2 font-semibold text-sm text-white/90 hover:text-white"
              >
                <LogIn size={16} />
                Admin Login
              </button>
            )
          )}
        </div>
      </nav>

      <AnimatePresence mode="wait">
        <motion.div
          key={state}
          initial={{ opacity: 0, y: 10, filter: 'blur(10px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: -10, filter: 'blur(10px)' }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 min-h-screen flex flex-col"
        >
          {renderContent()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function HomeIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  );
}
