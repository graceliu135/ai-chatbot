import { Box, Flex, Link as ChakraLink } from '@chakra-ui/react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function Navbar() {
  const location = useLocation();
  const { currentUser, logout } = useAuth();

  return (
    <Box bg="blue.500" py={3}>
      <Flex justify="center" gap={4}>
        <ChakraLink
          as={RouterLink}
          to="/"
          color="white"
          px={3}
          py={2}
          borderRadius="md"
          bg={location.pathname === '/' ? 'whiteAlpha.200' : 'transparent'}
          _hover={{ bg: 'whiteAlpha.200' }}
        >
          Home
        </ChakraLink>
        {currentUser && (
          <>
            <ChakraLink
              as={RouterLink}
              to="/chat"
              color="white"
              px={3}
              py={2}
              borderRadius="md"
              bg={location.pathname === '/chat' ? 'whiteAlpha.200' : 'transparent'}
              _hover={{ bg: 'whiteAlpha.200' }}
            >
              Chatbot
            </ChakraLink>
            <ChakraLink
              as={RouterLink}
              to="/calendar"
              color="white"
              px={3}
              py={2}
              borderRadius="md"
              bg={location.pathname === '/calendar' ? 'whiteAlpha.200' : 'transparent'}
              _hover={{ bg: 'whiteAlpha.200' }}
            >
              Calendar
            </ChakraLink>
            <ChakraLink
              as={RouterLink}
              to="/settings"
              color="white"
              px={3}
              py={2}
              borderRadius="md"
              bg={location.pathname === '/settings' ? 'whiteAlpha.200' : 'transparent'}
              _hover={{ bg: 'whiteAlpha.200' }}
            >
              Settings
            </ChakraLink>
            <ChakraLink
              as={RouterLink}
              to="/history"
              color="white"
              px={3}
              py={2}
              borderRadius="md"
              bg={location.pathname === '/history' ? 'whiteAlpha.200' : 'transparent'}
              _hover={{ bg: 'whiteAlpha.200' }}
            >
              History
            </ChakraLink>
            <ChakraLink
              onClick={logout}
              color="white"
              px={3}
              py={2}
              borderRadius="md"
              _hover={{ bg: 'whiteAlpha.200' }}
              cursor="pointer"
            >
              Logout
            </ChakraLink>
          </>
        )}
        {!currentUser && (
          <>
            <ChakraLink
              as={RouterLink}
              to="/login"
              color="white"
              px={3}
              py={2}
              borderRadius="md"
              _hover={{ bg: 'whiteAlpha.200' }}
            >
              Login
            </ChakraLink>
            <ChakraLink
              as={RouterLink}
              to="/signup"
              color="white"
              px={3}
              py={2}
              borderRadius="md"
              _hover={{ bg: 'whiteAlpha.200' }}
            >
              Sign Up
            </ChakraLink>
          </>
        )}
      </Flex>
    </Box>
  );
}