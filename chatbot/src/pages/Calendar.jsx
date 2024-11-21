import { Box, Heading } from '@chakra-ui/react';
import { Calendar as CalendarComponent } from '../components/Calendar';

export function Calendar() {
  return (
    <Box maxW="1200px" mx="auto" mt={8} p={4}>
      <Heading mb={6}>Study Calendar</Heading>
      <CalendarComponent />
    </Box>
  );
}