import React from 'react';

const PRIORITY_CONFIG = {
  high:   { label: 'High',   color: '#ef4444', bg: 'rgba(239,68,68,0.1)',   border: 'rgba(239,68,68,0.3)'   },
  medium: { label: 'Medium', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)',  border: 'rgba(245,158,11,0.3)'  },
  low:    { label: 'Low',    color: '#10b981', bg: 'rgba(16,185,129,0.1)',  border: 'rgba(16,185,129,0.3)'  },
};

const TaskItem = ({ task, onEdit, onDelete, onToggleComplete }) => {
  const isOverdue = task.dueDate && !task.completed && new Date(task.dueDate) < new Date();
  const p = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.medium;

  return (
    <div
      className="glass glass-hover p-4 flex flex-col sm:flex-row sm:items-start gap-3 fade-in"
      style={{ opacity: task.completed ? 0.55 : 1 }}
    >
      {/* Checkbox */}
      <div className="flex items-center pt-0.5">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggleComplete(task.id, task.completed)}
          className="w-5 h-5 rounded accent-indigo-500 cursor-pointer shrink-0"
        />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-1.5">
          <span className={`text-sm font-semibold ${task.completed ? 'line-through text-slate-500' : 'text-white'}`}>
            {task.title}
          </span>
          <span className="text-xs px-2.5 py-0.5 rounded-full font-bold"
            style={{ color: p.color, background: p.bg, border: `1px solid ${p.border}` }}>
            {p.label}
          </span>
          {isOverdue && (
            <span className="text-xs px-2.5 py-0.5 rounded-full font-bold priority-high"
              style={{ color: '#ef4444', background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.4)' }}>
              ⚠️ Overdue
            </span>
          )}
        </div>
        <div className="flex flex-wrap gap-3 text-xs text-slate-500">
          <span>📚 {task.subject}</span>
          {task.dueDate && <span className={isOverdue ? 'text-red-400' : ''}>📅 {task.dueDate}</span>}
          {task.notes && <span>📝 {task.notes}</span>}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 shrink-0">
        <button onClick={() => onEdit(task)}
          className="px-3 py-1.5 text-xs font-semibold text-indigo-400 rounded-xl hover:text-indigo-300 transition-all"
          style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.25)' }}>
          Edit
        </button>
        <button onClick={() => onDelete(task.id)}
          className="px-3 py-1.5 text-xs font-semibold text-red-400 rounded-xl hover:text-red-300 transition-all"
          style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)' }}>
          Delete
        </button>
      </div>
    </div>
  );
};

export default TaskItem;
