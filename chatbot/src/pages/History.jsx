import {
    Box,
    VStack,
    Heading,
    Text,
    Tabs,
    TabList,
    TabPanels,
    Tab,
    TabPanel,
    Badge,
    HStack,
    Button,
    useDisclosure,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
  } from '@chakra-ui/react';
  import { useState } from 'react';
  import { useStudySessions } from '../hooks/useStudySessions';
  import { useChat } from '../hooks/useChat';
  
  export function History() {
    const { sessions, loading } = useStudySessions();
    const { messages } = useChat();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [selectedSession, setSelectedSession] = useState(null);
  
    const longTermSessions = sessions.filter(session => session.isLongTerm);
    const shortTermSessions = sessions.filter(session => !session.isLongTerm);
  
    const handleSessionClick = (session) => {
      setSelectedSession(session);
      onOpen();
    };
  
    const SessionCard = ({ session }) => (
      <Box
        borderWidth={1}
        borderRadius="lg"
        p={4}
        mb={3}
        cursor="pointer"
        _hover={{ bg: 'gray.50' }}
        onClick={() => handleSessionClick(session)}
      >
        <HStack justify="space-between" mb={2}>
          <Badge colorScheme={session.isLongTerm ? 'purple' : 'blue'}>
            {session.type}
          </Badge>
          <Text fontSize="sm" color="gray.600">
            {new Date(session.startDate.toDate()).toLocaleDateString()}
          </Text>
        </HStack>
        
        {session.subject && (
          <Text fontSize="sm" color="gray.700">
            Subject: {session.subject}
          </Text>
        )}
        
        <Text fontSize="sm" color="gray.600" mt={2}>
          Messages: {
            messages.filter(m => m.sessionId === session.id).length
          }
        </Text>
      </Box>
    );
  
    const SessionDetails = ({ session }) => {
      const sessionMessages = messages.filter(m => m.sessionId === session.id);
  
      return (
        <Modal isOpen={isOpen} onClose={onClose} size="xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              Study Session Details
              <Badge ml={2} colorScheme={session.isLongTerm ? 'purple' : 'blue'}>
                {session.type}
              </Badge>
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <VStack align="stretch" spacing={4}>
                <Box>
                  <Text fontWeight="bold">Date:</Text>
                  <Text>
                    {new Date(session.startDate.toDate()).toLocaleString()}
                  </Text>
                </Box>
                
                {session.subject && (
                  <Box>
                    <Text fontWeight="bold">Subject:</Text>
                    <Text>{session.subject}</Text>
                  </Box>
                )}
  
                <Box>
                  <Text fontWeight="bold">Chat History:</Text>
                  <VStack align="stretch" mt={2} maxH="400px" overflowY="auto">
                    {sessionMessages.map((msg, index) => (
                      <Box
                        key={index}
                        bg={msg.sender === 'user' ? 'blue.50' : 'gray.50'}
                        p={2}
                        borderRadius="md"
                      >
                        <Text fontSize="sm" fontWeight="bold">
                          {msg.sender === 'user' ? 'You' : 'AI'}:
                        </Text>
                        <Text>{msg.content}</Text>
                      </Box>
                    ))}
                  </VStack>
                </Box>
  
                <Button colorScheme="blue" onClick={onClose}>
                  Close
                </Button>
              </VStack>
            </ModalBody>
          </ModalContent>
        </Modal>
      );
    };
  
    return (
      <Box maxW="800px" mx="auto" mt={8} p={4}>
        <Heading size="lg" mb={6}>Study History</Heading>
  
        <Tabs>
          <TabList>
            <Tab>Long-term Sessions</Tab>
            <Tab>Short-term Sessions</Tab>
          </TabList>
  
          <TabPanels>
            <TabPanel>
              {loading ? (
                <Text>Loading...</Text>
              ) : longTermSessions.length > 0 ? (
                <VStack align="stretch">
                  {longTermSessions.map(session => (
                    <SessionCard key={session.id} session={session} />
                  ))}
                </VStack>
              ) : (
                <Text>No long-term sessions found</Text>
              )}
            </TabPanel>
  
            <TabPanel>
              {loading ? (
                <Text>Loading...</Text>
              ) : shortTermSessions.length > 0 ? (
                <VStack align="stretch">
                  {shortTermSessions.map(session => (
                    <SessionCard key={session.id} session={session} />
                  ))}
                </VStack>
              ) : (
                <Text>No short-term sessions found</Text>
              )}
            </TabPanel>
          </TabPanels>
        </Tabs>
  
        {selectedSession && (
          <SessionDetails session={selectedSession} />
        )}
      </Box>
    );
  }