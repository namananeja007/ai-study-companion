import { db } from './firebase';
import {
  collection,
  addDoc,
  query,
  where,
  onSnapshot,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';

// Save a completed Pomodoro session to Firestore
export const saveSession = (userId, sessionData) => {
  return addDoc(collection(db, 'sessions'), {
    ...sessionData,
    userId,
    createdAt: serverTimestamp(),
  });
};

// Real-time listener for user sessions
export const subscribeToSessions = (userId, callback) => {
  const q = query(
    collection(db, 'sessions'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  return onSnapshot(q, (snapshot) => {
    const sessions = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    callback(sessions);
  });
};
