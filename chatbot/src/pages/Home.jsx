import {
  Box,
  Grid,
  Heading,
  Text,
  Button,
  Stat,
  StatLabel,
  StatNumber,
  StatGroup,
  VStack,
  useDisclosure
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useStudySessions } from '../hooks/useStudySessions';
import { Calendar } from '../components/Calendar';
import { NewStudySessionModal } from '../components/NewStudySessionModal';

export function Home() {
  const navigate = useNavigate();
  const { currentUser, userProfile } = useAuth(); // Get userProfile from AuthContext
  const { sessions, loading } = useStudySessions();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const stats = {
    totalSessions: sessions.length,
    activeSessions: sessions.filter(s => s.status === 'active').length,
    completedSessions: sessions.filter(s => s.status === 'completed').length,
  };

  return (
    <Box maxW="1200px" mx="auto" mt={8} p={4}>
      <Grid templateColumns={{ base: '1fr', md: '2fr 1fr' }} gap={8}>
        <VStack align="stretch" spacing={6}>
          <Box>
            <Heading size="lg" mb={4}>
              Welcome back, {userProfile?.username || currentUser?.email.split('@')[0]} {/* Display username */}
            </Heading>
            <Button colorScheme="blue" onClick={() => navigate('/chat')}>
              Start Studying
            </Button>
          </Box>

          <StatGroup>
            <Stat>
              <StatLabel>Total Sessions</StatLabel>
              <StatNumber>{stats.totalSessions}</StatNumber>
            </Stat>
            <Stat>
              <StatLabel>Active Sessions</StatLabel>
              <StatNumber>{stats.activeSessions}</StatNumber>
            </Stat>
            <Stat>
              <StatLabel>Completed</StatLabel>
              <StatNumber>{stats.completedSessions}</StatNumber>
            </Stat>
          </StatGroup>

          <Box>
            <Heading size="md" mb={4}>Recent Sessions</Heading>
            {loading ? (
              <Text>Loading...</Text>
            ) : sessions.length > 0 ? (
              sessions.slice(0, 5).map(session => (
                <Box 
                  key={session.id}
                  p={4}
                  mb={2}
                  borderWidth={1}
                  borderRadius="md"
                  _hover={{ bg: 'gray.50' }}
                  cursor="pointer"
                  onClick={() => navigate(`/chat?session=${session.id}`)}
                >
                  <Text fontWeight="bold">{session.subject}</Text>
                  <Text fontSize="sm" color="gray.600">
                    {new Date(session.startDate.toDate()).toLocaleDateString()}
                  </Text>
                </Box>
              ))
            ) : (
              <Text>No study sessions yet</Text>
            )}
          </Box>
        </VStack>

        <Box>
          <Calendar />
        </Box>
      </Grid>

      <NewStudySessionModal isOpen={isOpen} onClose={onClose} />
    </Box>
  );
}