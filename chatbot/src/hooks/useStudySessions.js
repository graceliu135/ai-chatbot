import { useState, useEffect } from 'react';
import { collection, addDoc, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';

export function useStudySessions() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    loadSessions();
  }, [currentUser]);

  const loadSessions = async () => {
    try {
      const q = query(
        collection(db, 'studySessions'),
        where('userId', '==', currentUser.uid),
        orderBy('startDate', 'desc')
      );
      
      const snapshot = await getDocs(q);
      const sessionList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setSessions(sessionList);
      setLoading(false);
    } catch (error) {
      console.error('Error loading sessions:', error);
      setLoading(false);
    }
  };

  const createSession = async ({
    type,
    subject,
    startDate,
    endDate = null,
    isLongTerm,
    description = ''
  }) => {
    try {
      const sessionData = {
        userId: currentUser.uid,
        type,
        subject,
        startDate,
        endDate,
        isLongTerm,
        description,
        createdAt: new Date(),
        status: 'active'
      };

      await addDoc(collection(db, 'studySessions'), sessionData);
      await loadSessions();
    } catch (error) {
      console.error('Error creating session:', error);
      throw error;
    }
  };

  return {
    sessions,
    loading,
    createSession,
    refreshSessions: loadSessions
  };
}