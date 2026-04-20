import { db } from './firebase';
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  onSnapshot,
  serverTimestamp,
  orderBy,
} from 'firebase/firestore';

// Add a new task for the user
export const addTask = (userId, taskData) => {
  return addDoc(collection(db, 'tasks'), {
    ...taskData,
    userId,
    completed: false,
    createdAt: serverTimestamp(),
  });
};

// Update an existing task
export const updateTask = (taskId, updatedData) => {
  const taskRef = doc(db, 'tasks', taskId);
  return updateDoc(taskRef, { ...updatedData, updatedAt: serverTimestamp() });
};

// Delete a task
export const deleteTask = (taskId) => {
  const taskRef = doc(db, 'tasks', taskId);
  return deleteDoc(taskRef);
};

// Listen to real-time updates of user's tasks
export const subscribeToTasks = (userId, callback) => {
  const q = query(
    collection(db, 'tasks'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  return onSnapshot(q, (snapshot) => {
    const tasks = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    callback(tasks);
  });
};
