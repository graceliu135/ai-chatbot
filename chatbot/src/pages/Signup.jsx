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
  Divider,
  Heading
} from '@chakra-ui/react';

export function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  async function handleSubmit(e) {
    e.preventDefault();

    if (password !== confirmPassword) {
      return toast({
        title: 'Error',
        description: 'Passwords do not match',
        status: 'error',
        duration: 5000,
      });
    }

    try {
      setLoading(true);
      await signup(email, password);
      toast({
        title: 'Account created.',
        description: "You've successfully signed up!",
        status: 'success',
        duration: 5000,
      });
      navigate('/');
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 5000,
      });
    }

    setLoading(false);
  }

  async function handleGoogleSignIn() {
    try {
      await signInWithGoogle();
      navigate('/');
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
        <Heading size="lg">Sign Up</Heading>
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Confirm Password</FormLabel>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </FormControl>
            <Button
              type="submit"
              colorScheme="blue"
              width="100%"
              isLoading={loading}
            >
              Sign Up
            </Button>
          </VStack>
        </form>
        
        <Divider />
        
        <Button
          onClick={handleGoogleSignIn}
          width="100%"
          variant="outline"
        >
          Sign up with Google
        </Button>
        
        <Text>
          Already have an account?{' '}
          <Link color="blue.500" href="/login">
            Log In
          </Link>
        </Text>
      </VStack>
    </Box>
  );
}