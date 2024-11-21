import {
    Box,
    VStack,
    Grid,
    Text,
    Badge,
    useColorModeValue,
  } from '@chakra-ui/react';
  import { useState, useEffect } from 'react';
  import { useStudySessions } from '../hooks/useStudySessions';
  
  export function Calendar() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [calendarDays, setCalendarDays] = useState([]);
    const { sessions } = useStudySessions();
    const bgColor = useColorModeValue('white', 'gray.700');
    const todayBg = useColorModeValue('blue.50', 'blue.900');
  
    useEffect(() => {
      generateCalendarDays();
    }, [currentDate, sessions]);
  
    const generateCalendarDays = () => {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);
      const days = [];
  
      // Add empty days for padding
      for (let i = 0; i < firstDay.getDay(); i++) {
        days.push({ date: null, sessions: [] });
      }
  
      // Add days with sessions
      for (let date = 1; date <= lastDay.getDate(); date++) {
        const currentDate = new Date(year, month, date);
        const daysSessions = sessions.filter(session => {
          const sessionDate = new Date(session.startDate.toDate());
          return (
            sessionDate.getDate() === date &&
            sessionDate.getMonth() === month &&
            sessionDate.getFullYear() === year
          );
        });
  
        days.push({
          date: currentDate,
          sessions: daysSessions,
        });
      }
  
      setCalendarDays(days);
    };
  
    const isToday = (date) => {
      if (!date) return false;
      const today = new Date();
      return (
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear()
      );
    };
  
    return (
      <Box bg={bgColor} p={4} borderRadius="lg" shadow="sm">
        <Text fontSize="xl" fontWeight="bold" mb={4}>
          {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </Text>
  
        <Grid templateColumns="repeat(7, 1fr)" gap={1}>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <Box key={day} textAlign="center" fontWeight="bold" fontSize="sm">
              {day}
            </Box>
          ))}
  
          {calendarDays.map((day, index) => (
            <Box
              key={index}
              p={2}
              bg={isToday(day.date) ? todayBg : 'transparent'}
              borderRadius="md"
              minH="80px"
            >
              {day.date && (
                <VStack align="stretch" spacing={1}>
                  <Text fontSize="sm">{day.date.getDate()}</Text>
                  {day.sessions.map((session, idx) => (
                    <Badge
                      key={idx}
                      colorScheme={session.isLongTerm ? 'purple' : 'blue'}
                      fontSize="xs"
                      p={1}
                      borderRadius="sm"
                      noOfLines={1}
                    >
                      {session.type}
                    </Badge>
                  ))}
                </VStack>
              )}
            </Box>
          ))}
        </Grid>
      </Box>
    );
  }