import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Box,
  VStack,
  HStack,
  Input,
  Button,
  Select,
  Text,
  Divider,
  useToast,
  Badge,
} from '@chakra-ui/react';
import { useChat } from '../hooks/useChat';
import { useStudySessions } from '../hooks/useStudySessions';

export function Chat() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session');
  const [message, setMessage] = useState('');
  const [currentSession, setCurrentSession] = useState(null);
  const chatEndRef = useRef(null);
  const toast = useToast();
  
  const { messages, loading, sendMessage } = useChat();
  const { sessions } = useStudySessions();

  useEffect(() => {
    if (sessionId && sessions.length > 0) {
      const session = sessions.find(s => s.id === sessionId);
      if (session) {
        setCurrentSession(session);
      }
    }
  }, [sessionId, sessions]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!message.trim()) return;

    try {
      await sendMessage({
        content: message,
        sessionId: currentSession?.id,
        subject: currentSession?.subject,
        type: currentSession?.type
      });
      setMessage('');
    } catch (error) {
      toast({
        title: 'Error sending message',
        description: error.message,
        status: 'error',
        duration: 5000,
      });
    }
  };

  return (
    <Box maxW="800px" mx="auto" mt={8} p={4}>
      {currentSession && (
        <HStack mb={4} spacing={4}>
          <Badge colorScheme={currentSession.isLongTerm ? 'purple' : 'blue'}>
            {currentSession.type}
          </Badge>
          {currentSession.subject && (
            <Badge colorScheme="green">{currentSession.subject}</Badge>
          )}
        </HStack>
      )}

      <Box
        height="600px"
        borderWidth={1}
        borderRadius="lg"
        p={4}
        overflowY="auto"
        bg="white"
      >
        {loading ? (
          <Text>Loading messages...</Text>
        ) : (
          <VStack spacing={4} align="stretch">
            {messages.map((msg, index) => (
              <Box
                key={index}
                alignSelf={msg.isUser ? 'flex-end' : 'flex-start'}
                bg={msg.isUser ? 'blue.100' : 'gray.100'}
                p={3}
                borderRadius="lg"
                maxW="70%"
              >
                <Text>{msg.content}</Text>
              </Box>
            ))}
            <div ref={chatEndRef} />
          </VStack>
        )}
      </Box>

      <HStack mt={4} spacing={4}>
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
        />
        <Button colorScheme="blue" onClick={handleSend}>
          Send
        </Button>
      </HStack>
    </Box>
  );
}