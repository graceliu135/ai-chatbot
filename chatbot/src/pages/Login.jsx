import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Text,
  Link,
  useToast,
  Divider
} from '@chakra-ui/react';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      await login(email, password);
      navigate('/chat');
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 5000,
      });
    }

    setLoading(false);

    return (
        <Box maxW="md" mx="auto" mt={8} p={6} borderWidth={1} borderRadius="lg">
          <VStack spacing={4}>
            {/* ... existing form code ... */}
            
            <Text>
              Don't have an account?{' '}
              <Link color="blue.500" href="/signup">
                Sign Up
              </Link>
            </Text>
          </VStack>
        </Box>
      );
  }

  async function handleGoogleSignIn() {
    try {
      await signInWithGoogle();
      navigate('/chat');
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 5000,
      });
    }
  }

  return (
    <Box maxW="md" mx="auto" mt={8} p={6} borderWidth={1} borderRadius="lg">
      <VStack spacing={4}>
        <Text fontSize="2xl">Login</Text>
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <VStack spacing={4}>
            <FormControl>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </FormControl>
            <FormControl>
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </FormControl>
            <Button
              type="submit"
              colorScheme="blue"
              width="100%"
              isLoading={loading}
            >
              Login
            </Button>
          </VStack>
        </form>
        
        <Divider />
        
        <Button
          onClick={handleGoogleSignIn}
          width="100%"
          variant="outline"
        >
          Sign in with Google
        </Button>
        
        <Text>
          Don't have an account?{' '}
          <Link color="blue.500" href="/signup">
            Sign Up
          </Link>
        </Text>
      </VStack>
    </Box>
  );
}