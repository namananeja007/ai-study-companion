import React, { useState, useEffect } from 'react';

const SUBJECTS = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'Computer Science', 'English', 'History', 'Geography', 'Other'];

const TaskForm = ({ onSubmit, editingTask, onCancelEdit }) => {
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('Mathematics');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title || '');
      setSubject(editingTask.subject || 'Mathematics');
      setPriority(editingTask.priority || 'medium');
      setDueDate(editingTask.dueDate || '');
      setNotes(editingTask.notes || '');
    } else {
      resetForm();
    }
  }, [editingTask]);

  const resetForm = () => {
    setTitle('');
    setSubject('Mathematics');
    setPriority('medium');
    setDueDate('');
    setNotes('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit({ title, subject, priority, dueDate, notes });
      resetForm();
    } finally {
      setLoading(false);
    }
  };

  const labelClass = "block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2";

  return (
    <form onSubmit={handleSubmit} className="glass p-6 mb-6 fade-in">
      <h3 className="text-base font-bold text-white mb-5">
        {editingTask ? '✏️ Edit Task' : '➕ New Task'}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className={labelClass}>Task Title *</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Solve Chapter 5 exercises"
            className="input-dark"
          />
        </div>
        <div>
          <label className={labelClass}>Subject</label>
          <select value={subject} onChange={(e) => setSubject(e.target.value)} className="input-dark">
            {SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className={labelClass}>Priority</label>
          <select value={priority} onChange={(e) => setPriority(e.target.value)} className="input-dark">
            <option value="low">🟢 Low</option>
            <option value="medium">🟡 Medium</option>
            <option value="high">🔴 High</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>Due Date</label>
          <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="input-dark" />
        </div>
        <div>
          <label className={labelClass}>Notes</label>
          <input type="text" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Optional notes..." className="input-dark" />
        </div>
      </div>
      <div className="flex gap-3 mt-5">
        <button type="submit" disabled={loading} className="btn-primary text-sm">
          {loading ? 'Saving...' : editingTask ? 'Update Task' : 'Add Task'}
        </button>
        {editingTask && (
          <button type="button" onClick={onCancelEdit}
            className="px-5 py-2.5 text-sm font-semibold text-slate-400 rounded-xl hover:text-slate-200 transition-all"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default TaskForm;
