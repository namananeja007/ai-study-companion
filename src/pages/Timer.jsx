import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { saveSession } from '../services/sessionService';

const SUBJECTS = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'Computer Science', 'English', 'History', 'Geography', 'Other'];
const WORK_MINUTES = 25;
const BREAK_MINUTES = 5;

const Timer = () => {
  const { currentUser } = useAuth();
  const [mode, setMode] = useState('work');
  const [timeLeft, setTimeLeft] = useState(WORK_MINUTES * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [subject, setSubject] = useState('Mathematics');
  const [completedSessions, setCompletedSessions] = useState(0);
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState('');
  const intervalRef = useRef(null);

  const totalSeconds = mode === 'work' ? WORK_MINUTES * 60 : BREAK_MINUTES * 60;
  const minutes = String(Math.floor(timeLeft / 60)).padStart(2, '0');
  const seconds = String(timeLeft % 60).padStart(2, '0');
  const progress = ((totalSeconds - timeLeft) / totalSeconds) * 100;
  const circumference = 2 * Math.PI * 45;
  const strokeOffset = circumference - (progress / 100) * circumference;

  useEffect(() => { return () => clearInterval(intervalRef.current); }, []);

  useEffect(() => {
    if (!isRunning) return;
    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          handleTimerComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [isRunning, mode]);

  const handleTimerComplete = useCallback(async () => {
    setIsRunning(false);
    if (mode === 'work') {
      setCompletedSessions((s) => s + 1);
      setSaving(true);
      try {
        await saveSession(currentUser.uid, {
          subject,
          durationMinutes: WORK_MINUTES,
          type: 'pomodoro',
          date: new Date().toISOString().split('T')[0],
        });
        setSavedMsg('✅ Session saved!');
        setTimeout(() => setSavedMsg(''), 3000);
      } catch {
        setSavedMsg('⚠️ Failed to save');
      } finally {
        setSaving(false);
      }
    }
  }, [mode, subject, currentUser]);

  const handleStart = useCallback(() => { if (timeLeft > 0) setIsRunning(true); }, [timeLeft]);
  const handlePause = useCallback(() => { clearInterval(intervalRef.current); setIsRunning(false); }, []);
  const handleReset = useCallback(() => {
    clearInterval(intervalRef.current);
    setIsRunning(false);
    setTimeLeft(mode === 'work' ? WORK_MINUTES * 60 : BREAK_MINUTES * 60);
  }, [mode]);

  const switchMode = useCallback((newMode) => {
    clearInterval(intervalRef.current);
    setIsRunning(false);
    setMode(newMode);
    setTimeLeft(newMode === 'work' ? WORK_MINUTES * 60 : BREAK_MINUTES * 60);
  }, []);

  const accentColor = mode === 'work' ? '#6366f1' : '#10b981';
  const accentGlow = mode === 'work' ? 'rgba(99,102,241,0.4)' : 'rgba(16,185,129,0.35)';

  return (
    <div className="bg-animated min-h-screen">
      <div className="max-w-xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="mb-8 fade-in">
          <h2 className="text-4xl font-black text-white mb-1">Focus Timer</h2>
          <p className="text-slate-400 text-sm">Deep work with the Pomodoro technique</p>
        </div>

        {/* Mode Toggle */}
        <div className="flex gap-3 mb-8 p-1.5 rounded-2xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
          {[
            { key: 'work',  label: '🎯 Focus', sub: '25 min' },
            { key: 'break', label: '☕ Break',  sub: '5 min'  },
          ].map(({ key, label, sub }) => (
            <button key={key} onClick={() => switchMode(key)}
              className="flex-1 py-2.5 rounded-xl text-sm font-bold transition-all"
              style={mode === key ? {
                background: key === 'work' ? 'linear-gradient(135deg,#6366f1,#8b5cf6)' : 'linear-gradient(135deg,#10b981,#34d399)',
                color: 'white',
                boxShadow: `0 4px 20px ${accentGlow}`,
              } : { color: '#64748b' }}>
              {label} <span className="text-xs opacity-70 ml-1">{sub}</span>
            </button>
          ))}
        </div>

        {/* Subject */}
        <div className="mb-8">
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Studying</label>
          <select value={subject} onChange={(e) => setSubject(e.target.value)} className="input-dark">
            {SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        {/* Circle Timer */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative w-64 h-64">
            {/* Outer glow ring */}
            <div className="absolute inset-0 rounded-full opacity-20 animate-pulse"
              style={{ boxShadow: `0 0 80px 20px ${accentColor}`, borderRadius: '50%' }} />

            <svg className="w-full h-full -rotate-90 drop-shadow-2xl" viewBox="0 0 100 100">
              {/* Track */}
              <circle cx="50" cy="50" r="45" fill="none"
                stroke="rgba(255,255,255,0.06)" strokeWidth="5" />
              {/* Progress */}
              <circle cx="50" cy="50" r="45" fill="none"
                stroke={accentColor}
                strokeWidth="5"
                strokeDasharray={circumference}
                strokeDashoffset={strokeOffset}
                strokeLinecap="round"
                style={{ filter: `drop-shadow(0 0 8px ${accentColor})`, transition: 'stroke-dashoffset 1s linear, stroke 0.3s' }}
              />
            </svg>

            {/* Time display */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-6xl font-black text-white font-mono tracking-tight">
                {minutes}:{seconds}
              </span>
              <span className="text-xs text-slate-400 uppercase tracking-widest mt-1">
                {mode === 'work' ? 'Focus' : 'Break'}
              </span>
              {savedMsg && (
                <span className="text-xs text-emerald-400 mt-2 font-medium">{savedMsg}</span>
              )}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-4 mb-8">
          {!isRunning ? (
            <button onClick={handleStart} disabled={timeLeft === 0} className="btn-primary px-10 py-3.5 text-base"
              style={{ background: `linear-gradient(135deg, ${accentColor}, ${mode === 'work' ? '#8b5cf6' : '#34d399'})`, boxShadow: `0 6px 24px ${accentGlow}` }}>
              {timeLeft === totalSeconds ? '▶ Start' : '▶ Resume'}
            </button>
          ) : (
            <button onClick={handlePause}
              className="btn-primary px-10 py-3.5 text-base"
              style={{ background: 'linear-gradient(135deg,#f59e0b,#fbbf24)', boxShadow: '0 6px 24px rgba(245,158,11,0.4)' }}>
              ⏸ Pause
            </button>
          )}
          <button onClick={handleReset}
            className="px-6 py-3.5 text-sm font-bold text-slate-400 rounded-2xl hover:text-slate-200 transition-all"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
            ↺ Reset
          </button>
        </div>

        {/* Session Count */}
        <div className="glass p-5 text-center mb-4">
          <div className="text-3xl font-black gradient-text mb-1">{completedSessions}</div>
          <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">🍅 Sessions completed today</div>
          <div className="flex justify-center gap-1 mt-3">
            {Array.from({ length: Math.max(completedSessions, 4) }).map((_, i) => (
              <div key={i} className="w-3 h-3 rounded-full transition-all"
                style={{ background: i < completedSessions ? accentColor : 'rgba(255,255,255,0.1)', boxShadow: i < completedSessions ? `0 0 6px ${accentColor}` : 'none' }} />
            ))}
          </div>
        </div>

        {/* Tip */}
        <div className="p-4 rounded-2xl text-sm" style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)' }}>
          <span className="text-indigo-400 font-bold">💡 Tip:</span>{' '}
          <span className="text-slate-400">After 4 sessions, take a longer 15–30 min break. Consistency beats intensity!</span>
        </div>
      </div>
    </div>
  );
};

export default Timer;