import React, { useState } from 'react';
import axios from 'axios';
import { X, Lock, Mail, User, AlertCircle, ArrowRight } from 'lucide-react';

export default function LoginModal({ isOpen, onClose, onAuthSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const payload = isLogin ? { email, password } : { username, email, password };
    const url = isLogin ? '/api/auth/login' : '/api/auth/register';

    try {
      const res = await axios.post(url, payload);
      onAuthSuccess(res.data);
      onClose();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-md px-4">
      {/* Modal Card */}
      <div className="relative w-full max-w-md glass-panel p-8 rounded-3xl border-slate-800 shadow-2xl relative overflow-hidden animate-soft-glow">
        <div className="absolute -left-16 -top-16 w-36 h-36 bg-violet-600/10 rounded-full blur-2xl"></div>
        <div className="absolute -right-16 -bottom-16 w-36 h-36 bg-cyan-600/10 rounded-full blur-2xl"></div>

        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 p-2 text-slate-500 hover:text-white hover:bg-slate-900/60 rounded-xl transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center space-y-2 mb-6">
          <h2 className="text-xl font-bold tracking-tight text-white">
            {isLogin ? 'Welcome Back Student' : 'Create Prep Account'}
          </h2>
          <p className="text-xs text-slate-400">
            {isLogin ? 'Log in to save exam progress and bookmark questions.' : 'Sign up to build revision logs and map study pathways.'}
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-red-300 flex items-start space-x-2 mb-4">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">Username</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input 
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="e.g. rohan_sharma"
                  className="w-full bg-slate-950/60 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-violet-500 transition-colors"
                  required
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input 
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="student@questiq.in"
                className="w-full bg-slate-950/60 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-violet-500 transition-colors"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input 
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-950/60 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-violet-500 transition-colors"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold rounded-xl shadow-lg shadow-violet-950/30 flex items-center justify-center space-x-1.5 transition-all cursor-pointer"
          >
            <span>{loading ? 'Authenticating...' : isLogin ? 'Sign In' : 'Sign Up'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Footer Toggle */}
        <div className="text-center text-xs text-slate-400 mt-6 pt-4 border-t border-slate-800/80">
          <span>{isLogin ? "Don't have an account? " : "Already have an account? "}</span>
          <button 
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setError(null);
            }}
            className="text-violet-400 hover:text-violet-300 font-bold hover:underline"
          >
            {isLogin ? 'Create Account' : 'Sign In'}
          </button>
        </div>
      </div>
    </div>
  );
}
