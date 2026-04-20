import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../services/firebase';
import Antigravity from '../components/Antigravity';
import DotGrid from '../components/DotGrid';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) return setError('Passwords do not match.');
    if (password.length < 6) return setError('Password must be at least 6 characters.');
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate('/');
    } catch (err) {
      const msgs = {
        'auth/email-already-in-use': 'This email is already registered.',
        'auth/invalid-email': 'Please enter a valid email address.',
        'auth/weak-password': 'Password should be at least 6 characters.',
      };
      setError(msgs[err.code] || 'Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: '#0a0a0f' }}>
      {/* Antigravity particle background */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <DotGrid 
          dotSize={3} 
          gap={25} 
          baseColor="#1e1e2e" 
          activeColor="#a78bfa" 
          proximity={150}
        />
        <Antigravity
          count={860}
          magnetRadius={25}
          ringRadius={15}
          waveSpeed={1.2}
          waveAmplitude={3.5}
          particleSize={2}
          lerpSpeed={0.1}
          color="#FF9FFC"
          autoAnimate={true}
          particleVariance={1}
          rotationSpeed={0.5}
          depthFactor={1.8}
          pulseSpeed={4}
          particleShape="capsule"
          fieldStrength={10}
        />
        {/* Subtle spotlight overlay */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.05)_0%,transparent_70%)]" />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-12 pointer-events-none">
        <div className="w-full max-w-md fade-in pointer-events-auto">

          {/* Logo */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl mb-5"
              style={{ background: 'linear-gradient(135deg,#6366f1,#a78bfa)', boxShadow: '0 8px 32px rgba(99,102,241,0.4)' }}>
              <span className="text-4xl">🧠</span>
            </div>
            <h1 className="text-4xl font-black gradient-text mb-2">AI Study Companion</h1>
            <p className="text-slate-400 text-sm">Start your smarter study journey today</p>
          </div>

          {/* Card */}
          <div className="glass p-8 float-card neon-card">
            <h2 className="text-xl font-bold text-white mb-1">Create your account 🚀</h2>
            <p className="text-slate-400 text-sm mb-7">Join thousands of students studying smarter</p>

            {error && (
              <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/30 text-red-400 text-sm p-4 rounded-xl mb-6">
                <span>⚠️</span> {error}
              </div>
            )}

            <form onSubmit={handleSignup} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Email</label>
                <input id="signup-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="input-dark" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Password</label>
                <input id="signup-password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Minimum 6 characters" className="input-dark" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Confirm Password</label>
                <input id="signup-confirm" type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Repeat password" className="input-dark" />
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full mt-2 text-base">
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                    </svg>
                    Creating account...
                  </span>
                ) : 'Create Account →'}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-white/5 text-center">
              <p className="text-slate-500 text-sm">
                Already have an account?{' '}
                <Link to="/login" className="text-indigo-400 font-semibold hover:text-indigo-300 transition-colors">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
