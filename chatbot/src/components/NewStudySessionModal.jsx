import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    FormControl,
    FormLabel,
    Select,
    Input,
    Button,
    VStack,
    useToast
  } from '@chakra-ui/react';
  import { useState } from 'react';
  import { useStudySessions } from '../hooks/useStudySessions';
  
  export function NewStudySessionModal({ isOpen, onClose }) {
    const [type, setType] = useState('');
    const [subject, setSubject] = useState('');
    const [isLongTerm, setIsLongTerm] = useState(false);
    const { createSession } = useStudySessions();
    const toast = useToast();
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        await createSession({
          type,
          subject,
          startDate: new Date(),
          isLongTerm,
        });
        
        toast({
          title: 'Study session created',
          status: 'success',
          duration: 3000,
        });
        
        onClose();
      } catch (error) {
        toast({
          title: 'Error creating session',
          description: error.message,
          status: 'error',
          duration: 5000,
        });
      }
    };
  
    return (
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Start New Study Session</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={handleSubmit}>
              <VStack spacing={4}>
                <FormControl>
                  <FormLabel>Study Type</FormLabel>
                  <Select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    placeholder="Select type"
                    required
                  >
                    <option value="AP">AP</option>
                    <option value="SAT">SAT</option>
                    <option value="ACT">ACT</option>
                    <option value="homework">Homework</option>
                    <option value="test">Test</option>
                    <option value="project">Project</option>
                    <option value="essay">Essay</option>
                    <option value="learn">Learn</option>
                  </Select>
                </FormControl>
  
                {type === 'homework' && (
                  <FormControl>
                    <FormLabel>Class</FormLabel>
                    <Input
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="Enter class name"
                      required
                    />
                  </FormControl>
                )}
  
                <FormControl>
                  <FormLabel>Session Type</FormLabel>
                  <Select
                    value={isLongTerm.toString()}
                    onChange={(e) => setIsLongTerm(e.target.value === 'true')}
                    required
                  >
                    <option value="false">Short-term</option>
                    <option value="true">Long-term</option>
                  </Select>
                </FormControl>
  
                <Button type="submit" colorScheme="blue" width="100%">
                  Start Session
                </Button>
              </VStack>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    );
  }