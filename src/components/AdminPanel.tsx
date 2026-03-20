import React, { useState, useEffect } from 'react';
import { db, collection, getDocs, addDoc, updateDoc, doc, query, orderBy, onSnapshot, deleteDoc } from '../firebase';
import { Pass, Claim } from '../types';
import { Timestamp } from 'firebase/firestore';
import { Trash2, CheckCircle, Plus, RefreshCw, Copy, Link as LinkIcon, Check } from 'lucide-react';

export default function AdminPanel() {
  const [passes, setPasses] = useState<Pass[]>([]);
  const [claims, setClaims] = useState<Claim[]>([]);
  const [newName, setNewName] = useState('');
  const [newToken, setNewToken] = useState('');
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const APP_URL = window.location.origin;

  useEffect(() => {
    const qPasses = query(collection(db, 'passes'), orderBy('createdAt', 'desc'));
    const unsubPasses = onSnapshot(qPasses, (snap) => {
      setPasses(snap.docs.map(d => ({ id: d.id, ...d.data() } as Pass)));
    });

    const qClaims = query(collection(db, 'claims'), orderBy('claimedAt', 'desc'));
    const unsubClaims = onSnapshot(qClaims, (snap) => {
      setClaims(snap.docs.map(d => ({ id: d.id, ...d.data() } as Claim)));
      setLoading(false);
    });

    return () => {
      unsubPasses();
      unsubClaims();
    };
  }, []);

  const generateToken = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let token = '';
    for (let i = 0; i < 6; i++) {
      token += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setNewToken(token);
  };

  const addPass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newToken) return;

    try {
      await addDoc(collection(db, 'passes'), {
        name: newName,
        token: newToken,
        isUsed: false,
        createdAt: Timestamp.now()
      });
      setNewName('');
      setNewToken('');
    } catch (err) {
      console.error('Error adding pass:', err);
    }
  };

  const markAsPaid = async (claimId: string) => {
    try {
      await updateDoc(doc(db, 'claims', claimId), {
        status: 'paid'
      });
    } catch (err) {
      console.error('Error updating claim:', err);
    }
  };

  const deleteClaim = async (claimId: string) => {
    if (!window.confirm('Are you sure you want to delete this claim?')) return;
    try {
      await deleteDoc(doc(db, 'claims', claimId));
    } catch (err) {
      console.error('Error deleting claim:', err);
    }
  };

  const deletePass = async (passId: string) => {
    if (!window.confirm('Are you sure you want to delete this pass?')) return;
    try {
      await deleteDoc(doc(db, 'passes', passId));
    } catch (err) {
      console.error('Error deleting pass:', err);
    }
  };

  const reEnablePass = async (passId: string) => {
    try {
      await updateDoc(doc(db, 'passes', passId), {
        isUsed: false
      });
    } catch (err) {
      console.error('Error re-enabling pass:', err);
    }
  };

  const copyClaimLink = (pass: Pass) => {
    const link = `${APP_URL}?name=${encodeURIComponent(pass.name)}&token=${encodeURIComponent(pass.token)}`;
    navigator.clipboard.writeText(link);
    setCopiedId(pass.id!);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center p-8 text-center text-white/50 font-medium">Loading Admin Panel...</div>;

  return (
    <div className="max-w-7xl mx-auto w-full p-4 md:p-8 space-y-8 min-h-screen text-white/90 relative z-10 overflow-x-hidden">
      <header className="border-b border-white/10 pb-6 pt-20 md:pt-8">
        <h1 className="text-4xl font-display font-bold text-white tracking-tight">Eid Salami <span className="text-gradient-gold">Admin</span></h1>
        <p className="text-white/50 font-medium mt-2">Manage passes and view claims</p>
      </header>

      <section className="grid lg:grid-cols-2 gap-4 md:gap-8 w-full">
        <div className="glass-panel p-5 md:p-8 rounded-[2rem] space-y-6 w-full overflow-hidden">
          <h2 className="text-2xl font-display font-bold flex items-center gap-3 text-white">
            <Plus className="text-amber-400" /> Create New Pass
          </h2>
          <form onSubmit={addPass} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-2 ml-1">Recipient Name</label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="block w-full rounded-xl bg-black/20 border border-white/10 text-white focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 p-4 transition-all placeholder-white/20"
                placeholder="e.g. Abir"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-2 ml-1">Pass Token</label>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={newToken}
                  onChange={(e) => setNewToken(e.target.value.toUpperCase())}
                  className="block w-full rounded-xl bg-black/20 border border-white/10 text-white focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 p-4 transition-all placeholder-white/20 font-mono tracking-widest"
                  placeholder="6-DIGIT CODE"
                  required
                />
                <button
                  type="button"
                  onClick={generateToken}
                  className="p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors text-white border border-white/10"
                  title="Generate Random Token"
                >
                  <RefreshCw size={20} />
                </button>
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-gold text-black py-4 rounded-xl font-bold text-lg hover:shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all shadow-lg border border-amber-300/50 transform hover:-translate-y-0.5"
            >
              Create Pass
            </button>
          </form>
        </div>

        <div className="glass-panel p-5 md:p-8 rounded-[2rem] space-y-6 flex flex-col h-[500px] w-full overflow-hidden">
          <h2 className="text-2xl font-display font-bold text-white">Active Passes ({passes.length})</h2>
          <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
            {passes.map((pass) => (
              <div key={pass.id} className="bg-black/20 p-4 md:p-5 rounded-2xl border border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 hover:border-white/10 transition-all group">
                <div className="flex-1 w-full">
                  <p className="font-bold text-white text-lg">{pass.name}</p>
                  <p className="text-sm font-mono text-amber-400/80 flex items-center gap-2 mt-1 font-medium tracking-widest">
                    {pass.token}
                    <button onClick={() => navigator.clipboard.writeText(pass.token)} className="text-white/30 hover:text-white transition-colors opacity-100 sm:opacity-0 group-hover:opacity-100">
                      <Copy size={14} />
                    </button>
                  </p>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end mt-2 sm:mt-0 pt-3 sm:pt-0 border-t border-white/5 sm:border-0">
                  <button
                    onClick={() => copyClaimLink(pass)}
                    className={`p-2.5 rounded-xl transition-all flex items-center gap-1.5 text-xs font-bold uppercase ${
                      copiedId === pass.id 
                        ? 'bg-amber-400 text-black' 
                        : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/10'
                    }`}
                    title="Copy Claim Link"
                  >
                    {copiedId === pass.id ? <Check size={14} /> : <LinkIcon size={14} />}
                    {copiedId === pass.id ? 'Copied' : 'Link'}
                  </button>
                  <span className={`text-[10px] px-3 py-1.5 rounded-full font-bold uppercase tracking-widest ${pass.isUsed ? 'bg-white/5 text-white/30 border border-white/5' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}`}>
                    {pass.isUsed ? 'Used' : 'Available'}
                  </span>
                  {pass.isUsed && (
                    <button
                      onClick={() => reEnablePass(pass.id!)}
                      className="p-2 bg-white/5 text-white/50 hover:text-amber-400 hover:bg-amber-500/10 rounded-lg transition-colors border border-transparent hover:border-amber-500/20"
                      title="Re-enable Pass"
                    >
                      <RefreshCw size={14} />
                    </button>
                  )}
                  <button
                    onClick={() => deletePass(pass.id!)}
                    className="p-2 bg-white/5 text-white/50 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors border border-transparent hover:border-red-500/20"
                    title="Delete Pass"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
            {passes.length === 0 && (
              <div className="h-full flex items-center justify-center text-white/30 font-medium">
                No passes created yet.
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="glass-panel p-5 md:p-8 rounded-[2rem] space-y-6 w-full overflow-hidden">
        <h2 className="text-2xl font-display font-bold text-white">Claims Data ({claims.length})</h2>
        <div className="overflow-x-auto rounded-2xl border border-white/10 bg-black/20 w-full">
          <table className="min-w-full divide-y divide-white/10">
            <thead className="bg-white/5">
              <tr>
                <th className="px-6 py-5 text-left text-xs font-bold text-white/50 uppercase tracking-wider">Name</th>
                <th className="px-6 py-5 text-left text-xs font-bold text-white/50 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-5 text-left text-xs font-bold text-white/50 uppercase tracking-wider">bKash</th>
                <th className="px-6 py-5 text-left text-xs font-bold text-white/50 uppercase tracking-wider">Date</th>
                <th className="px-6 py-5 text-left text-xs font-bold text-white/50 uppercase tracking-wider">Status</th>
                <th className="px-6 py-5 text-left text-xs font-bold text-white/50 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {claims.map((claim) => (
                <tr key={claim.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-5 whitespace-nowrap text-sm font-semibold text-white">{claim.name}</td>
                  <td className="px-6 py-5 whitespace-nowrap text-sm text-amber-400 font-bold">{claim.amount} ৳</td>
                  <td className="px-6 py-5 whitespace-nowrap text-sm text-white/70 font-mono tracking-wider">{claim.bkashNumber}</td>
                  <td className="px-6 py-5 whitespace-nowrap text-sm text-white/50 font-medium">
                    {claim.claimedAt instanceof Timestamp ? claim.claimedAt.toDate().toLocaleDateString() : new Date(claim.claimedAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <span className={`px-3 py-1.5 inline-flex text-[10px] leading-5 font-bold rounded-full uppercase tracking-widest ${
                      claim.status === 'paid' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}>
                      {claim.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      {claim.status === 'pending' && (
                        <button
                          onClick={() => markAsPaid(claim.id!)}
                          className="text-amber-400 hover:text-amber-300 flex items-center gap-1.5 transition-colors font-semibold bg-amber-500/10 px-3 py-1.5 rounded-lg hover:bg-amber-500/20"
                        >
                          <CheckCircle size={16} /> Mark Paid
                        </button>
                      )}
                      <button
                        onClick={() => deleteClaim(claim.id!)}
                        className="text-white/50 hover:text-red-400 p-1.5 rounded-lg hover:bg-red-500/10 transition-colors"
                        title="Delete Claim"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {claims.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-white/30 font-medium">
                    No claims yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
