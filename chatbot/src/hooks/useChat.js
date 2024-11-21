import { useState, useEffect } from 'react';
import { collection, addDoc, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';

export function useChat() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser) return;

    const q = query(
      collection(db, 'messages'),
      where('userId', '==', currentUser.uid),
      orderBy('timestamp', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messageList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        isUser: doc.data().sender === 'user'
      }));
      setMessages(messageList);
      setLoading(false);
    });

    return unsubscribe;
  }, [currentUser]);

  const sendMessage = async ({ content, sessionId, subject, type }) => {
    try {
      const messageData = {
        content,
        userId: currentUser.uid,
        sessionId,
        subject,
        type,
        sender: 'user',
        timestamp: new Date()
      };
  
      await addDoc(collection(db, 'messages'), messageData);
  
      // Call your API here
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: content, subject, type }),
      });
  
      const aiResponse = await response.json();
      await addDoc(collection(db, 'messages'), {
        content: aiResponse.reply,
        userId: currentUser.uid,
        sessionId,
        subject,
        type,
        sender: 'ai',
        timestamp: new Date()
      });
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  };

  // Placeholder for AI response generation
  const generateAIResponse = async (message, context) => {
    // Implement your AI service integration here
    return `AI response to: ${message}`;
  };

  return {
    messages,
    loading,
    sendMessage
  };
}