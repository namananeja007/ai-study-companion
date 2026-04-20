import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { addTask, updateTask, deleteTask, subscribeToTasks } from '../services/taskService';
import TaskForm from '../components/TaskForm';
import TaskItem from '../components/TaskItem';

const Planner = () => {
  const { currentUser } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!currentUser) return;
    const unsubscribe = subscribeToTasks(currentUser.uid, (taskList) => {
      setTasks(taskList);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [currentUser]);

  const handleSubmit = useCallback(async (taskData) => {
    setError('');
    try {
      if (editingTask) {
        await updateTask(editingTask.id, taskData);
        setEditingTask(null);
      } else {
        await addTask(currentUser.uid, taskData);
      }
    } catch {
      setError('Failed to save task. Please try again.');
    }
  }, [editingTask, currentUser]);

  const handleDelete = useCallback(async (taskId) => {
    if (!window.confirm('Delete this task?')) return;
    try { await deleteTask(taskId); }
    catch { setError('Failed to delete task.'); }
  }, []);

  const handleToggleComplete = useCallback(async (taskId, currentStatus) => {
    try { await updateTask(taskId, { completed: !currentStatus }); }
    catch { setError('Failed to update task.'); }
  }, []);

  const filteredTasks = tasks.filter((t) => {
    if (filter === 'pending') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  const pendingCount = tasks.filter((t) => !t.completed).length;
  const completedCount = tasks.filter((t) => t.completed).length;

  return (
    <div className="bg-animated min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="mb-8 fade-in">
          <h2 className="text-4xl font-black text-white mb-1">Study Planner</h2>
          <p className="text-slate-400 text-sm">Organize your tasks and stay on track</p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { label: 'Total', value: tasks.length, gradient: 'linear-gradient(135deg,#6366f1,#818cf8)', glow: 'rgba(99,102,241,0.2)' },
            { label: 'Pending', value: pendingCount, gradient: 'linear-gradient(135deg,#f59e0b,#fbbf24)', glow: 'rgba(245,158,11,0.2)' },
            { label: 'Completed', value: completedCount, gradient: 'linear-gradient(135deg,#10b981,#34d399)', glow: 'rgba(16,185,129,0.2)' },
          ].map((s) => (
            <div key={s.label} className="glass p-4 text-center fade-in" style={{ boxShadow: `0 0 30px ${s.glow}` }}>
              <div className="text-3xl font-black text-white">{s.value}</div>
              <div className="text-xs text-slate-400 font-semibold mt-1 uppercase tracking-wider">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-3 text-red-400 text-sm p-4 rounded-xl mb-4"
            style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)' }}>
            ⚠️ {error}
          </div>
        )}

        {/* Task Form */}
        <TaskForm onSubmit={handleSubmit} editingTask={editingTask} onCancelEdit={() => setEditingTask(null)} />

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-4">
          {['all', 'pending', 'completed'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all"
              style={filter === f ? {
                background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
                color: 'white',
                boxShadow: '0 4px 15px rgba(99,102,241,0.35)',
              } : {
                background: 'rgba(255,255,255,0.05)',
                color: '#94a3b8',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Task List */}
        {loading ? (
          <div className="text-center py-16">
            <div className="w-8 h-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin mx-auto mb-3" />
            <p className="text-slate-400 text-sm">Loading tasks...</p>
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="text-center py-16 rounded-2xl" style={{ border: '1px dashed rgba(255,255,255,0.1)' }}>
            <div className="text-5xl mb-3">📝</div>
            <p className="text-slate-400">No tasks found. Add one above!</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filteredTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onEdit={setEditingTask}
                onDelete={handleDelete}
                onToggleComplete={handleToggleComplete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Planner;
