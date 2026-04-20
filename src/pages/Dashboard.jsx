import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { subscribeToTasks } from '../services/taskService';
import { subscribeToSessions } from '../services/sessionService';
import { computeAnalytics } from '../services/analyticsService';

const StatCard = ({ icon, label, value, sub, gradient, glow }) => (
  <div className="glass glass-hover p-5 fade-in" style={{ boxShadow: glow }}>
    <div className="flex items-start justify-between mb-3">
      <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl"
        style={{ background: gradient }}>
        {icon}
      </div>
    </div>
    <div className="text-3xl font-black text-white mb-1">{value}</div>
    <div className="text-sm font-medium text-slate-300">{label}</div>
    {sub && <div className="text-xs text-slate-500 mt-0.5">{sub}</div>}
  </div>
);

const WeeklyBar = ({ weeklyData }) => {
  const max = Math.max(...weeklyData.map((d) => d.minutes), 1);
  return (
    <div className="glass p-6">
      <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-5">📅 Weekly Activity</h3>
      <div className="flex items-end gap-2 h-28">
        {weeklyData.map((day, i) => (
          <div key={day.date} className="flex flex-col items-center flex-1 gap-1.5">
            <span className="text-[10px] text-slate-500 font-medium">
              {day.minutes > 0 ? `${day.minutes}m` : ''}
            </span>
            <div className="w-full rounded-xl overflow-hidden" style={{ height: '80px', background: 'rgba(255,255,255,0.05)' }}>
              <div
                className="w-full rounded-xl transition-all duration-700 bar-shimmer"
                style={{
                  height: `${(day.minutes / max) * 100}%`,
                  minHeight: day.minutes > 0 ? '6px' : '0',
                  marginTop: 'auto',
                  display: 'flex',
                  alignItems: 'flex-end',
                }}
              />
            </div>
            <span className="text-[11px] text-slate-500 font-semibold">{day.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const SubjectBreakdown = ({ subjectTime }) => {
  const total = Object.values(subjectTime).reduce((a, b) => a + b, 0) || 1;
  const colors = [
    'linear-gradient(90deg,#6366f1,#818cf8)',
    'linear-gradient(90deg,#8b5cf6,#a78bfa)',
    'linear-gradient(90deg,#3b82f6,#60a5fa)',
    'linear-gradient(90deg,#10b981,#34d399)',
    'linear-gradient(90deg,#f59e0b,#fbbf24)',
    'linear-gradient(90deg,#ef4444,#f87171)',
    'linear-gradient(90deg,#ec4899,#f472b6)',
  ];
  return (
    <div className="glass p-6">
      <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-5">📚 Subject Breakdown</h3>
      {Object.keys(subjectTime).length === 0 ? (
        <div className="text-center py-8">
          <div className="text-3xl mb-2">📖</div>
          <p className="text-sm text-slate-500">No sessions yet. Start the Focus Timer!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {Object.entries(subjectTime)
            .sort(([, a], [, b]) => b - a)
            .map(([subject, mins], i) => (
              <div key={subject}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="font-medium text-slate-300">{subject}</span>
                  <span className="text-slate-500 text-xs">{mins} min</span>
                </div>
                <div className="w-full h-2 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
                  <div
                    className="h-2 rounded-full transition-all duration-700"
                    style={{ width: `${(mins / total) * 100}%`, background: colors[i % colors.length] }}
                  />
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return;
    let t = false, s = false;
    const done = () => { if (t && s) setLoading(false); };
    const u1 = subscribeToTasks(currentUser.uid, (d) => { setTasks(d); t = true; done(); });
    const u2 = subscribeToSessions(currentUser.uid, (d) => { setSessions(d); s = true; done(); });
    return () => { u1(); u2(); };
  }, [currentUser]);

  const analytics = useMemo(() => computeAnalytics(tasks, sessions), [tasks, sessions]);
  const pendingTasks = useMemo(() => tasks.filter((t) => !t.completed), [tasks]);

  const totalHours = Math.floor(analytics.totalMinutes / 60);
  const totalMins = analytics.totalMinutes % 60;
  const greeting = new Date().getHours() < 12 ? 'Good morning' : new Date().getHours() < 17 ? 'Good afternoon' : 'Good evening';

  if (loading) {
    return (
      <div className="bg-animated min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
          <p className="text-slate-400 text-sm">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-animated min-h-screen">
      <div className="max-w-5xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="mb-8 fade-in">
          <p className="text-slate-400 text-sm mb-1">{greeting} 👋</p>
          <h2 className="text-4xl font-black text-white mb-1">
            {currentUser?.email?.split('@')[0]}
          </h2>
          <p className="text-slate-500 text-sm">Here's your study overview for today</p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard icon="⏱️" label="Study Time" value={`${totalHours}h ${totalMins}m`}
            gradient="linear-gradient(135deg,#6366f1,#818cf8)" glow="0 0 30px rgba(99,102,241,0.2)" />
          <StatCard icon="✅" label="Completed" value={tasks.filter((t) => t.completed).length}
            sub={`of ${tasks.length} tasks`} gradient="linear-gradient(135deg,#10b981,#34d399)" glow="0 0 30px rgba(16,185,129,0.15)" />
          <StatCard icon="📋" label="Pending" value={pendingTasks.length}
            gradient="linear-gradient(135deg,#f59e0b,#fbbf24)" glow="0 0 30px rgba(245,158,11,0.15)" />
          <StatCard icon="🍅" label="Pomodoros" value={sessions.length}
            gradient="linear-gradient(135deg,#ef4444,#f87171)" glow="0 0 30px rgba(239,68,68,0.15)" />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <WeeklyBar weeklyData={analytics.weeklyData} />
          <SubjectBreakdown subjectTime={analytics.subjectTime} />
        </div>

        {/* Weak Areas + Suggestions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="glass p-6">
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-4">📉 Weak Areas</h3>
            {analytics.allWeakAreas.length === 0 ? (
              <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)' }}>
                <span>🎉</span>
                <span className="text-sm text-emerald-400">No weak areas! Keep it up.</span>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {analytics.allWeakAreas.map((s) => (
                  <span key={s} className="px-3 py-1 text-xs font-semibold text-red-400 rounded-full"
                    style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)' }}>
                    ⚠️ {s}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="glass p-6">
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-4">🤖 Smart Suggestions</h3>
            <div className="space-y-2">
              {analytics.suggestions.map((s, i) => (
                <div key={i} className="text-sm text-slate-300 p-3 rounded-xl"
                  style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)' }}>
                  {s}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Upcoming Tasks */}
        {pendingTasks.length > 0 && (
          <div className="glass p-6 fade-in">
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-4">🗂️ Upcoming Tasks</h3>
            <div className="space-y-2">
              {pendingTasks.slice(0, 5).map((task) => {
                const pColor = { high: '#ef4444', medium: '#f59e0b', low: '#10b981' }[task.priority] || '#6366f1';
                return (
                  <div key={task.id} className="flex items-center gap-3 p-3 rounded-xl transition-all hover:bg-white/5"
                    style={{ border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div className="w-2 h-2 rounded-full shrink-0" style={{ background: pColor, boxShadow: `0 0 8px ${pColor}` }} />
                    <span className="text-sm text-slate-200 flex-1 font-medium">{task.title}</span>
                    <span className="text-xs text-slate-500 shrink-0">{task.subject}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
