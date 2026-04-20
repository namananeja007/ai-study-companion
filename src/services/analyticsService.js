import { useMemo } from 'react';

/**
 * Compute analytics from tasks and sessions.
 * Uses useMemo-ready pure functions so the consumer can memoize results.
 */
export const computeAnalytics = (tasks, sessions) => {
  // Total study time (minutes)
  const totalMinutes = sessions.reduce((acc, s) => acc + (s.durationMinutes || 0), 0);

  // Subject-wise time breakdown
  const subjectTime = sessions.reduce((acc, s) => {
    acc[s.subject] = (acc[s.subject] || 0) + (s.durationMinutes || 0);
    return acc;
  }, {});

  // Weekly progress — last 7 days
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().split('T')[0];
  });

  const weeklyData = last7Days.map((date) => ({
    date,
    label: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
    minutes: sessions
      .filter((s) => s.date === date)
      .reduce((acc, s) => acc + (s.durationMinutes || 0), 0),
  }));

  // Weak areas: subjects with low study time (below average, or incomplete tasks)
  const avgTime =
    Object.values(subjectTime).length > 0
      ? Object.values(subjectTime).reduce((a, b) => a + b, 0) / Object.values(subjectTime).length
      : 0;

  const weakSubjects = Object.entries(subjectTime)
    .filter(([, mins]) => mins < avgTime)
    .map(([subject]) => subject);

  // Subjects with incomplete tasks but no study time
  const subjectsWithPendingTasks = [
    ...new Set(tasks.filter((t) => !t.completed).map((t) => t.subject)),
  ];
  const unstudiedSubjects = subjectsWithPendingTasks.filter((s) => !subjectTime[s]);

  const allWeakAreas = [...new Set([...weakSubjects, ...unstudiedSubjects])];

  // Smart suggestions
  const suggestions = [];

  // Pending high-priority tasks
  const highPriority = tasks.filter((t) => !t.completed && t.priority === 'high');
  if (highPriority.length > 0) {
    suggestions.push(`🔴 You have ${highPriority.length} high-priority task(s) pending — tackle them first!`);
  }

  // Overdue tasks
  const today = new Date().toISOString().split('T')[0];
  const overdue = tasks.filter((t) => !t.completed && t.dueDate && t.dueDate < today);
  if (overdue.length > 0) {
    suggestions.push(`⚠️ ${overdue.length} task(s) are overdue. Review and reschedule.`);
  }

  // Weak areas
  if (allWeakAreas.length > 0) {
    suggestions.push(`📉 Focus more on: ${allWeakAreas.slice(0, 3).join(', ')}`);
  }

  // If no sessions today
  const studiedToday = sessions.some((s) => s.date === today);
  if (!studiedToday) {
    suggestions.push(`🌅 You haven't studied today yet. Start with a 25-min Pomodoro!`);
  }

  // Default suggestion
  if (suggestions.length === 0) {
    suggestions.push('🎉 Great work! Keep maintaining your study streak.');
  }

  return { totalMinutes, subjectTime, weeklyData, allWeakAreas, suggestions };
};
